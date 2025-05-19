// src/components/profile/OrderHistory.jsx
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FiShoppingBag, FiChevronDown, FiChevronUp, FiPackage, FiClock, FiDollarSign, FiCalendar, FiSearch } from 'react-icons/fi';
import { getOrderById } from '../../features/orders/orderSlice';

const OrderHistory = ({ orders = [], isLoading, onMessage }) => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();

  // Load orders if needed
  useEffect(() => {
    if (expandedOrder && !activeOrder) {
      dispatch(getOrderById(expandedOrder))
        .unwrap()
        .then(order => {
          setActiveOrder(order);
        })
        .catch(error => {
          onMessage('error', 'Failed to load order details: ' + error);
        });
    }
  }, [dispatch, expandedOrder, activeOrder, onMessage]);

  // Handler for expanding/collapsing order details
  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      setActiveOrder(null);
    } else {
      setExpandedOrder(orderId);
      setActiveOrder(null);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '$0.00';
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  // Get status badge color based on order status
  const getStatusBadgeColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('deliver') || lowerStatus.includes('complet')) {
      return 'bg-green-100 text-green-800';
    } else if (lowerStatus.includes('ship') || lowerStatus.includes('transit')) {
      return 'bg-blue-100 text-blue-800';
    } else if (lowerStatus.includes('cancel') || lowerStatus.includes('refund')) {
      return 'bg-red-100 text-red-800';
    } else if (lowerStatus.includes('process') || lowerStatus.includes('confirm')) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-purple-100 text-purple-800'; // For "Order Placed" or other statuses
    }
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter(order => 
    order.orderId?.toString().includes(searchTerm) ||
    (order.orderStatus && order.orderStatus.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show empty state if no orders
  if (!orders || orders.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Order History</h2>
        <div className="bg-gray-50 p-8 rounded-md text-center">
          <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600 mb-4">When you place orders, they will appear here.</p>
          <button 
            onClick={() => window.location.href = '/products'}
            className="btn-primary"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order History</h2>
      
      {/* Search/filter */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search orders by ID or status..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
        </div>
      </div>
      
      {/* Orders list */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-gray-50 p-4 rounded-md text-center">
            <p className="text-gray-600">No orders found matching your search.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.orderId} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Order header */}
              <div 
                className="bg-gray-50 p-4 flex flex-col md:flex-row md:items-center md:justify-between cursor-pointer"
                onClick={() => toggleOrderDetails(order.orderId)}
              >
                <div className="flex flex-col mb-2 md:mb-0">
                  <p className="text-gray-500 text-sm mb-1">Order #{order.orderId}</p>
                  <p className="text-sm text-gray-500">{formatDate(order.orderDate)}</p>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <div className={`text-xs px-2.5 py-1 rounded-full inline-flex items-center ${getStatusBadgeColor(order.orderStatus)}`}>
                    {order.orderStatus || 'Processing'}
                  </div>
                  
                  <p className="font-medium text-primary">
                    {formatCurrency(order.totalAmount)}
                  </p>
                  
                  <button 
                    className="text-gray-500 hover:text-primary focus:outline-none"
                    aria-label={expandedOrder === order.orderId ? 'Collapse order details' : 'Expand order details'}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOrderDetails(order.orderId);
                    }}
                  >
                    {expandedOrder === order.orderId ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                </div>
              </div>
              
              {/* Order details */}
              {expandedOrder === order.orderId && (
                <div className="p-4 border-t border-gray-200 bg-white">
                  {!activeOrder ? (
                    <div className="flex justify-center items-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div>
                      {/* Order information */}
                      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-gray-50 rounded-md">
                          <div className="flex items-center mb-2">
                            <FiCalendar className="text-gray-500 mr-2" />
                            <span className="text-sm font-medium text-gray-500">Order Date</span>
                          </div>
                          <p className="text-gray-700">{formatDate(activeOrder.orderDate)}</p>
                        </div>
                        
                        <div className="p-3 bg-gray-50 rounded-md">
                          <div className="flex items-center mb-2">
                            <FiPackage className="text-gray-500 mr-2" />
                            <span className="text-sm font-medium text-gray-500">Status</span>
                          </div>
                          <p className="text-gray-700">{activeOrder.orderStatus || 'Processing'}</p>
                        </div>
                        
                        <div className="p-3 bg-gray-50 rounded-md">
                          <div className="flex items-center mb-2">
                            <FiDollarSign className="text-gray-500 mr-2" />
                            <span className="text-sm font-medium text-gray-500">Total</span>
                          </div>
                          <p className="text-gray-700">{formatCurrency(activeOrder.totalAmount)}</p>
                        </div>
                      </div>
                      
                      {/* Payment information */}
                      {activeOrder.paymentDTO && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Payment Information</h4>
                          <div className="p-3 bg-gray-50 rounded-md">
                            <p className="text-gray-700 mb-1">
                              <span className="font-medium">Method: </span>
                              {activeOrder.paymentDTO.paymentMethod}
                            </p>
                            {activeOrder.paymentDTO.pgStatus && (
                              <p className="text-gray-700">
                                <span className="font-medium">Status: </span>
                                {activeOrder.paymentDTO.pgStatus}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Shipping address */}
                      {activeOrder.addressId && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h4>
                          <div className="p-3 bg-gray-50 rounded-md">
                            <p className="text-gray-700">
                              {activeOrder.address ? (
                                <>
                                  {activeOrder.address.street}<br />
                                  {activeOrder.address.city}, {activeOrder.address.state} {activeOrder.address.zipCode}<br />
                                  {activeOrder.address.country}
                                </>
                              ) : (
                                `Address ID: ${activeOrder.addressId}`
                              )}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* Order items */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Order Items</h4>
                        <div className="border border-gray-200 rounded-md overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quantity
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {activeOrder.orderItemDTOs?.map((item, index) => (
                                  <tr key={`${activeOrder.orderId}-item-${index}`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded overflow-hidden">
                                          {item.productDTO?.image ? (
                                            <img 
                                              className="h-10 w-10 object-cover"
                                              src={item.productDTO.image}
                                              alt={item.productDTO.productName}
                                            />
                                          ) : (
                                            <div className="h-10 w-10 flex items-center justify-center text-gray-500">
                                              <FiPackage />
                                            </div>
                                          )}
                                        </div>
                                        <div className="ml-4">
                                          <div className="text-sm font-medium text-gray-900">
                                            {item.productDTO?.productName || 'Product'}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {formatCurrency(item.orderedProductPrice)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {item.quantity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {formatCurrency(item.orderedProductPrice * item.quantity)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistory;