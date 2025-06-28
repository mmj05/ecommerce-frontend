// src/pages/seller/SellerDashboard.jsx - Updated with functional overview and orders
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FiPlus, FiAlertCircle, FiCheckCircle, FiShoppingBag, FiDollarSign, FiPackage, FiUsers, FiTrendingUp, FiCalendar } from 'react-icons/fi';
import { 
  createProduct,
  updateProduct,
  deleteProduct,
  setProduct,
  clearProduct 
} from '../../features/products/productSlice';
import { fetchAllCategories } from '../../features/categories/categorySlice';
import { 
  fetchDashboardStats, 
  fetchSellerOrders, 
  fetchSellerOrderById,
  updateSellerOrderStatus,
  clearSellerError 
} from '../../features/seller/sellerSlice';
import productService from '../../services/productService';

// Components
import ProductList from '../../components/products/ProductList';
import ProductForm from '../../components/products/ProductForm';
import ProductPagination from '../../components/products/ProductPagination';
import SellerOrderList from '../../components/seller/SellerOrderList';
import SellerOrderDetails from '../../components/seller/SellerOrderDetails';

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [sellerProducts, setSellerProducts] = useState([]);
  const [sellerPagination, setSellerPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
    lastPage: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [ordersPagination, setOrdersPagination] = useState({
    pageNumber: 0,
    pageSize: 10
  });
  
  const { 
    product, 
    error: productError
  } = useSelector((state) => state.products);
  
  const { categories, isLoading: categoriesLoading } = useSelector((state) => state.categories);
  
  const { 
    dashboardStats, 
    orders, 
    currentOrder,
    pagination: orderPagination,
    isLoading: sellerLoading,
    error: sellerError 
  } = useSelector((state) => state.seller);
  
  // Load data based on active tab
  useEffect(() => {
    if (activeTab === 'overview') {
      dispatch(fetchDashboardStats());
    } else if (activeTab === 'products') {
      loadSellerProducts();
      // Load categories for the product form
      dispatch(fetchAllCategories({ 
        pageNumber: 0, 
        pageSize: 100, 
        sortBy: 'categoryName', 
        sortOrder: 'asc' 
      }));
    } else if (activeTab === 'orders') {
      loadSellerOrders();
    }
  }, [dispatch, activeTab]);
  
  // Watch for errors
  useEffect(() => {
    if (productError) {
      setError(productError);
      setSuccess('');
    }
    if (sellerError) {
      setError(sellerError);
      setSuccess('');
    }
  }, [productError, sellerError]);
  
  const loadSellerProducts = async (pageNumber = 0) => {
    setIsLoading(true);
    try {
      const response = await productService.getSellerProducts(pageNumber, 10, 'productId', 'desc');
      setSellerProducts(response.content || []);
      setSellerPagination({
        pageNumber: response.pageNumber || 0,
        pageSize: response.pageSize || 10,
        totalPages: response.totalPages || 0,
        totalElements: response.totalElements || 0,
        lastPage: response.lastPage || false
      });
    } catch (error) {
      console.error('Error loading seller products:', error);
      setError('Failed to load your products');
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadSellerOrders = (pageNumber = ordersPagination.pageNumber) => {
    dispatch(fetchSellerOrders({ 
      pageNumber, 
      pageSize: 10, 
      sortBy: 'orderDate', 
      sortOrder: 'DESC' 
    }));
    setOrdersPagination(prev => ({ ...prev, pageNumber }));
  };
  
  const handlePageChange = (newPage) => {
    if (activeTab === 'products') {
      loadSellerProducts(newPage);
    } else if (activeTab === 'orders') {
      loadSellerOrders(newPage);
    }
  };
  
  const handleAddProduct = () => {
    dispatch(clearProduct());
    setShowForm(true);
  };
  
  const handleEditProduct = (product) => {
    dispatch(setProduct(product));
    setShowForm(true);
  };
  
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProduct(productId)).unwrap();
        setSuccess('Product deleted successfully');
        setError('');
        
        // Reload seller's products and update stats
        loadSellerProducts(sellerPagination.pageNumber);
        dispatch(fetchDashboardStats());
      } catch (error) {
        setError(error || 'Failed to delete product');
        setSuccess('');
      }
    }
  };
  
  const handleSaveProduct = async (productData, images) => {
    try {
      if (productData.productId) {
        // Update existing product
        await dispatch(updateProduct({
          productId: productData.productId,
          productData: productData
        })).unwrap();
        
        // Handle image upload if needed
        if (images && images.length > 0) {
          try {
            await productService.uploadProductImage(productData.productId, images[0]);
          } catch (imageError) {
            console.warn('Failed to upload image:', imageError);
          }
        }
        
        setSuccess('Product updated successfully');
      } else {
        // Create new product
        const result = await dispatch(createProduct(productData)).unwrap();
        
        // Handle image upload if needed
        if (images && images.length > 0 && result.productId) {
          try {
            await productService.uploadProductImage(result.productId, images[0]);
          } catch (imageError) {
            console.warn('Failed to upload image:', imageError);
          }
        }
        
        setSuccess('Product added successfully');
      }
      
      setError('');
      setShowForm(false);
      
      // Reload seller's products and update stats
      loadSellerProducts(sellerPagination.pageNumber);
      dispatch(fetchDashboardStats());
    } catch (error) {
      setError(error || 'Failed to save product');
      setSuccess('');
    }
  };
  
  const handleCancelForm = () => {
    setShowForm(false);
    dispatch(clearProduct());
  };
  
  const handleViewOrder = (orderId) => {
    dispatch(fetchSellerOrderById(orderId));
    setShowOrderDetails(true);
  };
  
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await dispatch(updateSellerOrderStatus({ orderId, status })).unwrap();
      setSuccess('Order status updated successfully');
      setShowOrderDetails(false);
      // Refresh stats after update
      dispatch(fetchDashboardStats());
    } catch (error) {
      setError(error || 'Failed to update order status');
    }
  };
  
  // Clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
        dispatch(clearSellerError());
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);
  
  // Format currency
  const formatCurrency = (amount) => {
    return `$${Number(amount).toFixed(2)}`;
  };
  
  // Stats cards for dashboard overview
  const StatCard = ({ icon, title, value, color, trend }) => (
    <div className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold mt-1">
            {title.includes('Sales') ? formatCurrency(value) : value}
          </p>
          {trend && (
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <FiTrendingUp className="mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className="text-3xl opacity-80">
          {icon}
        </div>
      </div>
    </div>
  );
  
  return (
    <>
      <Helmet>
        <title>Seller Dashboard | ShopEasy</title>
      </Helmet>
      
      <div className="bg-gray-50 py-8">
        <div className="container-custom">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Seller Dashboard</h1>
          
          {/* Dashboard tabs */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Products
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Orders
              </button>
            </nav>
          </div>
          
          {/* Success message */}
          {success && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded flex items-start">
              <FiCheckCircle className="text-green-500 mt-1 mr-3" />
              <p className="text-green-700">{success}</p>
            </div>
          )}
          
          {/* Error message */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start">
              <FiAlertCircle className="text-red-500 mt-1 mr-3" />
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {/* Dashboard content based on active tab */}
          {activeTab === 'overview' && (
            <div>
              {/* Stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                  icon={<FiPackage />}
                  title="My Products" 
                  value={dashboardStats.totalProducts || 0}
                  color="border-blue-500"
                />
                <StatCard 
                  icon={<FiDollarSign />}
                  title="Total Sales" 
                  value={dashboardStats.totalSales || 0}
                  color="border-green-500"
                />
                <StatCard 
                  icon={<FiShoppingBag />}
                  title="Orders" 
                  value={dashboardStats.totalOrders || 0}
                  color="border-purple-500"
                />
                <StatCard 
                  icon={<FiUsers />}
                  title="Customers" 
                  value={dashboardStats.totalCustomers || 0}
                  color="border-orange-500"
                />
              </div>
              
              {/* Recent activity */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
                {orders && orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.orderId} className="flex items-center justify-between py-3 border-b last:border-0">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Order #{order.orderId}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.orderDate).toLocaleDateString()} - {order.email}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(order.sellerTotal || 0)}
                          </p>
                          <p className={`text-xs inline-flex px-2 py-1 rounded-full ${
                            order.orderStatus.toLowerCase().includes('ship') 
                              ? 'text-blue-600 bg-blue-100' 
                              : 'text-yellow-600 bg-yellow-100'
                          }`}>
                            {order.orderStatus}
                          </p>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-sm text-primary hover:text-primary-dark"
                    >
                      View all orders →
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-600">No recent activity to display.</p>
                )}
              </div>
              
              {/* Quick actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button
                    onClick={() => {
                      setActiveTab('products');
                      setTimeout(() => handleAddProduct(), 100);
                    }}
                    className="flex items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiPlus className="mr-2 text-primary" />
                    <span>Add New Product</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="flex items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiShoppingBag className="mr-2 text-primary" />
                    <span>View Orders</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="flex items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiPackage className="mr-2 text-primary" />
                    <span>Manage Products</span>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'products' && (
            <div>
              {/* Product management */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">My Products</h2>
                  <p className="text-gray-600">Manage products that you've created</p>
                </div>
                {!showForm && (
                  <button 
                    onClick={handleAddProduct} 
                    className="btn btn-primary flex items-center"
                  >
                    <FiPlus className="mr-2" /> Add Product
                  </button>
                )}
              </div>
              
              {/* Product form */}
              {showForm && (
                <div className="mb-8">
                  <ProductForm 
                    product={product} 
                    categories={categories}
                    onSave={handleSaveProduct} 
                    onCancel={handleCancelForm}
                    isSubmitting={isLoading || categoriesLoading}
                  />
                </div>
              )}
              
              {/* Products list */}
              {isLoading && !showForm ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  <ProductList 
                    products={sellerProducts} 
                    onEditProduct={handleEditProduct} 
                    onDeleteProduct={handleDeleteProduct}
                    showPermissions={false} // Don't show permission checks for seller's own products
                  />
                  
                  <ProductPagination 
                    currentPage={sellerPagination.pageNumber}
                    totalPages={sellerPagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </div>
          )}
          
          {activeTab === 'orders' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Orders</h2>
                <p className="text-gray-600">View and manage orders containing your products</p>
              </div>
              
              {/* Orders list */}
              {sellerLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  <SellerOrderList 
                    orders={orders}
                    onViewOrder={handleViewOrder}
                    onUpdateStatus={handleUpdateOrderStatus}
                    isUpdating={sellerLoading}
                  />
                  
                  {orderPagination.totalPages > 1 && (
                    <div className="mt-6">
                      <ProductPagination 
                        currentPage={orderPagination.pageNumber}
                        totalPages={orderPagination.totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Order Details Modal */}
      {showOrderDetails && currentOrder && (
        <SellerOrderDetails 
          order={currentOrder}
          onClose={() => setShowOrderDetails(false)}
          onUpdateStatus={handleUpdateOrderStatus}
          isUpdating={sellerLoading}
        />
      )}
    </>
  );
};

export default SellerDashboard;