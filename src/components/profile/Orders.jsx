import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserOrders, getOrderById } from '../../features/user/userProfileSlice';
import { FiShoppingBag, FiCalendar, FiBox, FiChevronDown, FiChevronUp, FiPackage, FiAlertCircle } from 'react-icons/fi';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, currentOrder, isLoading, error } = useSelector((state) => state.userProfile);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  
  // Fetch orders when component mounts
  useEffect(() => {
    try {
      dispatch(getUserOrders())
        .catch(err => {
          console.error("Error dispatching getUserOrders:", err);
        });
    } catch (err) {
      console.error("Exception in orders useEffect:", err);
    }
  }, [dispatch]);
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '$0.00';
    return `$${Number(amount).toFixed(2)}`;
  };
  
  // Toggle order expansion
  const toggleOrderExpand = async (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
      // Fetch order details if not already loaded
      if (!currentOrder || currentOrder.orderId !== orderId) {
        try {
          console.log(`Fetching details for order ${orderId}`);
          await dispatch(getOrderById(orderId)).unwrap()
            .then(data => {
              console.log("Order details loaded successfully:", data);
            })
            .catch(err => {
              console.error(`Failed to load order details for ID ${orderId}:`, err);
            });
        } catch (err) {
          console.error("Exception in toggleOrderExpand:", err);
        }
      }
    }
  };
  
  // Define order status color based on status
  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    status = status.toLowerCase();
    
    if (status.includes('placed') || status.includes('processing')) {
      return 'bg-blue-100 text-blue-800';
    } else if (status.includes('shipped') || status.includes('transit')) {
      return 'bg-purple-100 text-purple-800';
    } else if (status.includes('delivered') || status.includes('completed')) {
      return 'bg-green-100 text-green-800';
    } else if (status.includes('cancel')) {
      return 'bg-red-100 text-red-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-center">
        <FiAlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Orders</h3>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">My Orders</h2>
      
      {Array.isArray(orders) && orders.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-md text-center">
          <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600 mb-4">When you place orders, they will appear here.</p>
          <a href="/products" className="btn-primary px-4 py-2 inline-block">Start Shopping</a>
        </div>
      ) : (
        <div className="space-y-4">
          {Array.isArray(orders) && orders.map((order) => (
            <div key={order.orderId} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-50 p-4 flex flex-wrap items-center justify-between">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <FiPackage className="text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Order #{order.orderId}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <FiCalendar className="mr-1" size={14} />
                      {formatDate(order.orderDate)}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-end sm:items-center mt-2 sm:mt-0 space-y-2 sm:space-y-0 sm:space-x-4">
                  <div>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus || 'Processing'}
                    </span>
                  </div>
                  <div className="font-medium text-primary">
                    {formatCurrency(order.totalAmount)}
                  </div>
                  <button
                    onClick={() => toggleOrderExpand(order.orderId)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {expandedOrderId === order.orderId ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                </div>
              </div>
              
              {/* Order Details */}
              {expandedOrderId === order.orderId && (
                <div className="p-4 border-t border-gray-200">
                  {isLoading ? (
                    <div className="flex justify-center p-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <>
                      <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                      <div className="space-y-3 mb-4">
                        {currentOrder && currentOrder.orderItemDTOs ? (
                          currentOrder.orderItemDTOs.map((item, index) => (
                            <div key={index} className="flex items-start p-2 border-b border-gray-100 last:border-0">
                              <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 mr-3 overflow-hidden">
                                {item.productDTO && item.productDTO.image ? (
                                  <img 
                                    src={item.productDTO.image} 
                                    alt={item.productDTO?.productName || 'Product'} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full">
                                    <FiBox className="text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900">
                                  {item.productDTO?.productName || 'Product'}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Quantity: {item.quantity} × {formatCurrency(item.orderedProductPrice)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-gray-900">
                                  {formatCurrency(item.orderedProductPrice * item.quantity)}
                                </p>
                                {item.discount > 0 && (
                                  <p className="text-xs text-green-600">
                                    Save {item.discount}%
                                  </p>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 italic">Order details not available</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 pt-4">
                        {/* Shipping address */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                          <div className="bg-gray-50 p-3 rounded text-sm">
                            {currentOrder?.addressDTO ? (
                              <>
                                <p>{currentOrder.addressDTO.street}</p>
                                {currentOrder.addressDTO.apartmentNumber && (
                                  <p>{currentOrder.addressDTO.apartmentNumber}</p>
                                )}
                                <p>
                                  {currentOrder.addressDTO.city}, {currentOrder.addressDTO.state} {currentOrder.addressDTO.zipCode}
                                </p>
                                <p>{currentOrder.addressDTO.country}</p>
                              </>
                            ) : (
                              <p className="text-gray-500 italic">Address not available</p>
                            )}
                          </div>
                        </div>
                        
                        {/* Payment info */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Payment Information</h4>
                          <div className="bg-gray-50 p-3 rounded text-sm">
                            <p className="font-medium">Method: {currentOrder?.paymentDTO?.paymentMethod || 'Not available'}</p>
                            <p>Status: {currentOrder?.paymentDTO?.pgStatus || 'Processing'}</p>
                            {currentOrder?.paymentDTO?.pgPaymentId && (
                              <p>Payment ID: {currentOrder.paymentDTO.pgPaymentId}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Order summary */}
                      <div className="border-t border-gray-200 mt-4 pt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span>{formatCurrency(currentOrder?.totalAmount ? currentOrder.totalAmount * 0.93 : 0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tax (7%)</span>
                            <span>{formatCurrency(currentOrder?.totalAmount ? currentOrder.totalAmount * 0.07 : 0)}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Total</span>
                            <span className="text-primary">{formatCurrency(currentOrder?.totalAmount)}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;