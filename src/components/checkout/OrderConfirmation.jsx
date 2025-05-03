// src/components/checkout/OrderConfirmation.jsx
import { FiShoppingBag } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const OrderConfirmation = ({ order, selectedAddress, paymentMethod }) => {
  // Check if order exists and has order items
  if (!order || !order.orderItemDTOs) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Confirmation</h2>
        <p className="text-gray-600 mb-6">Your order has been received. Thank you for shopping with us!</p>
        <Link to="/products" className="btn-primary inline-flex items-center px-6 py-3">
          <FiShoppingBag className="mr-2" /> Continue Shopping
        </Link>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount) => {
    return `$${Number(amount).toFixed(2)}`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Confirmation</h2>
      
      <div className="bg-green-50 p-4 rounded-md flex items-start mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <div>
          <h3 className="text-green-800 font-medium">Your order has been placed!</h3>
          <p className="text-green-700 mt-1">
            Thank you for your purchase. We'll send you shipping information once your order is on its way.
          </p>
          <p className="text-green-700 mt-1">
            Order #: <span className="font-medium">{order.orderId}</span>
          </p>
        </div>
      </div>
      
      {/* Order details */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Order Items</h3>
        <div className="bg-gray-50 p-4 rounded space-y-3">
          {order.orderItemDTOs.map((item, index) => (
            <div key={index} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
              <div>
                <span className="font-medium">
                  {item.productDTO ? item.productDTO.productName : 'Product'}
                </span>
                <span className="text-gray-600 text-sm ml-2">
                  × {item.quantity}
                </span>
              </div>
              <span>
                {formatCurrency(item.orderedProductPrice * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Payment Method */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Payment Method</h3>
        <div className="bg-gray-50 p-4 rounded">
          <p>
            {order.paymentDTO ? order.paymentDTO.paymentMethod : 'Payment processed'}
          </p>
        </div>
      </div>
      
      {/* Total */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Order Total</h3>
        <div className="bg-gray-50 p-4 rounded">
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
      </div>
      
      <Link to="/products" className="btn-primary w-full py-3 flex items-center justify-center">
        <FiShoppingBag className="mr-2" /> Continue Shopping
      </Link>
    </div>
  );
};

export default OrderConfirmation;