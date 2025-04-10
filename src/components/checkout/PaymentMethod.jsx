import { useState } from 'react';
import { FiCreditCard, FiDollarSign, FiAlertCircle } from 'react-icons/fi';

const PaymentMethod = ({ selectedMethod, onSelectMethod, onNextStep }) => {
  const [error, setError] = useState(null);

  // Available payment methods
  const paymentMethods = [
    {
      id: 'cod',
      method: 'cod',
      name: 'Cash on Delivery',
      icon: <FiDollarSign />,
      description: 'Pay with cash when your order is delivered'
    },
    {
      id: 'credit_card',
      method: 'credit_card',
      name: 'Credit/Debit Card',
      icon: <FiCreditCard />,
      description: 'Pay securely with your credit or debit card',
      disabled: true // Disabled for demo purposes
    }
  ];

  const handleMethodSelect = (method) => {
    if (method.disabled) {
      setError('This payment method is not available at the moment. Please choose another one.');
      return;
    }
    
    onSelectMethod(method);
    setError(null);
  };

  const handleContinue = () => {
    if (selectedMethod) {
      onNextStep();
    } else {
      setError('Please select a payment method');
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
      <div className="space-y-4 mb-8">
        {paymentMethods.map((method) => (
          <div 
            key={method.id} 
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              method.disabled ? 'opacity-50 cursor-not-allowed' : (
                selectedMethod && selectedMethod.id === method.id
                  ? 'border-primary bg-blue-50'
                  : 'border-gray-200 hover:border-primary'
              )
            }`}
            onClick={() => !method.disabled && handleMethodSelect(method)}
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-full mr-4 ${
                selectedMethod && selectedMethod.id === method.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {method.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{method.name}</h3>
                <p className="text-sm text-gray-600">{method.description}</p>
                {method.disabled && (
                  <p className="text-xs text-red-500 mt-1">Currently unavailable</p>
                )}
              </div>
              {selectedMethod && selectedMethod.id === method.id && (
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
      
      {/* Note about payments */}
      <div className="bg-gray-50 p-4 rounded-md mb-8">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> For demonstration purposes, only Cash on Delivery is available. 
          In a real application, this would connect to payment processors like Stripe, PayPal, etc.
        </p>
      </div>
      
      {/* Continue button */}
      <button
        onClick={handleContinue}
        className="w-full btn-primary py-3"
        disabled={!selectedMethod}
      >
        Continue to Review
      </button>
    </div>
  );
};

export default PaymentMethod;