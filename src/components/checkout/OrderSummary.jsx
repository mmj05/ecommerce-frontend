import { FiShoppingBag } from 'react-icons/fi';

const OrderSummary = ({ cartItems, subtotal, shipping, tax, total }) => {
  // Format currency
  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
      
      {/* Items summary */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          Items ({cartItems.length})
        </h3>
        
        <div className="max-h-60 overflow-auto pr-2">
          {cartItems.map((item) => (
            <div 
              key={item.productId} 
              className="flex items-start py-3 border-b border-gray-200 last:border-0"
            >
              <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 mr-3 overflow-hidden">
                <img 
                  src={item.image || "https://via.placeholder.com/48"} 
                  alt={item.productName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.productName}
                </p>
                <p className="text-xs text-gray-500">
                  Qty: {item.quantity}
                </p>
              </div>
              <div className="text-sm font-medium text-gray-900 ml-2">
                {formatCurrency((item.specialPrice || item.price) * item.quantity)}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Price breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900 font-medium">{formatCurrency(subtotal)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-900 font-medium">{formatCurrency(shipping)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (7%)</span>
          <span className="text-gray-900 font-medium">{formatCurrency(tax)}</span>
        </div>
      </div>
      
      {/* Total */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold text-gray-900">Total</span>
          <span className="text-lg font-bold text-primary">{formatCurrency(total)}</span>
        </div>
      </div>
      
      {/* Shipping & secure transaction notice */}
      <div className="mt-6 text-xs text-gray-500 space-y-2">
        <p className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Free shipping on orders over $50
        </p>
        <p className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Secure checkout
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;