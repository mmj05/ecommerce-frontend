import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "./features/auth/authSlice";
import { getCart, mergeCart } from "./features/cart/cartSlice";

// Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";

// Components
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, authChecked } = useSelector((state) => state.auth);

  // State to track initialization steps to avoid redundant operations
  const [initialAuthCheckDone, setInitialAuthCheckDone] = useState(false);
  const [cartInitialized, setCartInitialized] = useState(false);
  const [cartMergeAttempted, setCartMergeAttempted] = useState(false);
  const initTimeoutRef = useRef(null);

  // Check if user is already logged in on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await dispatch(getCurrentUser()).unwrap();
      } catch (error) {
        console.warn("Failed to get current user:", error);
      } finally {
        setInitialAuthCheckDone(true);
      }
    };

    if (!initialAuthCheckDone) {
      checkAuth();
    }
  }, [dispatch, initialAuthCheckDone]);

  // Handle cart initialization once auth is checked
  useEffect(() => {
    // Only proceed if auth check is complete
    if (!initialAuthCheckDone) return;

    const initializeCart = async () => {
      try {
        // If authenticated and haven't attempted to merge cart
        if (isAuthenticated && !cartMergeAttempted) {
          // Check if there are guest cart items to merge
          const guestCartData = localStorage.getItem("guestCart");
          const hasGuestCartItems =
            guestCartData && JSON.parse(guestCartData).cartItems?.length > 0;

          if (hasGuestCartItems) {
            console.log(
              "Guest cart detected for authenticated user, attempting merge"
            );
            await dispatch(mergeCart()).unwrap();
          } else {
            // Just get the user's cart
            await dispatch(getCart()).unwrap();
          }

          // Mark cart merge as attempted
          setCartMergeAttempted(true);
        }
        // For guests or after merge completed
        else if (!cartInitialized) {
          await dispatch(getCart()).unwrap();
        }

        // Mark cart as initialized
        setCartInitialized(true);
      } catch (error) {
        console.error("Error initializing cart:", error);
        // Still mark steps as complete even on error to prevent infinite attempts
        setCartMergeAttempted(true);
        setCartInitialized(true);
      }
    };

    // Prevent multiple simultaneous initialization attempts
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current);
    }

    // Use timeout to ensure we don't hit the backend too rapidly
    initTimeoutRef.current = setTimeout(() => {
      if (!cartInitialized || (isAuthenticated && !cartMergeAttempted)) {
        initializeCart();
      }
      initTimeoutRef.current = null;
    }, 300);

    // Clean up timeout on unmount
    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
        initTimeoutRef.current = null;
      }
    };
  }, [
    dispatch,
    isAuthenticated,
    initialAuthCheckDone,
    cartInitialized,
    cartMergeAttempted,
  ]);

  // Show loading screen until initial auth check completes
  if (!authChecked && !initialAuthCheckDone) {
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
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Profile />} />{" "}
              {/* Route to profile page with orders tab active */}
              <Route path="/checkout/success" element={<PaymentSuccess />} />
              <Route path="/checkout/cancel" element={<PaymentCancel />} />
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
