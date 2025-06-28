// src/components/products/ProductForm.jsx
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FiX, FiSave, FiUpload } from 'react-icons/fi';

const ProductForm = ({ product, categories, onSave, onCancel, isSubmitting }) => {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    price: '',
    discount: '',
    quantity: '',
    categoryId: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);

  // Check if user is admin
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');
  const isEditMode = !!product?.productId;

  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        discount: product.discount?.toString() || '',
        quantity: product.quantity?.toString() || '',
        categoryId: product.categoryId?.toString() || ''
      });
    } else {
      setFormData({
        productName: '',
        description: '',
        price: '',
        discount: '',
        quantity: '',
        categoryId: categories?.length > 0 ? categories[0].categoryId.toString() : ''
      });
    }
  }, [product, categories]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.productName.trim()) {
      errors.productName = 'Product name is required';
    } else if (formData.productName.length < 3) {
      errors.productName = 'Product name should have at least 3 characters';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length < 5) {
      errors.description = 'Description should have at least 5 characters';
    }
    
    if (!formData.price) {
      errors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      errors.price = 'Price must be a positive number';
    }
    
    if (!formData.quantity) {
      errors.quantity = 'Quantity is required';
    } else if (isNaN(formData.quantity) || parseInt(formData.quantity) < 0) {
      errors.quantity = 'Quantity must be a non-negative number';
    }
    
    if (formData.discount && (isNaN(formData.discount) || parseFloat(formData.discount) < 0 || parseFloat(formData.discount) > 100)) {
      errors.discount = 'Discount must be between 0 and 100';
    }
    
    if (!formData.categoryId) {
      errors.categoryId = 'Category is required';
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const productData = {
      ...(product && { productId: product.productId }),
      productName: formData.productName,
      description: formData.description,
      price: parseFloat(formData.price),
      discount: parseFloat(formData.discount) || 0,
      quantity: parseInt(formData.quantity),
      categoryId: parseInt(formData.categoryId)
    };
    
    onSave(productData, selectedImages);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-medium text-gray-900">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h3>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Cancel"
        >
          <FiX size={24} />
        </button>
      </div>
      
      {/* Show info message for admin editing restrictions */}
      {isAdmin && isEditMode && (
        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
          <p className="text-sm text-blue-700">
            <strong>Admin Note:</strong> You can only edit products that you own. If this form is disabled, 
            you don't have edit permissions for this product, but you can still delete it.
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name*
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border ${
                formErrors.productName ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
              placeholder="Enter product name"
            />
            {formErrors.productName && (
              <p className="mt-1 text-sm text-red-500">{formErrors.productName}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border ${
                formErrors.description ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
              placeholder="Enter product description"
            />
            {formErrors.description && (
              <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
            )}
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price ($)*
            </label>
            <input
              type="number"
              id="price"
              name="price"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border ${
                formErrors.price ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
              placeholder="0.00"
            />
            {formErrors.price && (
              <p className="mt-1 text-sm text-red-500">{formErrors.price}</p>
            )}
          </div>

          <div>
            <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
              Discount (%)
            </label>
            <input
              type="number"
              id="discount"
              name="discount"
              step="0.01"
              min="0"
              max="100"
              value={formData.discount}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border ${
                formErrors.discount ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
              placeholder="0"
            />
            {formErrors.discount && (
              <p className="mt-1 text-sm text-red-500">{formErrors.discount}</p>
            )}
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity*
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="0"
              value={formData.quantity}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border ${
                formErrors.quantity ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
              placeholder="0"
            />
            {formErrors.quantity && (
              <p className="mt-1 text-sm text-red-500">{formErrors.quantity}</p>
            )}
          </div>

          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
              Category*
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border ${
                formErrors.categoryId ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
            >
              <option value="">Select a category</option>
              {categories?.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </option>
              ))}
            </select>
            {formErrors.categoryId && (
              <p className="mt-1 text-sm text-red-500">{formErrors.categoryId}</p>
            )}
          </div>

          {/* Image upload section */}
          <div className="md:col-span-2">
            <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
              Product Images
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="images"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                  >
                    <span>Upload images</span>
                    <input
                      id="images"
                      name="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                {selectedImages.length > 0 && (
                  <p className="text-sm text-primary">
                    {selectedImages.length} image(s) selected
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline px-6 py-2"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary px-6 py-2 flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Saving...
              </>
            ) : (
              <>
                <FiSave className="mr-2" /> 
                {isEditMode ? 'Update Product' : 'Create Product'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;