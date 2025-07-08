// src/components/seller/SellerOrderDetails.jsx
import React from 'react';
import { FiX, FiPackage, FiCalendar, FiDollarSign, FiMail, FiMapPin, FiCreditCard } from 'react-icons/fi';

const SellerOrderDetails = ({ order, onClose, onUpdateStatus, isUpdating }) => {
  // Debug log to see the structure of order items
  React.useEffect(() => {
    if (order) {
      // console.log('=== SELLER ORDER DETAILS DEBUG ===');
      // console.log('Full Order Object:', order);
      // if (order.orderItemDTOs && order.orderItemDTOs.length > 0) {
      //   console.log('Order Items Count:', order.orderItemDTOs.length);
      //   order.orderItemDTOs.forEach((item, index) => {
      //     console.log(`Item ${index + 1}:`, {
      //       orderItemId: item.orderItemId,
      //       quantity: item.quantity,
      //       price: item.orderedProductPrice,
      //       productDTO: item.productDTO,
      //       product: item.product,
      //       productName: item.productDTO?.productName || item.product?.productName || 'NOT FOUND'
      //     });
      //   });
      // } else {
      //   console.log('No order items found');
      // }
      // console.log('=== PAYMENT INFO DEBUG ===');
      // console.log('Payment DTO exists:', !!order.paymentDTO);
      // console.log('Payment Info:', order.paymentDTO);
      // if (order.paymentDTO) {
      //   console.log('Payment fields:', Object.keys(order.paymentDTO));
      // }
      // console.log('=== ADDRESS INFO DEBUG ===');
      // console.log('Address DTO exists:', !!order.addressDTO);
      // console.log('Address Info:', order.addressDTO);
      // if (order.addressDTO) {
      //   console.log('Address fields:', Object.keys(order.addressDTO));
      // }
      // console.log('=== END DEBUG ===');
    }
  }, [order]);

  if (!order) return null;
  
  const formatCurrency = (amount) => {
    return `$${Number(amount).toFixed(2)}`;
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('cancel')) return 'text-red-600 bg-red-100';
    if (statusLower.includes('ship')) return 'text-blue-600 bg-blue-100';
    if (statusLower.includes('deliver') || statusLower.includes('complet')) return 'text-green-600 bg-green-100';
    if (statusLower.includes('process') || statusLower.includes('placed')) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };
  
  const canUpdateStatus = (status) => {
    const statusLower = status.toLowerCase();
    return !statusLower.includes('cancel') && 
           !statusLower.includes('deliver') && 
           !statusLower.includes('complet') &&
           !statusLower.includes('ship');
  };

  // Helper function to get product name with fallback options
  const getProductName = (item) => {
    // Try different possible property paths for product name
    const productName = item.productDTO?.productName || 
           item.product?.productName || 
           item.productName || 
           `Product ID: ${item.productDTO?.productId || item.product?.productId || 'Unknown'}`;
    
    // Temporary debugging alert (remove in production)
    if (productName.includes('Product ID:')) {
      // console.warn('Product name not found for item:', item);
      // console.warn('Available properties:', Object.keys(item));
      // if (item.productDTO) {
      //   console.warn('ProductDTO properties:', Object.keys(item.productDTO));
      // }
    }
    
    return productName;
  };
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Order Details #{order.orderId}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX size={24} />
          </button>
        </div>
        
        {/* Order Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Order Information</h4>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <FiCalendar className="mr-2 text-gray-400" />
                <span>Order Date: {formatDate(order.orderDate)}</span>
              </div>
              <div className="flex items-center text-sm">
                <FiMail className="mr-2 text-gray-400" />
                <span>Customer: {order.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="mr-2">Status:</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Payment Information</h4>
            <div className="space-y-2">
              {order.paymentDTO ? (
                <>
                  <div className="flex items-center text-sm">
                    <FiCreditCard className="mr-2 text-gray-400" />
                    <span>Method: {order.paymentDTO.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Online Payment'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="mr-2">Status:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.paymentDTO.pgStatus === 'pending' ? 'text-yellow-600 bg-yellow-100' : 
                      order.paymentDTO.pgStatus === 'success' ? 'text-green-600 bg-green-100' :
                      order.paymentDTO.pgStatus === 'failed' ? 'text-red-600 bg-red-100' :
                      'text-gray-600 bg-gray-100'
                    }`}>
                      {order.paymentDTO.pgStatus}
                    </span>
                  </div>
                  {/* {order.paymentDTO.pgPaymentId && (
                    <div className="flex items-center text-sm">
                      <span className="mr-2">Payment ID:</span>
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {order.paymentDTO.pgPaymentId}
                      </span>
                    </div>
                  )}
                  {order.paymentDTO.pgName && (
                    <div className="flex items-center text-sm">
                      <span className="mr-2">Gateway:</span>
                      <span>{order.paymentDTO.pgName}</span>
                    </div>
                  )} */}
                  {order.paymentDTO.pgResponseMessage && (
                    <div className="flex items-center text-sm">
                      <span className="mr-2">Response:</span>
                      <span className="text-xs text-gray-600">{order.paymentDTO.pgResponseMessage}</span>
                    </div>
                  )}
                  {/* <div className="flex items-center text-sm">
                    <FiDollarSign className="mr-2 text-gray-400" />
                    <span>Total Amount: {formatCurrency(order.totalAmount || 0)}</span>
                  </div> */}
                </>
              ) : (
                <div className="text-sm text-gray-500">
                  No payment information available
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h4>
            <div className="space-y-2">
              {order.addressDTO ? (
                <>
                  <div className="flex items-start text-sm">
                    <FiMapPin className="mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <div>{order.addressDTO.street}</div>
                      {order.addressDTO.apartmentNumber && (
                        <div>Apt: {order.addressDTO.apartmentNumber}</div>
                      )}
                      <div>{order.addressDTO.city}, {order.addressDTO.state}</div>
                      <div>{order.addressDTO.country} - {order.addressDTO.zipCode}</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-500">
                  No address information available
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Your Products in this Order */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-500 mb-3">Your Products in this Order</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            {order.orderItemDTOs && order.orderItemDTOs.length > 0 ? (
              <table className="min-w-full">
                <thead>
                  <tr className="text-xs text-gray-500 uppercase">
                    <th className="text-left pb-2">Product</th>
                    <th className="text-center pb-2">Quantity</th>
                    <th className="text-right pb-2">Price</th>
                    <th className="text-right pb-2">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.orderItemDTOs.map((item, index) => (
                    <tr key={index}>
                      <td className="py-2 text-sm">
                        <div>
                          <div className="font-medium text-gray-900">
                            {getProductName(item)}
                          </div>
                          {/* Show product ID if available for debugging */}
                          {(item.productDTO?.productId || item.product?.productId) && (
                            <div className="text-xs text-gray-500">
                              ID: {item.productDTO?.productId || item.product?.productId}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-2 text-sm text-center">{item.quantity}</td>
                      <td className="py-2 text-sm text-right">{formatCurrency(item.orderedProductPrice)}</td>
                      <td className="py-2 text-sm text-right font-medium">
                        {formatCurrency(item.orderedProductPrice * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-gray-300">
                  <tr>
                    <td colSpan="3" className="pt-2 text-sm font-medium text-right">
                      Your Total Earnings:
                    </td>
                    <td className="pt-2 text-sm font-bold text-right text-primary">
                      {formatCurrency(order.sellerTotal || 0)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No product information available for this order.
              </div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="btn-outline px-4 py-2"
          >
            Close
          </button>
          {canUpdateStatus(order.orderStatus) && (
            <button
              onClick={() => onUpdateStatus(order.orderId, 'Shipped')}
              disabled={isUpdating}
              className="btn-primary px-4 py-2 flex items-center"
            >
              <FiPackage className="mr-2" />
              {isUpdating ? 'Updating...' : 'Mark as Shipped'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerOrderDetails;