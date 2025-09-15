# 🎨 FoodieExpress - Frontend Components & Pages Documentation

## 📋 Table of Contents
- [Customer Application](#customer-application)
- [Restaurant Owner Portal](#restaurant-owner-portal)
- [Delivery Driver App](#delivery-driver-app)
- [Admin Dashboard](#admin-dashboard)
- [Shared Components](#shared-components)
- [State Management](#state-management)
- [Routing Structure](#routing-structure)

## 🛍️ Customer Application

### 📱 Page Structure & Components

#### 1. Homepage (`/`)
**Components:**
- `HeroSection` - Main banner with search functionality
- `SearchBar` - Location-based restaurant search
- `CategoryGrid` - Food category tiles (Pizza, Burgers, etc.)
- `FeaturedRestaurants` - Promoted restaurant carousel
- `PopularNearYou` - Location-based recommendations
- `PromoBanner` - Promotional offers display
- `Footer` - Links and information

**Features:**
- Geolocation-based restaurant discovery
- Quick category filtering
- Promotional banner carousel
- Recently ordered restaurants

```jsx
// Homepage Component Structure
const Homepage = () => {
  return (
    <div className="homepage">
      <HeroSection />
      <SearchBar onSearch={handleSearch} />
      <CategoryGrid categories={foodCategories} />
      <FeaturedRestaurants restaurants={featuredRestaurants} />
      <PopularNearYou userLocation={userLocation} />
      <PromoBanner offers={currentOffers} />
      <Footer />
    </div>
  );
};
```

#### 2. Authentication Pages
**Login Page (`/login`)**
- `LoginForm` - Email/password login
- `SocialLoginButtons` - Google, Facebook, Apple login
- `ForgotPasswordLink` - Password reset link
- `SignupRedirect` - Link to registration

**Register Page (`/register`)**
- `RegistrationForm` - Multi-step registration
- `PhoneVerification` - OTP verification
- `ProfileSetup` - Initial profile completion
- `TermsAndConditions` - Legal agreements

#### 3. Restaurant Discovery
**Restaurant List Page (`/restaurants`)**
- `FilterSidebar` - Cuisine, price, rating filters
- `SortingOptions` - Sort by distance, rating, delivery time
- `RestaurantGrid` - Restaurant cards with key info
- `MapToggle` - Switch between list and map view
- `LoadMoreButton` - Pagination for infinite scroll

**Restaurant Detail Page (`/restaurant/:id`)**
- `RestaurantHeader` - Name, rating, delivery info
- `RestaurantImages` - Photo gallery carousel
- `MenuNavigation` - Category tabs for menu sections
- `MenuItemCard` - Individual dish display
- `AddToCartModal` - Customization options
- `ReviewsSection` - Customer reviews and ratings
- `RestaurantInfo` - Hours, location, contact

```jsx
// Restaurant Detail Page Structure
const RestaurantDetail = ({ restaurantId }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState([]);

  return (
    <div className="restaurant-detail">
      <RestaurantHeader restaurant={restaurant} />
      <RestaurantImages images={restaurant.images} />
      <div className="content-wrapper">
        <MenuNavigation 
          categories={menuCategories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
        <MenuSection 
          items={filteredMenuItems}
          onAddToCart={handleAddToCart}
        />
      </div>
      <ReviewsSection restaurantId={restaurantId} />
      <RestaurantInfo restaurant={restaurant} />
    </div>
  );
};
```

#### 4. Shopping & Checkout
**Shopping Cart Page (`/cart`)**
- `CartItemList` - Items with quantity controls
- `ItemCustomizations` - Display selected options
- `PromoCodeInput` - Discount code application
- `OrderSummary` - Subtotal, taxes, fees breakdown
- `CheckoutButton` - Proceed to checkout

**Checkout Page (`/checkout`)**
- `DeliveryAddressSelector` - Address selection/addition
- `PaymentMethodSelector` - Payment options
- `OrderReview` - Final order confirmation
- `SpecialInstructions` - Additional notes
- `PlaceOrderButton` - Final order submission

#### 5. Order Management
**Order Tracking Page (`/order/:id/track`)**
- `OrderStatusTimeline` - Visual progress indicator
- `LiveMap` - Real-time driver tracking
- `OrderDetails` - Items and restaurant info
- `DriverInfo` - Driver details and contact
- `DeliveryUpdates` - Status notifications
- `ChatInterface` - Communication with driver/restaurant

**Order History Page (`/orders`)**
- `OrderHistoryList` - Past orders with details
- `OrderFilters` - Filter by date, restaurant, status
- `ReorderButton` - Quick reorder functionality
- `ReceiptDownload` - Order receipt generation
- `ReviewPrompt` - Rate and review orders

#### 6. User Profile
**Profile Page (`/profile`)**
- `ProfileHeader` - User info and avatar
- `PersonalInfoForm` - Edit personal details
- `AddressBook` - Manage delivery addresses
- `PaymentMethods` - Manage payment options
- `NotificationSettings` - Preference controls
- `AccountSecurity` - Password and security settings

**Address Management (`/profile/addresses`)**
- `AddressList` - Saved addresses display
- `AddAddressForm` - New address creation
- `AddressValidation` - Google Places integration
- `DefaultAddressSelector` - Set primary address

#### 7. Search & Discovery
**Search Results Page (`/search`)**
- `SearchFilters` - Refine search results
- `SearchResults` - Restaurants and dishes
- `SearchSuggestions` - Auto-complete suggestions
- `NoResultsState` - Empty state handling
- `RecentSearches` - Search history

### 🎨 UI Components Library

#### Core Components
```jsx
// Button Component
const Button = ({ 
  variant = 'primary', 
  size = 'medium', 
  loading = false, 
  disabled = false,
  children,
  onClick,
  ...props 
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${loading ? 'loading' : ''}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};

// Input Component
const Input = ({ 
  label, 
  error, 
  icon, 
  type = 'text',
  ...props 
}) => {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={type}
          className={`input ${error ? 'error' : ''} ${icon ? 'with-icon' : ''}`}
          {...props}
        />
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

// Card Component
const Card = ({ 
  children, 
  className = '', 
  hover = false,
  onClick 
}) => {
  return (
    <div 
      className={`card ${hover ? 'hover' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
```

## 🏪 Restaurant Owner Portal

### 📊 Dashboard & Management Pages

#### 1. Restaurant Dashboard (`/restaurant/dashboard`)
**Components:**
- `DashboardStats` - Key metrics (orders, revenue, ratings)
- `OrderQueue` - Incoming orders management
- `SalesChart` - Revenue analytics visualization
- `PopularItems` - Best-selling menu items
- `RecentReviews` - Latest customer feedback
- `QuickActions` - Common tasks shortcuts

```jsx
const RestaurantDashboard = () => {
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);

  return (
    <div className="restaurant-dashboard">
      <DashboardHeader restaurant={restaurant} />
      <div className="dashboard-grid">
        <DashboardStats stats={stats} />
        <OrderQueue 
          orders={orders}
          onAcceptOrder={handleAcceptOrder}
          onRejectOrder={handleRejectOrder}
        />
        <SalesChart data={salesData} />
        <PopularItems items={popularItems} />
      </div>
    </div>
  );
};
```

#### 2. Menu Management (`/restaurant/menu`)
**Components:**
- `MenuBuilder` - Drag-and-drop menu creation
- `CategoryManager` - Menu category organization
- `ItemEditor` - Menu item creation/editing
- `PriceManager` - Bulk price updates
- `InventoryTracker` - Stock level management
- `MenuPreview` - Customer view preview

#### 3. Order Management (`/restaurant/orders`)
**Components:**
- `OrderTabs` - Filter by status (new, preparing, ready)
- `OrderCard` - Individual order display
- `KitchenDisplay` - Order preparation interface
- `TimerManager` - Preparation time tracking
- `OrderActions` - Accept, reject, update status
- `OrderHistory` - Past orders archive

#### 4. Analytics & Reports (`/restaurant/analytics`)
**Components:**
- `RevenueChart` - Sales performance over time
- `OrderAnalytics` - Order volume and patterns
- `CustomerInsights` - Customer behavior analysis
- `MenuPerformance` - Item popularity metrics
- `PeakHoursChart` - Busy time analysis
- `ReportExporter` - Data export functionality

#### 5. Restaurant Profile (`/restaurant/profile`)
**Components:**
- `RestaurantInfoForm` - Basic information editing
- `OperatingHours` - Schedule management
- `DeliverySettings` - Radius and fee configuration
- `ImageGallery` - Restaurant photo management
- `ContactInfo` - Phone, email, address details
- `VerificationStatus` - Account verification display

## 🚗 Delivery Driver App

### 📱 Driver Interface Pages

#### 1. Driver Dashboard (`/driver/dashboard`)
**Components:**
- `AvailabilityToggle` - Online/offline status
- `EarningsDisplay` - Daily/weekly earnings
- `ActiveDelivery` - Current delivery information
- `DeliveryQueue` - Available delivery requests
- `PerformanceMetrics` - Ratings and statistics
- `ShiftTimer` - Working hours tracker

#### 2. Delivery Interface (`/driver/delivery/:id`)
**Components:**
- `DeliveryMap` - Navigation with real-time updates
- `OrderDetails` - Customer and restaurant information
- `StatusUpdater` - Update delivery progress
- `CustomerContact` - Call/message customer
- `ProofOfDelivery` - Photo and signature capture
- `NavigationControls` - GPS navigation integration

```jsx
const DeliveryInterface = ({ deliveryId }) => {
  const [delivery, setDelivery] = useState({});
  const [currentLocation, setCurrentLocation] = useState({});

  return (
    <div className="delivery-interface">
      <DeliveryMap 
        delivery={delivery}
        currentLocation={currentLocation}
        onLocationUpdate={handleLocationUpdate}
      />
      <div className="delivery-controls">
        <OrderDetails order={delivery.order} />
        <StatusUpdater 
          currentStatus={delivery.status}
          onStatusUpdate={handleStatusUpdate}
        />
        <CustomerContact customer={delivery.customer} />
      </div>
    </div>
  );
};
```

#### 3. Earnings & History (`/driver/earnings`)
**Components:**
- `EarningsOverview` - Total earnings summary
- `PayoutHistory` - Payment records
- `TripHistory` - Completed deliveries
- `BonusTracker` - Incentive earnings
- `TaxDocuments` - 1099 forms and records
- `PayoutSettings` - Payment preferences

## 👨‍💼 Admin Dashboard

### 🔧 Administrative Interface

#### 1. Admin Overview (`/admin/dashboard`)
**Components:**
- `PlatformMetrics` - System-wide statistics
- `UserGrowth` - Registration and activity trends
- `RevenueOverview` - Platform revenue analytics
- `SystemHealth` - Service status monitoring
- `AlertsPanel` - Critical notifications
- `QuickActions` - Common administrative tasks

#### 2. User Management (`/admin/users`)
**Components:**
- `UserTable` - Searchable user list
- `UserFilters` - Filter by role, status, date
- `UserProfile` - Detailed user information
- `AccountActions` - Suspend, activate, delete
- `BulkOperations` - Mass user management
- `UserAnalytics` - User behavior insights

#### 3. Restaurant Management (`/admin/restaurants`)
**Components:**
- `RestaurantTable` - Restaurant list with status
- `ApprovalQueue` - Pending restaurant applications
- `RestaurantProfile` - Detailed restaurant view
- `VerificationTools` - Document and info verification
- `PerformanceMetrics` - Restaurant analytics
- `ComplianceTracker` - Regulatory compliance status

#### 4. Order Monitoring (`/admin/orders`)
**Components:**
- `OrderOverview` - Real-time order tracking
- `DisputeResolution` - Handle customer complaints
- `RefundManager` - Process refund requests
- `OrderAnalytics` - Order pattern analysis
- `FraudDetection` - Suspicious activity alerts
- `OrderExporter` - Data export tools

#### 5. Content Management (`/admin/content`)
**Components:**
- `BannerManager` - Homepage banner control
- `PromotionCreator` - Create platform-wide offers
- `CategoryManager` - Food category management
- `FAQEditor` - Help content management
- `NotificationCenter` - System-wide announcements
- `ContentScheduler` - Scheduled content publishing

## 🔄 Shared Components

### 🎯 Reusable UI Elements

#### Navigation Components
```jsx
// Header Component
const Header = ({ user, cartCount, onSearch }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <Logo />
        <SearchBar onSearch={onSearch} />
        <div className="header-actions">
          <CartIcon count={cartCount} />
          <NotificationIcon />
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
};

// Sidebar Navigation
const Sidebar = ({ items, activeItem, onItemClick }) => {
  return (
    <nav className="sidebar">
      <ul className="nav-list">
        {items.map(item => (
          <li key={item.id} className={`nav-item ${activeItem === item.id ? 'active' : ''}`}>
            <a href={item.path} onClick={() => onItemClick(item.id)}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
```

#### Data Display Components
```jsx
// Table Component
const Table = ({ 
  columns, 
  data, 
  loading = false,
  onSort,
  onRowClick 
}) => {
  return (
    <div className="table-container">
      {loading && <LoadingSpinner />}
      <table className="data-table">
        <thead>
          <tr>
            {columns.map(column => (
              <th 
                key={column.key}
                onClick={() => onSort && onSort(column.key)}
                className={column.sortable ? 'sortable' : ''}
              >
                {column.title}
                {column.sortable && <SortIcon />}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr 
              key={index}
              onClick={() => onRowClick && onRowClick(row)}
              className="table-row"
            >
              {columns.map(column => (
                <td key={column.key}>
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Modal Component
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'medium' 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modal modal-${size}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};
```

#### Form Components
```jsx
// Form Component
const Form = ({ 
  onSubmit, 
  validation,
  children,
  loading = false 
}) => {
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    if (validation) {
      const validationErrors = validation(data);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }
    
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {React.Children.map(children, child =>
        React.cloneElement(child, { errors })
      )}
      <Button type="submit" loading={loading}>
        Submit
      </Button>
    </form>
  );
};
```

## 🗂️ State Management

### Redux Store Structure
```javascript
// Store Configuration
const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    user: userSlice.reducer,
    restaurants: restaurantsSlice.reducer,
    menu: menuSlice.reducer,
    cart: cartSlice.reducer,
    orders: ordersSlice.reducer,
    delivery: deliverySlice.reducer,
    notifications: notificationsSlice.reducer,
    ui: uiSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    }
  }
});

// Cart Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0,
    restaurantId: null,
    deliveryFee: 0,
    tax: 0
  },
  reducers: {
    addItem: (state, action) => {
      const existingItem = state.items.find(item => 
        item.id === action.payload.id && 
        JSON.stringify(item.customizations) === JSON.stringify(action.payload.customizations)
      );
      
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      
      state.total = calculateTotal(state.items);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.cartId !== action.payload);
      state.total = calculateTotal(state.items);
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(item => item.cartId === action.payload.cartId);
      if (item) {
        item.quantity = action.payload.quantity;
        state.total = calculateTotal(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.restaurantId = null;
    }
  }
});
```

## 🛣️ Routing Structure

### React Router Configuration
```jsx
// App Router
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        <Route path="/search" element={<SearchResults />} />

        {/* Protected Customer Routes */}
        <Route element={<ProtectedRoute role="customer" />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/order/:id/track" element={<OrderTracking />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/addresses" element={<AddressManagement />} />
        </Route>

        {/* Restaurant Owner Routes */}
        <Route element={<ProtectedRoute role="restaurant" />}>
          <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
          <Route path="/restaurant/menu" element={<MenuManagement />} />
          <Route path="/restaurant/orders" element={<OrderManagement />} />
          <Route path="/restaurant/analytics" element={<Analytics />} />
          <Route path="/restaurant/profile" element={<RestaurantProfile />} />
        </Route>

        {/* Driver Routes */}
        <Route element={<ProtectedRoute role="driver" />}>
          <Route path="/driver/dashboard" element={<DriverDashboard />} />
          <Route path="/driver/delivery/:id" element={<DeliveryInterface />} />
          <Route path="/driver/earnings" element={<Earnings />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/restaurants" element={<RestaurantManagement />} />
          <Route path="/admin/orders" element={<OrderMonitoring />} />
          <Route path="/admin/content" element={<ContentManagement />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

// Protected Route Component
const ProtectedRoute = ({ role, children }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <Outlet />;
};
```

This comprehensive frontend documentation provides a complete blueprint for building the FoodieExpress user interfaces across all user roles, with reusable components, proper state management, and organized routing structure.
