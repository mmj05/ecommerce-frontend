import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FiPlus, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { 
  fetchAllCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  setCategory,
  clearCategory
} from '../../features/categories/categorySlice';

// Components
import CategoryList from '../../components/categories/CategoryList';
import CategoryForm from '../../components/categories/CategoryForm';
import CategoryPagination from '../../components/categories/CategoryPagination';

const CategoryManagement = () => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const { 
    categories, 
    category, 
    isLoading, 
    error: categoryError, 
    pagination 
  } = useSelector((state) => state.categories);
  
  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);
  
  // Watch for category errors
  useEffect(() => {
    if (categoryError) {
      setError(categoryError);
      setSuccess('');
    }
  }, [categoryError]);
  
  const loadCategories = (pageNumber = 0) => {
    dispatch(fetchAllCategories({ 
      pageNumber, 
      pageSize: 10, 
      sortBy: 'categoryName', 
      sortOrder: 'asc' 
    }));
  };
  
  const handlePageChange = (newPage) => {
    loadCategories(newPage);
  };
  
  const handleAddCategory = () => {
    dispatch(clearCategory());
    setShowForm(true);
  };
  
  const handleEditCategory = (category) => {
    dispatch(setCategory(category));
    setShowForm(true);
  };
  
  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await dispatch(deleteCategory(categoryId)).unwrap();
        setSuccess('Category deleted successfully');
        setError('');
        
        // Reload categories to get updated list
        loadCategories(pagination.pageNumber);
      } catch (error) {
        setError(error || 'Failed to delete category');
        setSuccess('');
      }
    }
  };
  
  const handleSaveCategory = async (categoryData) => {
    try {
      if (categoryData.categoryId) {
        // Update existing category
        await dispatch(updateCategory({
          categoryId: categoryData.categoryId,
          categoryData: {
            categoryName: categoryData.categoryName
          }
        })).unwrap();
        setSuccess('Category updated successfully');
      } else {
        // Create new category
        await dispatch(createCategory({
          categoryName: categoryData.categoryName
        })).unwrap();
        setSuccess('Category added successfully');
      }
      
      setError('');
      setShowForm(false);
      
      // Reload categories to get updated list
      loadCategories(pagination.pageNumber);
    } catch (error) {
      setError(error || 'Failed to save category');
      setSuccess('');
    }
  };
  
  const handleCancelForm = () => {
    setShowForm(false);
    dispatch(clearCategory());
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
        <title>Manage Categories | Admin Dashboard</title>
      </Helmet>
      
      <div className="bg-gray-50 py-8">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Manage Categories</h1>
            
            {!showForm && (
              <button 
                onClick={handleAddCategory} 
                className="btn-primary flex items-center"
              >
                <FiPlus className="mr-2" /> Add Category
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
          
          {/* Category form */}
          {showForm && (
            <div className="mb-8">
              <CategoryForm 
                category={category} 
                onSave={handleSaveCategory} 
                onCancel={handleCancelForm}
                isSubmitting={isLoading}
              />
            </div>
          )}
          
          {/* Categories list */}
          {isLoading && !showForm ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <CategoryList 
                categories={categories} 
                onEditCategory={handleEditCategory} 
                onDeleteCategory={handleDeleteCategory}
                isAdmin={true}
              />
              
              <CategoryPagination 
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

export default CategoryManagement;