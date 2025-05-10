import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiMapPin, FiPlus, FiEdit, FiTrash2, FiAlertCircle, FiCheck, FiX } from 'react-icons/fi';
import { 
  getAddresses, 
  addAddress, 
  updateAddress, 
  deleteAddress 
} from '../../features/address/addressSlice';

const Addresses = () => {
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  
  const dispatch = useDispatch();
  const { addresses, isLoading, error } = useSelector((state) => state.address);
  
  // Fetch addresses when component mounts
  useEffect(() => {
    dispatch(getAddresses());
  }, [dispatch]);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">My Addresses</h2>
        <button 
          onClick={() => {
            setIsAddingAddress(true);
            setEditingAddressId(null);
          }}
          className="btn-primary text-sm px-3 py-1 flex items-center"
        >
          <FiPlus className="mr-1" /> Add New Address
        </button>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center">
            <FiAlertCircle className="text-red-500 mr-3" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      
      {/* Address form */}
      {(isAddingAddress || editingAddressId) && (
        <AddressForm 
          address={editingAddressId ? addresses.find(a => a.addressId === editingAddressId) : null}
          onCancel={() => {
            setIsAddingAddress(false);
            setEditingAddressId(null);
          }}
          onSave={() => {
            setIsAddingAddress(false);
            setEditingAddressId(null);
          }}
        />
      )}
      
      {/* Addresses list */}
      {!isLoading && (
        <div className="mt-4 space-y-4">
          {addresses.length === 0 && !isAddingAddress ? (
            <div className="bg-gray-50 p-8 rounded-md text-center">
              <FiMapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
              <p className="text-gray-600">Add a shipping or billing address to your account.</p>
            </div>
          ) : (
            addresses.map((address) => (
              <div 
                key={address.addressId}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{address.apartmentNumber || ''}</p>
                    <p className="text-gray-600">{address.street}</p>
                    <p className="text-gray-600">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="text-gray-600">{address.country}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingAddressId(address.addressId)}
                      className="p-1 text-gray-500 hover:text-primary"
                      aria-label="Edit address"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this address?')) {
                          dispatch(deleteAddress(address.addressId));
                        }
                      }}
                      className="p-1 text-gray-500 hover:text-red-500"
                      aria-label="Delete address"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const AddressForm = ({ address, onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    street: '',
    apartmentNumber: '',
    city: '',
    state: '',
    country: '',
    zipCode: ''
  });
  const [formErrors, setFormErrors] = useState({});
  
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.address);
  
  // Set form data if editing an existing address
  useEffect(() => {
    if (address) {
      setFormData({
        street: address.street || '',
        apartmentNumber: address.apartmentNumber || '',
        city: address.city || '',
        state: address.state || '',
        country: address.country || '',
        zipCode: address.zipCode || ''
      });
    }
  }, [address]);
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear specific field error when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };
  
  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    
    if (!formData.street) {
      errors.street = 'Street address is required';
    } else if (formData.street.length < 5) {
      errors.street = 'Street should have at least 5 characters';
    }
    
    if (!formData.city) {
      errors.city = 'City is required';
    } else if (formData.city.length < 2) {
      errors.city = 'City should have at least 2 characters';
    }
    
    if (!formData.state) {
      errors.state = 'State is required';
    } else if (formData.state.length < 2) {
      errors.state = 'State should have at least 2 characters';
    }
    
    if (!formData.country) {
      errors.country = 'Country is required';
    } else if (formData.country.length < 2) {
      errors.country = 'Country should have at least 2 characters';
    }
    
    if (!formData.zipCode) {
      errors.zipCode = 'ZIP code is required';
    } else if (formData.zipCode.length < 5) {
      errors.zipCode = 'ZIP code should have at least 5 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        if (address) {
          // Update existing address
          await dispatch(updateAddress({
            addressId: address.addressId,
            addressData: formData
          })).unwrap();
        } else {
          // Add new address
          await dispatch(addAddress(formData)).unwrap();
        }
        
        onSave();
      } catch (err) {
        console.error('Failed to save address:', err);
      }
    }
  };
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-medium mb-4">
        {address ? 'Edit Address' : 'Add New Address'}
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address *
            </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className={`w-full p-2 border ${
                formErrors.street ? 'border-red-500' : 'border-gray-300'
              } rounded focus:outline-none focus:ring-primary focus:border-primary`}
            />
            {formErrors.street && (
              <p className="mt-1 text-sm text-red-500">{formErrors.street}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apartment, suite, etc.
            </label>
            <input
              type="text"
              name="apartmentNumber"
              value={formData.apartmentNumber}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full p-2 border ${
                formErrors.city ? 'border-red-500' : 'border-gray-300'
              } rounded focus:outline-none focus:ring-primary focus:border-primary`}
            />
            {formErrors.city && (
              <p className="mt-1 text-sm text-red-500">{formErrors.city}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State / Province *
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={`w-full p-2 border ${
                formErrors.state ? 'border-red-500' : 'border-gray-300'
              } rounded focus:outline-none focus:ring-primary focus:border-primary`}
            />
            {formErrors.state && (
              <p className="mt-1 text-sm text-red-500">{formErrors.state}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZIP / Postal Code *
            </label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              className={`w-full p-2 border ${
                formErrors.zipCode ? 'border-red-500' : 'border-gray-300'
              } rounded focus:outline-none focus:ring-primary focus:border-primary`}
            />
            {formErrors.zipCode && (
              <p className="mt-1 text-sm text-red-500">{formErrors.zipCode}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country *
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={`w-full p-2 border ${
                formErrors.country ? 'border-red-500' : 'border-gray-300'
              } rounded focus:outline-none focus:ring-primary focus:border-primary`}
            />
            {formErrors.country && (
              <p className="mt-1 text-sm text-red-500">{formErrors.country}</p>
            )}
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 flex items-center"
          >
            <FiX className="mr-1" /> Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <>Saving...</>
            ) : (
              <>
                <FiCheck className="mr-1" /> Save Address
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Addresses;