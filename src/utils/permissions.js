// src/utils/permissions.js - Utility functions for permission checks
export const hasRole = (user, role) => {
  if (!user || !user.roles) return false;
  return user.roles.includes(role);
};

export const isAdmin = (user) => {
  return hasRole(user, 'ROLE_ADMIN');
};

export const isSeller = (user) => {
  return hasRole(user, 'ROLE_SELLER') || hasRole(user, 'ROLE_ADMIN');
};

export const isUser = (user) => {
  return hasRole(user, 'ROLE_USER');
};

// Check if user can perform admin actions
export const canPerformAdminActions = (user) => {
  return isAdmin(user);
};

// Check if user can perform seller actions
export const canPerformSellerActions = (user) => {
  return isSeller(user);
};

// Get user's highest role for display purposes
export const getUserHighestRole = (user) => {
  if (isAdmin(user)) return 'Admin';
  if (isSeller(user)) return 'Seller';
  if (isUser(user)) return 'User';
  return 'Unknown';
};

// Check if user can access a specific route
export const canAccessRoute = (user, route) => {
  const adminRoutes = ['/admin'];
  const sellerRoutes = ['/seller'];
  const protectedRoutes = ['/profile', '/checkout', '/orders'];
  
  // Check admin routes
  if (adminRoutes.some(adminRoute => route.startsWith(adminRoute))) {
    return isAdmin(user);
  }
  
  // Check seller routes
  if (sellerRoutes.some(sellerRoute => route.startsWith(sellerRoute))) {
    return isSeller(user);
  }
  
  // Check protected routes (require any authenticated user)
  if (protectedRoutes.some(protectedRoute => route.startsWith(protectedRoute))) {
    return !!user;
  }
  
  // Public routes
  return true;
};