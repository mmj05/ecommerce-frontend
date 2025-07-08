// src/components/common/SellerRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SellerRoute = () => {
  const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // Check if user has seller role
  const isSeller = () => {
    if (!user || !user.roles) return false;
    return user.roles.includes('ROLE_SELLER') || user.roles.includes('ROLE_ADMIN');
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated or not seller, redirect to login
  if (!isAuthenticated || !isSeller()) {
    // console.log('User not authenticated or not a seller, redirecting to login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If authenticated and seller, render the child routes
  return <Outlet />;
};

export default SellerRoute;