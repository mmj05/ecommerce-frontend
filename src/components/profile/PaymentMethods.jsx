import { FiCreditCard } from 'react-icons/fi';

// This is a stub component that will be implemented in the future
// Currently displaying only placeholder UI since there's no payment methods API yet
const PaymentMethods = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Payment Methods</h2>
        <button className="btn-primary text-sm">Add Payment Method</button>
      </div>
      
      <div className="bg-gray-50 p-8 rounded-md text-center">
        <FiCreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No payment methods saved</h3>
        <p className="text-gray-600">Add a credit or debit card for faster checkout.</p>
        <p className="text-sm text-gray-500 mt-4">
          This feature will be available soon. Currently, we support Cash on Delivery.
        </p>
      </div>
    </div>
  );
};

export default PaymentMethods;