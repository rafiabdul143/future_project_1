# 📁 FoodieExpress - Project Structure

## 🏗️ Complete Directory Structure

```
foodie-express/
├── README.md
├── package.json
├── docker-compose.yml
├── .gitignore
├── .env.example
├── LICENSE
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── FRONTEND_COMPONENTS.md
│   ├── DEPLOYMENT.md
│   ├── API_DOCUMENTATION.md
│   └── CONTRIBUTING.md
│
├── services/
│   ├── api-gateway/
│   ├── user-service/
│   ├── restaurant-service/
│   ├── menu-service/
│   ├── order-service/
│   ├── payment-service/
│   ├── delivery-service/
│   ├── notification-service/
│   ├── review-service/
│   └── search-service/
│
├── frontend/
│   ├── customer-app/
│   ├── restaurant-portal/
│   ├── driver-app/
│   └── admin-dashboard/
│
├── shared/
│   ├── utils/
│   ├── constants/
│   ├── types/
│   └── middleware/
│
├── infrastructure/
│   ├── kubernetes/
│   ├── terraform/
│   ├── docker/
│   └── scripts/
│
├── monitoring/
│   ├── prometheus/
│   ├── grafana/
│   └── alerts/
│
└── tests/
    ├── integration/
    ├── e2e/
    └── load/
```

## 🔧 Microservices Structure

Each microservice follows this standard structure:

```
service-name/
├── src/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── config/
│   └── index.js
├── tests/
├── Dockerfile
├── package.json
├── .env.example
└── README.md
```

## 🎨 Frontend Structure

Each frontend application follows this structure:

```
app-name/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── store/
│   ├── utils/
│   ├── styles/
│   └── App.js
├── package.json
├── Dockerfile
└── README.md
```
