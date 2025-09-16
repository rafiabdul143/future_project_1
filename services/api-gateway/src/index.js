const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');
const redis = require('redis');
const winston = require('winston');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'api-gateway' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Redis client for caching and rate limiting
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error:', err);
});

redisClient.connect().catch(console.error);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));
app.use(compression());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// JWT Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    // Check if token is blacklisted
    const isBlacklisted = await redisClient.get(`blacklist_${token}`);
    if (isBlacklisted) {
      return res.status(401).json({ error: 'Token has been revoked' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('JWT verification failed:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Service endpoints configuration
const services = {
  user: process.env.USER_SERVICE_URL || 'http://localhost:3001',
  restaurant: process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3002',
  menu: process.env.MENU_SERVICE_URL || 'http://localhost:3003',
  order: process.env.ORDER_SERVICE_URL || 'http://localhost:3004',
  payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005',
  delivery: process.env.DELIVERY_SERVICE_URL || 'http://localhost:3006',
  notification: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3007',
  review: process.env.REVIEW_SERVICE_URL || 'http://localhost:3008',
  search: process.env.SEARCH_SERVICE_URL || 'http://localhost:3009'
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: Object.keys(services)
  });
});

// Public routes (no authentication required)
const publicRoutes = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
  '/api/restaurants/public',
  '/api/menu/public',
  '/api/health'
];

// Authentication middleware for protected routes
app.use('/api', (req, res, next) => {
  const isPublicRoute = publicRoutes.some(route => req.path.startsWith(route));
  if (isPublicRoute) {
    return next();
  }
  return authenticateToken(req, res, next);
});

// Proxy configuration with error handling
const createProxy = (target, pathRewrite = {}) => {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite,
    onError: (err, req, res) => {
      logger.error(`Proxy error for ${req.url}:`, err);
      res.status(503).json({
        error: 'Service temporarily unavailable',
        message: 'The requested service is currently unavailable. Please try again later.'
      });
    },
    onProxyReq: (proxyReq, req, res) => {
      // Add user info to headers for downstream services
      if (req.user) {
        proxyReq.setHeader('X-User-ID', req.user.userId);
        proxyReq.setHeader('X-User-Role', req.user.role);
        proxyReq.setHeader('X-User-Email', req.user.email);
      }
      
      // Log the request
      logger.info(`Proxying ${req.method} ${req.url} to ${proxyReq.getHeader('host')}`);
    }
  });
};

// Route proxying
app.use('/api/auth', createProxy(services.user, { '^/api/auth': '/auth' }));
app.use('/api/users', createProxy(services.user, { '^/api/users': '/users' }));
app.use('/api/restaurants', createProxy(services.restaurant, { '^/api/restaurants': '/restaurants' }));
app.use('/api/menu', createProxy(services.menu, { '^/api/menu': '/menu' }));
app.use('/api/orders', createProxy(services.order, { '^/api/orders': '/orders' }));
app.use('/api/payments', createProxy(services.payment, { '^/api/payments': '/payments' }));
app.use('/api/delivery', createProxy(services.delivery, { '^/api/delivery': '/delivery' }));
app.use('/api/notifications', createProxy(services.notification, { '^/api/notifications': '/notifications' }));
app.use('/api/reviews', createProxy(services.review, { '^/api/reviews': '/reviews' }));
app.use('/api/search', createProxy(services.search, { '^/api/search': '/search' }));

// Global error handler
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred. Please try again later.'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested endpoint does not exist'
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await redisClient.quit();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await redisClient.quit();
  process.exit(0);
});

app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
  logger.info('Service endpoints:', services);
});

module.exports = app;
