# 🍕 FoodieExpress - Quick Preview Setup

## 🚀 Quick Preview in 5 Minutes

This preview setup allows you to see the FoodieExpress platform running locally with sample data and basic functionality.

## 📋 Prerequisites

- Node.js 18+ installed
- Docker and Docker Compose installed
- Git installed

## ⚡ Quick Start

### Option 1: Full Docker Preview (Recommended)
```bash
# Clone the repository
git clone https://github.com/rafiabdul143/future_project_1.git
cd future_project_1

# Start the preview environment
npm run preview:start

# Wait 2-3 minutes for all services to start
# Then access the applications:
```

**🌐 Access URLs:**
- **Customer App**: http://localhost:3010
- **Restaurant Portal**: http://localhost:3011
- **Driver App**: http://localhost:3012
- **Admin Dashboard**: http://localhost:3013
- **API Gateway**: http://localhost:3000
- **Monitoring (Grafana)**: http://localhost:3014 (admin/admin123)

### Option 2: Development Preview
```bash
# Install dependencies
npm run install:all

# Start infrastructure services
docker-compose up -d mongodb redis kafka elasticsearch

# Start preview with sample data
npm run preview:dev
```

## 🎯 Preview Features

### 🛍️ Customer App Preview
- Browse sample restaurants
- View menu items with images
- Add items to cart
- Mock checkout process
- Order tracking simulation

### 🏪 Restaurant Portal Preview
- Dashboard with sample analytics
- Menu management interface
- Order queue simulation
- Basic reporting

### 🚗 Driver App Preview
- Driver dashboard
- Mock delivery assignments
- GPS tracking simulation
- Earnings overview

### 👨‍💼 Admin Dashboard Preview
- Platform overview
- User management
- Restaurant approval
- System monitoring

## 📊 Sample Data Included

The preview includes:
- **10 Sample Restaurants** with different cuisines
- **50+ Menu Items** with images and descriptions
- **Sample Users** for all roles (Customer, Restaurant, Driver, Admin)
- **Mock Orders** showing different statuses
- **Simulated GPS Tracking** data

## 🔑 Preview Login Credentials

### Customer Account
- Email: `customer@preview.com`
- Password: `preview123`

### Restaurant Owner
- Email: `restaurant@preview.com`
- Password: `preview123`

### Driver Account
- Email: `driver@preview.com`
- Password: `preview123`

### Admin Account
- Email: `admin@preview.com`
- Password: `preview123`

## 🎮 Interactive Demo Features

### Real-time Order Simulation
```bash
# Start order simulation (in new terminal)
npm run simulate:orders
```
This will create live orders flowing through the system.

### GPS Tracking Demo
```bash
# Start GPS tracking simulation
npm run simulate:delivery
```
Watch real-time delivery tracking on the map.

### Load Testing Preview
```bash
# Generate traffic to see performance
npm run simulate:traffic
```

## 🛠️ Preview Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Customer App  │    │ Restaurant App  │    │   Driver App    │
│  (React + Mock) │    │  (React + Mock) │    │ (React + Mock)  │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │    Preview API Server     │
                    │   (Express + Mock Data)   │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │     Mock Database         │
                    │   (In-Memory + Samples)   │
                    └───────────────────────────┘
```

## 📱 Mobile Preview

The preview is fully responsive! Try it on your mobile device:
1. Find your local IP address: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Access: `http://YOUR_IP:3010` on your mobile browser

## 🔧 Customizing the Preview

### Add Your Own Restaurant
```bash
# Edit preview data
nano preview/data/restaurants.json

# Restart preview
npm run preview:restart
```

### Change Sample Data
```bash
# Edit sample data files
ls preview/data/
# - restaurants.json
# - menu-items.json
# - users.json
# - orders.json
```

## 🚀 Performance Preview

The preview includes performance monitoring:
- **Response Times**: See API response times in real-time
- **Memory Usage**: Monitor system resource usage
- **Request Rates**: Track API request patterns
- **Error Rates**: Monitor system health

## 🎯 What You'll See

### Customer Experience
1. **Homepage** with restaurant listings
2. **Restaurant pages** with menus
3. **Shopping cart** functionality
4. **Checkout process** (mock payments)
5. **Order tracking** with live updates
6. **User profile** management

### Restaurant Experience
1. **Dashboard** with key metrics
2. **Menu management** interface
3. **Order queue** with real-time updates
4. **Analytics** and reporting
5. **Profile settings**

### Driver Experience
1. **Driver dashboard** with earnings
2. **Delivery assignments**
3. **GPS navigation** simulation
4. **Order management**
5. **Performance metrics**

### Admin Experience
1. **Platform overview** dashboard
2. **User management** tools
3. **Restaurant approval** workflow
4. **System monitoring**
5. **Analytics** and reports

## 🔄 Preview Limitations

This is a preview/demo version with:
- Mock payment processing (no real charges)
- Simulated GPS tracking (not real GPS)
- Sample data (not persistent)
- Simplified authentication
- Limited real-time features

## 🚀 Next Steps

After exploring the preview:
1. **Full Development Setup**: Follow the main README.md
2. **Implement Real Services**: Use the microservices architecture
3. **Add Real Payments**: Integrate Stripe/PayPal
4. **Deploy to Production**: Use the deployment guides

## 🆘 Troubleshooting

### Services Not Starting
```bash
# Check Docker status
docker ps

# Restart services
npm run preview:restart

# Check logs
npm run preview:logs
```

### Port Conflicts
```bash
# Stop conflicting services
sudo lsof -i :3010
sudo kill -9 <PID>

# Or use different ports
PORT=4010 npm run preview:start
```

### Memory Issues
```bash
# Increase Docker memory limit to 4GB+
# Or run minimal preview
npm run preview:minimal
```

## 📞 Support

If you encounter issues with the preview:
1. Check the troubleshooting section above
2. Review the logs: `npm run preview:logs`
3. Restart the preview: `npm run preview:restart`

---

**Enjoy exploring FoodieExpress! 🍕✨**
