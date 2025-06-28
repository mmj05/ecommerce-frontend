// src/components/checkout/PaymentMethod.jsx - Simplified for COD only
import { useState } from 'react';
import { FiDollarSign, FiAlertCircle } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const PaymentMethod = ({ selectedMethod, onSelectMethod, onNextStep }) => {
  const [error, setError] = useState(null);
  
  // Get cart total from Redux store
  const { totalPrice } = useSelector((state) => state.cart);
  
  // Calculate order total with shipping and tax
  const subtotal = totalPrice || 0;
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.07; // 7% tax
  const orderTotal = subtotal + shipping + tax;

  // Cash on Delivery as the only payment method
  const paymentMethod = {
    id: 'cod',
    method: 'cash', // 4-char minimum for backend validation
    name: 'Cash on Delivery',
    icon: <FiDollarSign />,
    description: 'Pay with cash when your order is delivered'
  };

  const handleMethodSelect = () => {
    onSelectMethod(paymentMethod);
    setError(null);
  };

  const handleContinue = () => {
    if (selectedMethod) {
      onNextStep();
    } else {
      setError('Please confirm your payment method');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
      
      {/* Error message */}
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center">
            <FiAlertCircle className="text-red-500 mr-3" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      {/* Payment method selection */}
      <div className="mb-8">
        <div 
          className={`border rounded-lg p-4 cursor-pointer transition-all ${
            selectedMethod ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-primary'
          }`}
          onClick={handleMethodSelect}
        >
          <div className="flex items-center">
            <div className={`p-2 rounded-full mr-4 ${
              selectedMethod ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              <FiDollarSign />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">Cash on Delivery</h3>
              <p className="text-sm text-gray-600">Pay with cash when your order is delivered</p>
            </div>
            {selectedMethod && (
              <div className="bg-primary text-white rounded-full p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Continue button */}
      <div className="mt-6">
        <button
          onClick={handleContinue}
          className="w-full btn btn-primary py-3"
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
};

export default PaymentMethod;