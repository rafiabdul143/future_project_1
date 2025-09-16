const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Load sample data
const loadSampleData = () => {
  try {
    const restaurants = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/restaurants.json'), 'utf8'));
    const menuItems = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/menu-items.json'), 'utf8'));
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/users.json'), 'utf8'));
    const orders = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/orders.json'), 'utf8'));
    
    return { restaurants, menuItems, users, orders };
  } catch (error) {
    console.error('Error loading sample data:', error);
    return { restaurants: [], menuItems: [], users: [], orders: [] };
  }
};

const sampleData = loadSampleData();

// Mock authentication middleware
const mockAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token === 'preview-token') {
    req.user = { id: 1, role: 'customer', email: 'customer@preview.com' };
  }
  next();
};

// API Routes

// Authentication
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = sampleData.users.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({
      success: true,
      token: 'preview-token',
      user: { ...user, password: undefined }
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Restaurants
app.get('/api/restaurants', (req, res) => {
  const { cuisine, search, lat, lng } = req.query;
  let restaurants = [...sampleData.restaurants];
  
  if (cuisine) {
    restaurants = restaurants.filter(r => r.cuisine.includes(cuisine));
  }
  
  if (search) {
    restaurants = restaurants.filter(r => 
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Mock distance calculation if lat/lng provided
  if (lat && lng) {
    restaurants = restaurants.map(r => ({
      ...r,
      distance: Math.random() * 10 + 0.5, // Random distance 0.5-10.5 km
      deliveryTime: Math.floor(Math.random() * 30) + 15 // 15-45 minutes
    })).sort((a, b) => a.distance - b.distance);
  }
  
  res.json({ restaurants });
});

app.get('/api/restaurants/:id', (req, res) => {
  const restaurant = sampleData.restaurants.find(r => r.id === parseInt(req.params.id));
  if (restaurant) {
    const menuItems = sampleData.menuItems.filter(item => item.restaurantId === restaurant.id);
    res.json({ restaurant: { ...restaurant, menuItems } });
  } else {
    res.status(404).json({ message: 'Restaurant not found' });
  }
});

// Menu Items
app.get('/api/restaurants/:id/menu', (req, res) => {
  const restaurantId = parseInt(req.params.id);
  const menuItems = sampleData.menuItems.filter(item => item.restaurantId === restaurantId);
  
  // Group by category
  const categories = {};
  menuItems.forEach(item => {
    if (!categories[item.category]) {
      categories[item.category] = [];
    }
    categories[item.category].push(item);
  });
  
  res.json({ categories });
});

// Orders
app.get('/api/orders', mockAuth, (req, res) => {
  const userOrders = sampleData.orders.filter(order => order.customerId === req.user?.id);
  res.json({ orders: userOrders });
});

app.post('/api/orders', mockAuth, (req, res) => {
  const newOrder = {
    id: Date.now(),
    customerId: req.user?.id || 1,
    restaurantId: req.body.restaurantId,
    items: req.body.items,
    total: req.body.total,
    status: 'placed',
    createdAt: new Date().toISOString(),
    estimatedDeliveryTime: new Date(Date.now() + 30 * 60000).toISOString()
  };
  
  sampleData.orders.push(newOrder);
  res.json({ success: true, order: newOrder });
});

app.get('/api/orders/:id/track', (req, res) => {
  const order = sampleData.orders.find(o => o.id === parseInt(req.params.id));
  if (order) {
    // Mock real-time tracking data
    const trackingData = {
      order,
      driver: {
        name: 'John Doe',
        phone: '+1234567890',
        vehicle: 'Honda Civic - ABC123',
        rating: 4.8
      },
      location: {
        lat: 40.7128 + (Math.random() - 0.5) * 0.01,
        lng: -74.0060 + (Math.random() - 0.5) * 0.01
      },
      estimatedArrival: new Date(Date.now() + 15 * 60000).toISOString()
    };
    res.json(trackingData);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

// Search
app.get('/api/search', (req, res) => {
  const { q } = req.query;
  const results = {
    restaurants: sampleData.restaurants.filter(r => 
      r.name.toLowerCase().includes(q.toLowerCase()) ||
      r.cuisine.some(c => c.toLowerCase().includes(q.toLowerCase()))
    ),
    menuItems: sampleData.menuItems.filter(item =>
      item.name.toLowerCase().includes(q.toLowerCase()) ||
      item.description.toLowerCase().includes(q.toLowerCase())
    )
  };
  res.json(results);
});

// Dashboard data for different user roles
app.get('/api/dashboard/customer', mockAuth, (req, res) => {
  const userOrders = sampleData.orders.filter(o => o.customerId === req.user?.id);
  const favoriteRestaurants = sampleData.restaurants.slice(0, 3);
  
  res.json({
    recentOrders: userOrders.slice(0, 5),
    favoriteRestaurants,
    recommendations: sampleData.restaurants.slice(3, 8),
    stats: {
      totalOrders: userOrders.length,
      totalSpent: userOrders.reduce((sum, order) => sum + order.total, 0),
      favoriteRestaurants: favoriteRestaurants.length
    }
  });
});

app.get('/api/dashboard/restaurant', mockAuth, (req, res) => {
  const restaurantOrders = sampleData.orders.filter(o => o.restaurantId === 1);
  
  res.json({
    todayOrders: restaurantOrders.length,
    todayRevenue: restaurantOrders.reduce((sum, order) => sum + order.total, 0),
    avgOrderValue: restaurantOrders.length > 0 ? 
      restaurantOrders.reduce((sum, order) => sum + order.total, 0) / restaurantOrders.length : 0,
    rating: 4.5,
    recentOrders: restaurantOrders.slice(0, 10),
    popularItems: sampleData.menuItems.slice(0, 5)
  });
});

app.get('/api/dashboard/driver', mockAuth, (req, res) => {
  res.json({
    todayEarnings: 125.50,
    completedDeliveries: 8,
    avgDeliveryTime: 22,
    rating: 4.7,
    activeDelivery: sampleData.orders.find(o => o.status === 'on_the_way'),
    availableDeliveries: sampleData.orders.filter(o => o.status === 'ready').slice(0, 3)
  });
});

app.get('/api/dashboard/admin', mockAuth, (req, res) => {
  res.json({
    totalUsers: sampleData.users.length,
    totalRestaurants: sampleData.restaurants.length,
    totalOrders: sampleData.orders.length,
    todayRevenue: sampleData.orders.reduce((sum, order) => sum + order.total, 0),
    recentOrders: sampleData.orders.slice(0, 10),
    pendingRestaurants: sampleData.restaurants.filter(r => !r.isVerified),
    systemHealth: {
      apiStatus: 'healthy',
      databaseStatus: 'healthy',
      paymentStatus: 'healthy'
    }
  });
});

// WebSocket simulation for real-time updates
const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Simulate order status updates
  socket.on('trackOrder', (orderId) => {
    console.log('Tracking order:', orderId);
    
    // Simulate status updates every 10 seconds
    const statusUpdates = ['confirmed', 'preparing', 'ready', 'picked_up', 'on_the_way', 'delivered'];
    let currentStatus = 0;
    
    const updateInterval = setInterval(() => {
      if (currentStatus < statusUpdates.length) {
        socket.emit('orderStatusUpdate', {
          orderId,
          status: statusUpdates[currentStatus],
          timestamp: new Date().toISOString(),
          message: `Order is ${statusUpdates[currentStatus].replace('_', ' ')}`
        });
        currentStatus++;
      } else {
        clearInterval(updateInterval);
      }
    }, 10000);
  });
  
  // Simulate driver location updates
  socket.on('trackDriver', (orderId) => {
    const locationInterval = setInterval(() => {
      socket.emit('driverLocationUpdate', {
        orderId,
        location: {
          lat: 40.7128 + (Math.random() - 0.5) * 0.01,
          lng: -74.0060 + (Math.random() - 0.5) * 0.01
        },
        timestamp: new Date().toISOString()
      });
    }, 5000);
    
    // Stop after 5 minutes
    setTimeout(() => clearInterval(locationInterval), 300000);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Serve React apps (in production, these would be separate services)
app.get('/customer/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/customer/index.html'));
});

app.get('/restaurant/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/restaurant/index.html'));
});

app.get('/driver/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/driver/index.html'));
});

app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin/index.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🍕 FoodieExpress Preview Server running on port ${PORT}`);
  console.log(`🌐 Access URLs:`);
  console.log(`   Customer App: http://localhost:${PORT}/customer`);
  console.log(`   Restaurant Portal: http://localhost:${PORT}/restaurant`);
  console.log(`   Driver App: http://localhost:${PORT}/driver`);
  console.log(`   Admin Dashboard: http://localhost:${PORT}/admin`);
  console.log(`   API Docs: http://localhost:${PORT}/api`);
});

module.exports = app;
