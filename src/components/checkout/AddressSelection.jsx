import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FiPlus, FiMapPin, FiAlertCircle } from 'react-icons/fi';
import { addAddress } from '../../features/address/addressSlice';

const AddressSelection = ({ addresses, selectedAddress, onSelectAddress, onNextStep }) => {
  const [isAddingAddress, setIsAddingAddress] = useState(false);
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

  const handleAddressSelect = (address) => {
    onSelectAddress(address);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear specific field error when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

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

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const resultAction = await dispatch(addAddress(formData));
        const newAddress = resultAction.payload;
        
        // Select the newly added address
        onSelectAddress(newAddress);
        
        // Reset form and hide the form
        setFormData({
          street: '',
          apartmentNumber: '',
          city: '',
          state: '',
          country: '',
          zipCode: ''
        });
        setIsAddingAddress(false);
      } catch (err) {
        console.error('Failed to add address:', err);
      }
    }
  };

  const handleContinue = () => {
    if (selectedAddress) {
      onNextStep();
    } else {
      setFormErrors({ general: 'Please select a shipping address' });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
      
      {/* General error */}
      {formErrors.general && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center">
            <FiAlertCircle className="text-red-500 mr-3" />
            <p className="text-red-700">{formErrors.general}</p>
          </div>
        </div>
      )}
      
      {/* Address selection */}
      {addresses && addresses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {addresses.map((address) => (
            <div 
              key={address.addressId} 
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedAddress && selectedAddress.addressId === address.addressId
                  ? 'border-primary bg-blue-50'
                  : 'border-gray-200 hover:border-primary'
              }`}
              onClick={() => handleAddressSelect(address)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{address.apartmentNumber}</p>
                  <p className="text-gray-600 text-sm">{address.street}</p>
                  <p className="text-gray-600 text-sm">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="text-gray-600 text-sm">{address.country}</p>
                </div>
                {selectedAddress && selectedAddress.addressId === address.addressId && (
                  <div className="bg-primary text-white rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Add new address button or form */}
      {!isAddingAddress ? (
        <button
          onClick={() => setIsAddingAddress(true)}
          className="btn btn-primary flex items-center mb-6"
        >
          <FiPlus className="mr-2" /> Add New Address
        </button>
      ) : (
        <div className="mb-6 border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Address</h3>
          
          <form onSubmit={handleAddressSubmit}>
            
              
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="apartmentNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Apt, suite, etc.
                </label>
                <input
                  type="text"
                  id="apartmentNumber"
                  name="apartmentNumber"
                  value={formData.apartmentNumber}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border ${
                    formErrors.apartmentNumber ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                />
                {formErrors.buildingName && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.buildingName}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
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
                  State / Province
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
              
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP / Postal Code
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
                  Country
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
            
            <div className="mt-4 flex space-x-4">
              <button
                type="submit"
                className="btn btn-primary"
              >
                Save Address
              </button>
              <button
                type="button"
                onClick={() => setIsAddingAddress(false)}
                className="btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* No addresses message */}
      {(!addresses || addresses.length === 0) && !isAddingAddress && (
        <div className="bg-gray-50 p-8 rounded-md text-center mb-6">
          <FiMapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
          <p className="text-gray-600 mb-4">Please add a shipping address to continue with checkout.</p>
        </div>
      )}
      
      {/* Continue button */}
      <div className="mt-8">
        <button
          onClick={handleContinue}
          className="w-full btn btn-primary py-3"
          disabled={!selectedAddress}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default AddressSelection;