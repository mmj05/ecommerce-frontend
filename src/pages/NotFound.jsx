import { Link } from 'react-router-dom';
import { FiHome, FiShoppingBag } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/"
            className="btn-primary flex items-center justify-center gap-2"
          >
            <FiHome />
            Back to Home
          </Link>
          <Link
            to="/products"
            className="btn-outline flex items-center justify-center gap-2"
          >
            <FiShoppingBag />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;