// src/pages/admin/ProductManagement.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FiPlus, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { 
  fetchAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  setProduct,
  clearProduct
} from '../../features/products/productSlice';

// Components
import ProductList from '../../components/products/ProductList';
import ProductForm from '../../components/products/ProductForm';
import ProductPagination from '../../components/products/ProductPagination';

const ProductManagement = () => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const { 
    products, 
    product, 
    isLoading, 
    error: productError, 
    pagination 
  } = useSelector((state) => state.products);
  
  const { categories } = useSelector((state) => state.categories);
  
  // Load products and categories on component mount
  useEffect(() => {
    loadProducts();
  }, []);
  
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
          // console.log('Uploading images for existing product:', images);
        }
        
        setSuccess('Product updated successfully');
      } else {
        // Create new product
        const result = await dispatch(createProduct(productData)).unwrap();
        
        // Handle image upload if needed
        if (images && images.length > 0 && result.productId) {
          // In a real app, you would upload the images here
          // console.log('Uploading images for new product:', images);
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
  
  return (
    <>
      <Helmet>
        <title>Manage Products | Admin Dashboard</title>
      </Helmet>
      
      <div className="bg-gray-50 py-8">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
            
            {!showForm && (
              <button 
                onClick={handleAddProduct} 
                className="btn btn-primary flex items-center"
              >
                <FiPlus className="mr-2" /> Add Product
              </button>
            )}
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
      </div>
    </>
  );
};

export default ProductManagement;