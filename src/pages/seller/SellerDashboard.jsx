// src/pages/seller/SellerDashboard.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FiPlus, FiAlertCircle, FiCheckCircle, FiShoppingBag, FiDollarSign, FiPackage, FiUsers } from 'react-icons/fi';
import { 
  fetchAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  setProduct,
  clearProduct 
} from '../../features/products/productSlice';
import { fetchAllCategories } from '../../features/categories/categorySlice';

// Components
import ProductList from '../../components/products/ProductList';
import ProductForm from '../../components/products/ProductForm';
import ProductPagination from '../../components/products/ProductPagination';

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  
  const { 
    products, 
    product, 
    isLoading: productsLoading, 
    error: productError, 
    pagination 
  } = useSelector((state) => state.products);
  
  const { categories, isLoading: categoriesLoading } = useSelector((state) => state.categories);
  
  // Load products and categories on component mount
  useEffect(() => {
    if (activeTab === 'products') {
      loadProducts();
      // Load categories for the product form
      dispatch(fetchAllCategories({ 
        pageNumber: 0, 
        pageSize: 100, 
        sortBy: 'categoryName', 
        sortOrder: 'asc' 
      }));
    }
  }, [dispatch, activeTab]);
  
  // Watch for product errors
  useEffect(() => {
    if (productError) {
      setError(productError);
      setSuccess('');
    }
  }, [productError]);
  
  const loadProducts = (pageNumber = 0) => {
    dispatch(fetchAllProducts({ 
      pageNumber, 
      pageSize: 10, 
      sortBy: 'productId', 
      sortOrder: 'desc' 
    }));
  };
  
  const handlePageChange = (newPage) => {
    loadProducts(newPage);
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
        
        // Reload products to get updated list
        loadProducts(pagination.pageNumber);
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
          // In a real app, you would upload the images here
          console.log('Uploading images for existing product:', images);
        }
        
        setSuccess('Product updated successfully');
      } else {
        // Create new product
        const result = await dispatch(createProduct(productData)).unwrap();
        
        // Handle image upload if needed
        if (images && images.length > 0 && result.productId) {
          // In a real app, you would upload the images here
          console.log('Uploading images for new product:', images);
        }
        
        setSuccess('Product added successfully');
      }
      
      setError('');
      setShowForm(false);
      
      // Reload products to get updated list
      loadProducts(pagination.pageNumber);
    } catch (error) {
      setError(error || 'Failed to save product');
      setSuccess('');
    }
  };
  
  const handleCancelForm = () => {
    setShowForm(false);
    dispatch(clearProduct());
  };
  
  // Clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [success, error]);
  
  // Stats cards for dashboard overview
  const StatCard = ({ icon, title, value, color }) => (
    <div className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${color}`}>
      <div className="flex items-center">
        <div className="mr-4">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
  
  // Loading state
  const isLoading = productsLoading || categoriesLoading;
  
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
                Products
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
                  icon={<FiPackage className="text-blue-500 text-2xl" />}
                  title="Total Products" 
                  value={pagination?.totalElements || 0}
                  color="border-blue-500"
                />
                <StatCard 
                  icon={<FiDollarSign className="text-green-500 text-2xl" />}
                  title="Total Sales" 
                  value="$0.00"
                  color="border-green-500"
                />
                <StatCard 
                  icon={<FiShoppingBag className="text-purple-500 text-2xl" />}
                  title="Orders" 
                  value="0"
                  color="border-purple-500"
                />
                <StatCard 
                  icon={<FiUsers className="text-orange-500 text-2xl" />}
                  title="Customers" 
                  value="0"
                  color="border-orange-500"
                />
              </div>
              
              {/* Recent activity placeholder */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
                <p className="text-gray-600">No recent activity to display.</p>
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
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'products' && (
            <div>
              {/* Product management */}
              <div className="flex justify-between items-center mb-6">
                {!showForm && (
                  <button 
                    onClick={handleAddProduct} 
                    className="btn-primary flex items-center"
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
                    isSubmitting={isLoading}
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
                    products={products} 
                    onEditProduct={handleEditProduct} 
                    onDeleteProduct={handleDeleteProduct}
                  />
                  
                  <ProductPagination 
                    currentPage={pagination?.pageNumber || 0}
                    totalPages={pagination?.totalPages || 0}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </div>
          )}
          
          {activeTab === 'orders' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Orders</h2>
              <p className="text-gray-600">No orders to display yet.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SellerDashboard;