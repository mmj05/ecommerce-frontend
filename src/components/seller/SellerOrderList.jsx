// src/components/seller/SellerOrderList.jsx
import { useState } from 'react';
import { FiPackage, FiCalendar, FiDollarSign, FiMail, FiTruck, FiEye } from 'react-icons/fi';

const SellerOrderList = ({ orders, onViewOrder, onUpdateStatus, isUpdating }) => {
  const [expandedOrders, setExpandedOrders] = useState({});
  
  const formatCurrency = (amount) => {
    return `$${Number(amount).toFixed(2)}`;
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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
    return item.productDTO?.productName || 
           item.product?.productName || 
           item.productName || 
           `Product ID: ${item.productDTO?.productId || item.product?.productId || 'Unknown'}`;
  };
  
  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Details
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Your Products
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Your Earnings
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        #{order.orderId}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <FiCalendar className="mr-1" />
                        {formatDate(order.orderDate)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <FiMail className="mr-1" />
                      {order.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <button
                        onClick={() => toggleOrderExpansion(order.orderId)}
                        className="text-sm text-primary hover:text-primary-dark"
                      >
                        {order.orderItemDTOs?.length || 0} item(s)
                        {expandedOrders[order.orderId] ? ' ▼' : ' ▶'}
                      </button>
                      {expandedOrders[order.orderId] && (
                        <div className="mt-2 space-y-1">
                          {order.orderItemDTOs?.map((item, index) => (
                            <div key={index} className="text-xs text-gray-600">
                              • {getProductName(item)} x {item.quantity}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 flex items-center">
                      <FiDollarSign className="mr-1" />
                      {formatCurrency(order.sellerTotal || 0)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center space-x-2">
                      <button
                        onClick={() => onViewOrder(order.orderId)}
                        className="text-primary hover:text-primary-dark"
                        title="View Details"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      {canUpdateStatus(order.orderStatus) && (
                        <button
                          onClick={() => onUpdateStatus(order.orderId, 'Shipped')}
                          disabled={isUpdating}
                          className="text-blue-600 hover:text-blue-700 disabled:text-gray-400"
                          title="Mark as Shipped"
                        >
                          <FiTruck className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center">
                    <FiPackage className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                    <p className="text-gray-600">
                      Orders containing your products will appear here.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Table footer with count */}
      {orders && orders.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOrderList;