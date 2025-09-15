# 🚀 FoodieExpress - Deployment & Development Guide

## 📋 Table of Contents
- [Development Setup](#development-setup)
- [Environment Configuration](#environment-configuration)
- [Docker Deployment](#docker-deployment)
- [Production Deployment](#production-deployment)
- [Monitoring & Observability](#monitoring--observability)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)

## 🛠️ Development Setup

### Prerequisites
Before starting, ensure you have the following installed:

- **Node.js** 18+ and npm 8+
- **Docker** 20+ and Docker Compose 2+
- **Git** for version control
- **MongoDB** 5.0+ (optional if using Docker)
- **Redis** 6.0+ (optional if using Docker)

### Quick Start

1. **Clone the Repository**
```bash
git clone https://github.com/rafiabdul143/future_project_1.git
cd future_project_1
```

2. **Install Dependencies**
```bash
# Install root dependencies
npm install

# Install all service and frontend dependencies
npm run install:all
```

3. **Environment Setup**
```bash
# Copy environment templates
cp .env.example .env
cp services/user-service/.env.example services/user-service/.env
# Repeat for all services...

# Update environment variables with your values
```

4. **Start Development Environment**
```bash
# Option 1: Using Docker (Recommended)
docker-compose up -d

# Option 2: Local development
npm run dev
```

5. **Access Applications**
- **API Gateway**: http://localhost:3000
- **Customer App**: http://localhost:3010
- **Restaurant Portal**: http://localhost:3011
- **Driver App**: http://localhost:3012
- **Admin Dashboard**: http://localhost:3013
- **Grafana**: http://localhost:3014
- **Prometheus**: http://localhost:9090

### Development Workflow

#### Running Individual Services
```bash
# Start specific microservice
npm run dev:user
npm run dev:restaurant
npm run dev:menu
# ... etc

# Start specific frontend app
npm run dev:customer
npm run dev:restaurant-portal
npm run dev:driver
npm run dev:admin
```

#### Code Quality & Testing
```bash
# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format

# Testing
npm run test
npm run test:services
npm run test:frontend
```

#### Database Management
```bash
# MongoDB operations
docker exec -it foodie-mongodb mongosh
use user_service
db.users.find()

# Redis operations
docker exec -it foodie-redis redis-cli
AUTH redis123
KEYS *
```

## ⚙️ Environment Configuration

### Core Environment Variables

#### API Gateway (.env)
```bash
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-here-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here-min-32-chars
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=http://localhost:3010,http://localhost:3011,http://localhost:3012,http://localhost:3013

# Service URLs
USER_SERVICE_URL=http://localhost:3001
RESTAURANT_SERVICE_URL=http://localhost:3002
MENU_SERVICE_URL=http://localhost:3003
ORDER_SERVICE_URL=http://localhost:3004
PAYMENT_SERVICE_URL=http://localhost:3005
DELIVERY_SERVICE_URL=http://localhost:3006
NOTIFICATION_SERVICE_URL=http://localhost:3007
REVIEW_SERVICE_URL=http://localhost:3008
SEARCH_SERVICE_URL=http://localhost:3009

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### User Service (.env)
```bash
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/user_service
JWT_SECRET=your-super-secret-jwt-key-here-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379
KAFKA_BROKERS=localhost:9092

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Social Login
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
```

#### Payment Service (.env)
```bash
NODE_ENV=development
PORT=3005
MONGODB_URI=mongodb://localhost:27017/payment_service
REDIS_URL=redis://localhost:6379
KAFKA_BROKERS=localhost:9092

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox

# Apple Pay
APPLE_PAY_MERCHANT_ID=merchant.com.foodieexpress
APPLE_PAY_CERTIFICATE_PATH=./certs/apple-pay.pem
```

#### Delivery Service (.env)
```bash
NODE_ENV=development
PORT=3006
MONGODB_URI=mongodb://localhost:27017/delivery_service
REDIS_URL=redis://localhost:6379
KAFKA_BROKERS=localhost:9092

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_PLACES_API_KEY=your_google_places_api_key

# Real-time Tracking
SOCKET_IO_PORT=3016
LOCATION_UPDATE_INTERVAL=5000
DRIVER_ASSIGNMENT_RADIUS=10

# Route Optimization
ENABLE_ROUTE_OPTIMIZATION=true
MAX_DELIVERY_DISTANCE=25
```

#### Notification Service (.env)
```bash
NODE_ENV=development
PORT=3007
MONGODB_URI=mongodb://localhost:27017/notification_service
REDIS_URL=redis://localhost:6379
KAFKA_BROKERS=localhost:9092

# Firebase (Push Notifications)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Firebase Private Key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Twilio (SMS)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# SendGrid (Email)
SENDGRID_API_KEY=SG.your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@foodieexpress.com
SENDGRID_FROM_NAME=FoodieExpress

# Socket.IO
SOCKET_IO_PORT=3017
```

### Frontend Environment Variables

#### Customer App (.env)
```bash
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_SOCKET_URL=http://localhost:3000
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
REACT_APP_PAYPAL_CLIENT_ID=your_paypal_client_id

# Firebase Configuration (JSON string)
REACT_APP_FIREBASE_CONFIG={"apiKey":"your-api-key","authDomain":"your-project.firebaseapp.com","projectId":"your-project-id","storageBucket":"your-project.appspot.com","messagingSenderId":"123456789","appId":"your-app-id"}

# Feature Flags
REACT_APP_ENABLE_SOCIAL_LOGIN=true
REACT_APP_ENABLE_APPLE_PAY=true
REACT_APP_ENABLE_GOOGLE_PAY=true
REACT_APP_ENABLE_CRYPTO_PAYMENT=false
```

## 🐳 Docker Deployment

### Development with Docker

1. **Build and Start Services**
```bash
# Build all images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

2. **Individual Service Management**
```bash
# Start specific services
docker-compose up -d mongodb redis kafka
docker-compose up -d user-service restaurant-service

# Scale services
docker-compose up -d --scale user-service=3

# Restart service
docker-compose restart user-service
```

3. **Database Initialization**
```bash
# Initialize MongoDB with sample data
docker exec -it foodie-mongodb mongosh /docker-entrypoint-initdb.d/mongo-init.js

# Create Kafka topics
docker exec -it foodie-kafka kafka-topics --create --topic order-events --bootstrap-server localhost:9092
```

### Production Docker Setup

#### Multi-stage Dockerfile Example (Node.js Service)
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Production stage
FROM node:18-alpine AS production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
WORKDIR /app
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .
USER nodejs
EXPOSE 3001
CMD ["node", "src/index.js"]
```

#### Production Docker Compose
```yaml
version: '3.8'
services:
  user-service:
    image: foodieexpress/user-service:latest
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## ☁️ Production Deployment

### AWS Deployment Architecture

#### Infrastructure Components
- **ECS Fargate**: Container orchestration
- **Application Load Balancer**: Traffic distribution
- **RDS MongoDB**: Managed database
- **ElastiCache Redis**: Managed caching
- **Amazon MSK**: Managed Kafka
- **CloudFront**: CDN for static assets
- **Route 53**: DNS management
- **Certificate Manager**: SSL certificates

#### Deployment Steps

1. **Infrastructure Setup**
```bash
# Install AWS CLI and configure
aws configure

# Create VPC and networking
aws cloudformation create-stack \
  --stack-name foodie-express-vpc \
  --template-body file://infrastructure/vpc.yaml

# Create ECS cluster
aws ecs create-cluster --cluster-name foodie-express-cluster
```

2. **Database Setup**
```bash
# Create MongoDB Atlas cluster or AWS DocumentDB
# Create ElastiCache Redis cluster
# Create Amazon MSK cluster
```

3. **Container Registry**
```bash
# Create ECR repositories
aws ecr create-repository --repository-name foodie-express/user-service
aws ecr create-repository --repository-name foodie-express/restaurant-service
# ... repeat for all services

# Build and push images
docker build -t foodie-express/user-service:latest services/user-service/
docker tag foodie-express/user-service:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/foodie-express/user-service:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/foodie-express/user-service:latest
```

4. **ECS Service Deployment**
```bash
# Create task definitions
aws ecs register-task-definition --cli-input-json file://infrastructure/user-service-task.json

# Create services
aws ecs create-service \
  --cluster foodie-express-cluster \
  --service-name user-service \
  --task-definition user-service:1 \
  --desired-count 3 \
  --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=user-service,containerPort=3001
```

### Kubernetes Deployment

#### Namespace and ConfigMaps
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: foodie-express
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: foodie-express
data:
  NODE_ENV: "production"
  MONGODB_URI: "mongodb://mongodb-service:27017/foodie_express"
  REDIS_URL: "redis://redis-service:6379"
```

#### Service Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  namespace: foodie-express
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: foodieexpress/user-service:latest
        ports:
        - containerPort: 3001
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: NODE_ENV
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 5
```

## 📊 Monitoring & Observability

### Prometheus Configuration
```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "rules/*.yml"

scrape_configs:
  - job_name: 'api-gateway'
    static_configs:
      - targets: ['api-gateway:3000']
    metrics_path: '/metrics'
    scrape_interval: 5s

  - job_name: 'user-service'
    static_configs:
      - targets: ['user-service:3001']
    metrics_path: '/metrics'
    scrape_interval: 5s

  - job_name: 'mongodb'
    static_configs:
      - targets: ['mongodb-exporter:9216']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']
```

### Grafana Dashboards
```json
{
  "dashboard": {
    "title": "FoodieExpress - System Overview",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{service}}"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      }
    ]
  }
}
```

### Application Logging
```javascript
// Structured logging with Winston
const winston = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new ElasticsearchTransport({
      level: 'info',
      clientOpts: { node: 'http://elasticsearch:9200' },
      index: 'foodie-express-logs'
    })
  ]
});
```

## 🔒 Security Considerations

### Environment Security
```bash
# Use secrets management
export JWT_SECRET=$(aws secretsmanager get-secret-value --secret-id prod/jwt-secret --query SecretString --output text)

# Encrypt sensitive environment variables
gpg --symmetric --cipher-algo AES256 .env.production
```

### Container Security
```dockerfile
# Use non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# Use distroless base images for production
FROM gcr.io/distroless/nodejs18-debian11
```

### Network Security
```yaml
# Docker Compose network isolation
networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true
```

## 🔧 Troubleshooting

### Common Issues

#### Service Discovery Issues
```bash
# Check service connectivity
docker exec -it foodie-api-gateway curl http://user-service:3001/health

# Check DNS resolution
docker exec -it foodie-api-gateway nslookup user-service
```

#### Database Connection Issues
```bash
# Check MongoDB connection
docker exec -it foodie-mongodb mongosh --eval "db.adminCommand('ismaster')"

# Check Redis connection
docker exec -it foodie-redis redis-cli ping
```

#### Memory Issues
```bash
# Check container memory usage
docker stats

# Increase memory limits
docker-compose up -d --scale user-service=2
```

### Performance Optimization

#### Database Optimization
```javascript
// MongoDB indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.restaurants.createIndex({ location: "2dsphere" });
db.orders.createIndex({ customerId: 1, createdAt: -1 });
```

#### Caching Strategy
```javascript
// Redis caching
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

const cacheMiddleware = (ttl = 300) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    const cached = await client.get(key);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    res.sendResponse = res.json;
    res.json = (body) => {
      client.setex(key, ttl, JSON.stringify(body));
      res.sendResponse(body);
    };
    
    next();
  };
};
```

### Health Checks
```javascript
// Health check endpoint
app.get('/health', async (req, res) => {
  const health = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    checks: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      kafka: await checkKafka()
    }
  };
  
  const isHealthy = Object.values(health.checks).every(check => check.status === 'OK');
  res.status(isHealthy ? 200 : 503).json(health);
});
```

This comprehensive deployment guide provides everything needed to set up, deploy, and maintain the FoodieExpress platform in both development and production environments.
