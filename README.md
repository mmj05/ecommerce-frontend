# E-Commerce Frontend - FlipDot

A modern, responsive **React e-commerce frontend** built with **Vite**, **Redux Toolkit**, and **Tailwind CSS**. This application provides a complete shopping experience with user authentication, product browsing, cart management, and secure checkout functionality.

## 🌐 Live Demo

**Live Application**: [https://flipdot.onrender.com/](https://flipdot.onrender.com/)

Experience the full e-commerce platform with user registration, product browsing, shopping cart, checkout, and order management.

## ✨ Features

### 🛒 Shopping Experience
- **Product Catalog** with search, filtering, and pagination
- **Category-based Navigation** with responsive design
- **Product Details** with image galleries and specifications
- **Shopping Cart** with real-time updates and quantity management
- **Guest Cart** functionality with automatic merging on login

### 🔐 Authentication & User Management
- **JWT-based Authentication** with secure token storage
- **User Registration & Login** with validation
- **Password Reset** functionality
- **User Profiles** with account settings and order history
- **Address Management** for shipping and billing

### 💳 Checkout & Payments
- **Multi-step Checkout** process with address selection
- **Stripe Payment Integration** for secure transactions
- **Payment Method Selection** (Card, Cash on Delivery)
- **Order Confirmation** and tracking

### 👥 Role-based Features
- **Customer Dashboard** - Order history and profile management
- **Seller Dashboard** - Product management and order fulfillment
- **Admin Panel** - Complete platform management and analytics

### 📱 Modern UI/UX
- **Responsive Design** optimized for all devices
- **Tailwind CSS** for consistent, modern styling
- **React Icons** for beautiful, consistent iconography
- **Loading States** and error handling throughout
- **SEO Optimization** with React Helmet

## 🛠 Tech Stack

### Core Technologies
- **React 19** - Modern React with latest features
- **Vite** - Lightning-fast build tool and dev server
- **React Router DOM 7** - Client-side routing
- **Redux Toolkit** - Predictable state management
- **Axios** - HTTP client with interceptors

### Styling & UI
- **Tailwind CSS 3** - Utility-first CSS framework
- **React Icons** - Beautiful icon library
- **Custom Color Palette** - Consistent brand colors

### Payment & Integration
- **Stripe React** - Secure payment processing
- **React Helmet** - Dynamic document head management

### Development Tools
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **Vite DevServer** - Hot module replacement

## 📋 Prerequisites

- **Node.js 18+** 
- **npm** or **yarn**
- **Backend API** running (see backend repository)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ecommerce-frontend
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080
VITE_API_URL=http://localhost:8080/api

# Stripe Configuration (for payments)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# App Configuration
VITE_APP_NAME=FlipDot
```

### 4. Start Development Server

```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

The application will be available at `http://localhost:5173`

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Shared components (Header, Footer, etc.)
│   ├── home/           # Homepage components
│   ├── products/       # Product-related components
│   ├── checkout/       # Checkout flow components
│   ├── profile/        # User profile components
│   └── seller/         # Seller dashboard components
├── features/           # Redux slices and async thunks
│   ├── auth/           # Authentication state
│   ├── cart/           # Shopping cart state
│   ├── products/       # Product catalog state
│   ├── orders/         # Order management state
│   ├── categories/     # Category management state
│   ├── address/        # Address management state
│   └── seller/         # Seller dashboard state
├── pages/              # Route components
│   ├── admin/          # Admin panel pages
│   └── seller/         # Seller dashboard pages
├── services/           # API service functions
├── utils/              # Utility functions
├── assets/             # Static assets
├── App.jsx             # Main application component
├── main.jsx           # Application entry point
└── store.js           # Redux store configuration
```

## 🎨 UI Components

### Common Components
- **Header** - Navigation with cart, search, and user menu
- **Footer** - Site information and links
- **ProtectedRoute** - Route protection for authenticated users
- **AdminRoute** - Admin-only route protection
- **SellerRoute** - Seller-only route protection

### Product Components
- **ProductCard** - Product display with add to cart
- **ProductList** - Grid/list view of products
- **ProductDetails** - Detailed product view
- **ProductForm** - Product creation/editing (seller/admin)
- **ProductsFilter** - Search and filter functionality

### Shopping Components
- **Cart** - Shopping cart with quantity management
- **Checkout** - Multi-step checkout process
- **AddressSelection** - Shipping address management
- **PaymentMethod** - Payment option selection

## 🔄 State Management

The application uses **Redux Toolkit** for centralized state management:

### Authentication (`authSlice`)
- User login/logout/registration
- JWT token management
- User profile information
- Authentication status

### Shopping Cart (`cartSlice`)
- Cart items management
- Guest cart functionality
- Cart merging on login
- Real-time price calculations

### Products (`productSlice`)
- Product catalog
- Search and filtering
- Product details
- CRUD operations (seller/admin)

### Orders (`orderSlice`)
- Order creation and management
- Order history
- Order status tracking

### Categories (`categorySlice`)
- Category management
- Category-based product filtering

## 🔐 Authentication Flow

### Login Process
1. User submits credentials
2. Frontend sends request to backend API
3. Backend validates and returns JWT token + user info
4. Frontend stores token in localStorage
5. Automatic header-based authentication for subsequent requests

### Route Protection
- **Public Routes**: Home, Products, Login, Register
- **Protected Routes**: Profile, Cart, Checkout, Orders
- **Admin Routes**: Product Management, Category Management
- **Seller Routes**: Seller Dashboard, Order Management

## 💳 Payment Integration

### Stripe Integration
- Secure payment processing
- Multiple payment methods
- Real-time payment status
- Error handling and validation

### Payment Flow
1. User proceeds to checkout
2. Address and payment method selection
3. Stripe payment processing
4. Order confirmation and redirect

## 📱 Responsive Design

The application is fully responsive with:
- **Mobile-first** approach
- **Breakpoint-specific** layouts
- **Touch-friendly** interactions
- **Optimized performance** for all devices

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Code Quality
- **ESLint** configuration for code quality
- **Consistent formatting** with Prettier
- **Component-based architecture**
- **Redux best practices**

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Environment Variables for Production

```env
VITE_API_BASE_URL=https://your-backend-api.com
VITE_API_URL=https://your-backend-api.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
```

### Deployment Platforms
- **Vercel** - Recommended for React apps
- **Netlify** - Great for static site deployment
- **Render** - Full-stack deployment
- **AWS S3 + CloudFront** - Scalable cloud deployment

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Issues**
   ```bash
   # Check if backend is running
   curl http://localhost:8080/api/public/products
   
   # Verify environment variables
   echo $VITE_API_BASE_URL
   ```

2. **Authentication Issues**
   - Clear localStorage: `localStorage.clear()`
   - Check JWT token expiration
   - Verify backend authentication endpoint

3. **Payment Issues**
   - Verify Stripe publishable key
   - Check network requests in browser devtools
   - Ensure HTTPS in production

4. **Build Issues**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

### Development Guidelines
- Follow component-based architecture
- Use TypeScript for type safety (if migrating)
- Write meaningful commit messages
- Test components thoroughly
- Maintain responsive design principles

## 📚 API Integration

This frontend integrates with the backend API for:
- **Authentication**: Login, register, logout
- **Products**: CRUD operations, search, filtering
- **Cart**: Add, remove, update quantities
- **Orders**: Create, view history, track status
- **User Management**: Profile, addresses, settings

## 🔗 Related Projects

- **Backend API**: [E-Commerce Backend Repository](https://github.com/mmj05/ecommerce-backend)

---

**Built with ❤️ using React, Redux, and modern web technologies for an exceptional e-commerce experience**