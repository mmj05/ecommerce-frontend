// src/pages/PaymentSuccess.jsx - Updated for Cash on Delivery
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiCheckCircle, FiShoppingBag } from 'react-icons/fi';
import { clearCart } from '../features/cart/cartSlice';

const PaymentSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get order info from Redux store
  const { order } = useSelector((state) => state.order);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Clear cart on successful order
    dispatch(clearCart());
  }, [dispatch, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Thank You For Your Order!</h1>
        
        {order && (
          <div className="bg-gray-50 p-4 rounded-md mb-6 text-left">
            <p className="text-gray-700">
              <span className="font-medium">Order Number:</span> #{order.orderId}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Date:</span> {new Date(order.orderDate || Date.now()).toLocaleDateString()}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Total:</span> ${order.totalAmount?.toFixed(2)}
            </p>
            <p className="text-gray-700 mt-2">
              <span className="font-medium">Payment Method:</span> Cash on Delivery
            </p>
          </div>
        )}
        
        <p className="text-gray-600 mb-6">
          Your order has been received and is now being processed. 
          We'll send you a confirmation email with your order details.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/profile"
            className="btn-primary inline-block px-6 py-3"
          >
            View My Orders
          </Link>
          <Link
            to="/products"
            className="btn-outline inline-block px-6 py-3"
          >
            <FiShoppingBag className="inline-block mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;