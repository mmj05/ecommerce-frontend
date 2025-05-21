// src/components/products/ProductForm.jsx
import { useState, useEffect, useRef } from 'react';
import { FiX, FiSave, FiImage, FiDollarSign, FiShoppingBag, FiPackage } from 'react-icons/fi';

const ProductForm = ({ product, categories, onSave, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    price: '',
    discount: '',
    quantity: '',
    categoryId: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName || '',
        description: product.description || '',
        price: product.price || '',
        discount: product.discount || 0,
        quantity: product.quantity || '',
        categoryId: product.category?.categoryId || ''
      });
      
      // If product has images, set the preview (in a real app, you'd fetch the image URLs)
      if (product.image) {
        setImagePreviews([product.image]);
      }
    } else {
      setFormData({
        productName: '',
        description: '',
        price: '',
        discount: 0,
        quantity: '',
        categoryId: categories && categories.length > 0 ? categories[0].categoryId : ''
      });
      setImagePreviews([]);
      setImageFiles([]);
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
    
    if (formData.discount && (isNaN(formData.discount) || parseFloat(formData.discount) < 0 || parseFloat(formData.discount) > 100)) {
      errors.discount = 'Discount must be a number between 0 and 100';
    }
    
    if (!formData.quantity) {
      errors.quantity = 'Quantity is required';
    } else if (isNaN(formData.quantity) || parseInt(formData.quantity) < 0) {
      errors.quantity = 'Quantity must be a non-negative number';
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
    
    // Validate files (only images allowed, max 5 files, each max 5MB)
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isUnderSizeLimit = file.size <= 5 * 1024 * 1024; // 5MB
      return isImage && isUnderSizeLimit;
    });
    
    if (validFiles.length !== files.length) {
      alert('Some files were skipped. Only images under 5MB are allowed.');
    }
    
    // Limit to 5 images total
    const totalFiles = [...imageFiles, ...validFiles].slice(0, 5);
    setImageFiles(totalFiles);
    
    // Generate previews
    const newPreviews = totalFiles.map(file => URL.createObjectURL(file));
    
    // Clean up old previews to prevent memory leaks
    imagePreviews.forEach(preview => {
      if (!newPreviews.includes(preview) && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    });
    
    setImagePreviews(newPreviews);
  };
  
  const removeImage = (index) => {
    // Remove the image file
    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);
    setImageFiles(newFiles);
    
    // Remove the preview and revoke the object URL
    const preview = imagePreviews[index];
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Convert numeric fields
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      discount: parseFloat(formData.discount || 0),
      quantity: parseInt(formData.quantity),
      // Calculate special price based on discount
      specialPrice: parseFloat(formData.price) * (1 - parseFloat(formData.discount || 0) / 100)
    };
    
    // If editing, include the product ID
    if (product && product.productId) {
      productData.productId = product.productId;
    }
    
    onSave(productData, imageFiles);
  };

  // Handle file selection click
  const handleSelectFiles = () => {
    fileInputRef.current.click();
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => {
        if (preview && preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [imagePreviews]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-medium text-gray-900">
          {product ? 'Edit Product' : 'Add New Product'}
        </h3>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Cancel"
        >
          <FiX size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Section */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPackage className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    formErrors.productName ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                  placeholder="Enter product name"
                />
              </div>
              {formErrors.productName && (
                <p className="mt-1 text-sm text-red-500">{formErrors.productName}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                Category*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiShoppingBag className="text-gray-400" />
                </div>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    formErrors.categoryId ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                >
                  <option value="">Select a category</option>
                  {categories && categories.map(category => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>
              {formErrors.categoryId && (
                <p className="mt-1 text-sm text-red-500">{formErrors.categoryId}</p>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border ${
                formErrors.description ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
              placeholder="Enter product description"
            ></textarea>
            {formErrors.description && (
              <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
            )}
          </div>
        </div>
        
        {/* Pricing and Inventory Section */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Pricing & Inventory</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiDollarSign className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    formErrors.price ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                  placeholder="0.00"
                />
              </div>
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
                step="1"
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
          </div>
          
          {/* Display special price preview */}
          {formData.price && formData.discount ? (
            <div className="mt-3 p-3 bg-green-50 rounded-md">
              <p className="text-green-700 text-sm">
                Special Price after discount: 
                <span className="font-bold ml-2">
                  ${(parseFloat(formData.price) * (1 - parseFloat(formData.discount) / 100)).toFixed(2)}
                </span>
              </p>
            </div>
          ) : null}
        </div>
        
        {/* Image Upload Section */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Product Images</h4>
          
          <div className="space-y-4">
            {/* Image upload area */}
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={handleSelectFiles}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
              <FiImage className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Click to upload product images
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 5MB (Max 5 images)
              </p>
            </div>
            
            {/* Image previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove image"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
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
            className="btn-primary px-4 py-2 flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Saving...
              </>
            ) : (
              <>
                <FiSave className="mr-2" /> Save Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;