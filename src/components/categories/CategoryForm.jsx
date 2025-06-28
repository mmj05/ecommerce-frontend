import { useState, useEffect } from 'react';
import { FiX, FiSave } from 'react-icons/fi';

const CategoryForm = ({ category, onSave, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    categoryName: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (category) {
      setFormData({
        categoryName: category.categoryName || ''
      });
    } else {
      setFormData({
        categoryName: ''
      });
    }
  }, [category]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.categoryName.trim()) {
      errors.categoryName = 'Category name is required';
    } else if (formData.categoryName.length < 5) {
      errors.categoryName = 'Category name should have at least 5 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSave({
      ...(category && { categoryId: category.categoryId }),
      ...formData
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          {category ? 'Edit Category' : 'Add New Category'}
        </h3>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Cancel"
        >
          <FiX />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
            Category Name*
          </label>
          <input
            type="text"
            id="categoryName"
            name="categoryName"
            value={formData.categoryName}
            onChange={handleChange}
            className={`block w-full px-3 py-2 border ${
              formErrors.categoryName ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
            placeholder="Enter category name"
          />
          {formErrors.categoryName && (
            <p className="mt-1 text-sm text-red-500">{formErrors.categoryName}</p>
          )}
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline px-4 py-2"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary px-4 py-2 flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Saving...
              </>
            ) : (
              <>
                <FiSave className="mr-2" /> Save Category
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;