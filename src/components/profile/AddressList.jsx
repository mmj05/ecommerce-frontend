// src/components/profile/AddressList.jsx
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FiMapPin, FiPlus, FiEdit, FiTrash2, FiX, FiSave } from 'react-icons/fi';
import { getAddresses, addAddress, updateAddress, deleteAddress } from '../../features/address/addressSlice';

const AddressList = ({ addresses = [], isLoading, onMessage }) => {
  const dispatch = useDispatch();
  
  const [showForm, setShowForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [formData, setFormData] = useState({
    street: '',
    apartmentNumber: '',
    city: '',
    state: '',
    country: '',
    zipCode: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Reset form when canceling
  const resetForm = () => {
    setFormData({
      street: '',
      apartmentNumber: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    });
    setFormErrors({});
    setShowForm(false);
    setEditingAddressId(null);
  };
  
  // Set form data when editing address
  useEffect(() => {
    if (editingAddressId) {
      const addressToEdit = addresses.find(address => address.addressId === editingAddressId);
      if (addressToEdit) {
        setFormData({
          street: addressToEdit.street || '',
          apartmentNumber: addressToEdit.apartmentNumber || '',
          city: addressToEdit.city || '',
          state: addressToEdit.state || '',
          country: addressToEdit.country || '',
          zipCode: addressToEdit.zipCode || ''
        });
        setShowForm(true);
      }
    }
  }, [editingAddressId, addresses]);
  
  // Validate form input
  const validateForm = () => {
    const errors = {};
    
    if (!formData.street.trim()) {
      errors.street = 'Street address is required';
    } else if (formData.street.length < 5) {
      errors.street = 'Street should have at least 5 characters';
    }
    
    if (!formData.city.trim()) {
      errors.city = 'City is required';
    } else if (formData.city.length < 4) {
      errors.city = 'City should have at least 4 characters';
    }
    
    if (!formData.state.trim()) {
      errors.state = 'State is required';
    } else if (formData.state.length < 2) {
      errors.state = 'State should have at least 2 characters';
    }
    
    if (!formData.country.trim()) {
      errors.country = 'Country is required';
    } else if (formData.country.length < 2) {
      errors.country = 'Country should have at least 2 characters';
    }
    
    if (!formData.zipCode.trim()) {
      errors.zipCode = 'ZIP code is required';
    } else if (formData.zipCode.length < 5) {
      errors.zipCode = 'ZIP code should have at least 5 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form input change
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
  
  // Handle form submission for adding/updating address
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (editingAddressId) {
        // Update existing address
        await dispatch(updateAddress({ 
          addressId: editingAddressId, 
          addressData: formData 
        })).unwrap();
        
        onMessage('success', 'Address updated successfully');
      } else {
        // Add new address
        await dispatch(addAddress(formData)).unwrap();
        onMessage('success', 'Address added successfully');
      }
      
      // Refresh addresses list
      dispatch(getAddresses());
      
      // Reset form
      resetForm();
    } catch (error) {
      onMessage('error', error.message || 'Failed to save address');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle address deletion
  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setIsDeleting(true);
      
      try {
        await dispatch(deleteAddress(addressId)).unwrap();
        onMessage('success', 'Address deleted successfully');
        
        // Refresh addresses list
        dispatch(getAddresses());
      } catch (error) {
        onMessage('error', error.message || 'Failed to delete address');
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  // Handle edit button click
  const handleEditAddress = (addressId) => {
    setEditingAddressId(addressId);
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">My Addresses</h2>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)} 
            className="btn btn-primary flex items-center text-sm"
            disabled={isDeleting}
          >
            <FiPlus className="mr-2" /> Add New Address
          </button>
        )}
      </div>
      
      {/* Address form */}
      {showForm && (
        <div className="mb-8 border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {editingAddressId ? 'Edit Address' : 'Add New Address'}
            </h3>
            <button 
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Cancel"
            >
              <FiX />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address*
                </label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border ${
                    formErrors.street ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                />
                {formErrors.street && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.street}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="apartmentNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Apartment, suite, etc. (optional)
                </label>
                <input
                  type="text"
                  id="apartmentNumber"
                  name="apartmentNumber"
                  value={formData.apartmentNumber}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City*
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border ${
                      formErrors.city ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                  />
                  {formErrors.city && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.city}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State / Province*
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border ${
                      formErrors.state ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                  />
                  {formErrors.state && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.state}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP / Postal Code*
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border ${
                      formErrors.zipCode ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                  />
                  {formErrors.zipCode && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.zipCode}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country*
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border ${
                      formErrors.country ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                  />
                  {formErrors.country && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.country}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
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
                    <FiSave className="mr-2" /> Save Address
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Addresses list */}
      {addresses.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-md text-center">
          <FiMapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
          <p className="text-gray-600 mb-4">Add a shipping or billing address to your account.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div 
              key={address.addressId} 
              className="border border-gray-200 rounded-lg p-4 hover:border-primary hover:shadow-sm transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <FiMapPin className="text-primary mt-1" />
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditAddress(address.addressId)}
                    className="text-gray-500 hover:text-primary"
                    aria-label="Edit address"
                    disabled={isDeleting}
                  >
                    <FiEdit />
                  </button>
                  <button 
                    onClick={() => handleDeleteAddress(address.addressId)}
                    className="text-gray-500 hover:text-red-500"
                    aria-label="Delete address"
                    disabled={isDeleting}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              
              <div className="text-gray-700 text-sm space-y-1">
                {address.apartmentNumber && <p>{address.apartmentNumber}</p>}
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p>{address.country}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressList;