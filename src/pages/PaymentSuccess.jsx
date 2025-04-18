// src/pages/PaymentSuccess.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiCheckCircle } from 'react-icons/fi';
import { clearCart } from '../features/cart/cartSlice';
import { createOrder } from '../features/orders/orderSlice';

const PaymentSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const completeOrder = async () => {
      try {
        // Get the session ID from URL query parameter
        const query = new URLSearchParams(location.search);
        const sessionId = query.get('session_id');
        
        if (!sessionId) {
          throw new Error('No payment session ID found');
        }
        
        // Get pending order data from sessionStorage
        const pendingOrderData = JSON.parse(sessionStorage.getItem('pendingOrderData'));
        
        if (!pendingOrderData) {
          throw new Error('No pending order information found');
        }
        
        // Ensure payment method is valid (at least 4 characters)
        if (pendingOrderData.paymentMethod && pendingOrderData.paymentMethod.length < 4) {
          pendingOrderData.paymentMethod = 'card'; // Set to 'card' to meet validation requirements
        }
        
        // Update the order data with Stripe payment information
        const orderData = {
          ...pendingOrderData,
          pgPaymentId: sessionId,
          pgStatus: 'completed',
          pgResponseMessage: 'Payment successful via Stripe'
        };
        
        console.log('Completing order with data:', orderData);
        
        // Create the order in the backend
        await dispatch(createOrder(orderData)).unwrap();
        
        // Clear the cart and pending order data
        dispatch(clearCart());
        sessionStorage.removeItem('pendingOrderData');
        
        setIsProcessing(false);
      } catch (err) {
        console.error('Error completing order:', err);
        setError(err.message || 'Failed to complete your order');
        setIsProcessing(false);
      }
    };

    completeOrder();
  }, [dispatch, location, navigate]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-6"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Processing Your Payment</h1>
          <p className="text-gray-600">
            Please wait while we complete your order...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-red-500 mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Error</h1>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/cart"
              className="btn-primary inline-block px-6 py-3"
            >
              Return to Cart
            </Link>
            <Link
              to="/checkout"
              className="btn-outline inline-block px-6 py-3"
            >
              Try Again
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been processed successfully.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/orders"
            className="btn-primary inline-block px-6 py-3"
          >
            View Orders
          </Link>
          <Link
            to="/products"
            className="btn-outline inline-block px-6 py-3"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;