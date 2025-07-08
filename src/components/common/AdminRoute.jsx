import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // Check if user has admin role
  const isAdmin = () => {
    if (!user || !user.roles) return false;
    return user.roles.includes('ROLE_ADMIN');
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated or not admin, redirect to login
  if (!isAuthenticated || !isAdmin()) {
    // console.log('User not authenticated or not admin, redirecting to login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If authenticated and admin, render the child routes
  return <Outlet />;
};

export default AdminRoute;