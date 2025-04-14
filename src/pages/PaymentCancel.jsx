// src/pages/PaymentCancel.jsx
import { Link } from 'react-router-dom';
import { FiAlertCircle } from 'react-icons/fi';

const PaymentCancel = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. Your cart items are still saved.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/cart"
            className="btn-primary px-6 py-3"
          >
            Return to Cart
          </Link>
          <Link
            to="/checkout"
            className="btn-outline px-6 py-3"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;