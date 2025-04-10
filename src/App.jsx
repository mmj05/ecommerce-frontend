import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './features/auth/authSlice';
import { getCart } from './features/cart/cartSlice';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
//import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, authChecked } = useSelector(state => state.auth);
  const [initialAuthCheckDone, setInitialAuthCheckDone] = useState(false);

  // Check if user is already logged in on app load
  useEffect(() => {
    const checkAuth = async () => {
      await dispatch(getCurrentUser());
      setInitialAuthCheckDone(true);
    };
    
    checkAuth();
  }, [dispatch]);

  // When authentication status changes, fetch the cart
  useEffect(() => {
    if (initialAuthCheckDone) {
      dispatch(getCart());
    }
  }, [dispatch, isAuthenticated, initialAuthCheckDone]);

  // Show loading screen until initial auth check completes
  if (!initialAuthCheckDone && !authChecked) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              {/* <Route path="/checkout" element={<Checkout />} /> */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Profile />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;