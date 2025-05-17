import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  FiArrowLeft,
  FiShoppingBag,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

// Components
import CheckoutSteps from "../components/checkout/CheckoutSteps";
import AddressSelection from "../components/checkout/AddressSelection";
import PaymentMethod from "../components/checkout/PaymentMethod";
import OrderSummary from "../components/checkout/OrderSummary";
import OrderConfirmation from "../components/checkout/OrderConfirmation";

// Redux actions
import { getCart, clearCart } from "../features/cart/cartSlice";
import { getAddresses } from "../features/address/addressSlice";
import { createOrder, resetOrderState } from "../features/orders/orderSlice";

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [orderNote, setOrderNote] = useState("");
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    cartItems,
    totalPrice,
    isLoading: cartLoading,
  } = useSelector((state) => state.cart);
  const { addresses, isLoading: addressesLoading } = useSelector(
    (state) => state.address
  );
  const {
    order,
    isLoading: orderLoading,
    success,
    error: orderError,
  } = useSelector((state) => state.order);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    // Load cart and addresses
    dispatch(getCart());
    dispatch(getAddresses());

    // Reset order state when component mounts
    dispatch(resetOrderState());
  }, [dispatch, isAuthenticated, navigate]);

  // Redirect to cart if it's empty
  useEffect(() => {
    if (!cartLoading && cartItems.length === 0 && !success && currentStep !== 4) {
      navigate("/cart");
    }
  }, [cartItems, cartLoading, navigate, success, currentStep]);

  // Watch for order errors
  useEffect(() => {
    if (orderError) {
      setError(orderError);
      // Scroll to top to show error
      window.scrollTo(0, 0);
    }
  }, [orderError]);

  // Handle successful order
  useEffect(() => {
    if (success && order) {
      // Store order ID in localStorage before redirecting
      // This helps prevent direct access to success page without an order
      localStorage.setItem('lastOrderId', order.orderId);
      navigate('/checkout/success');
    }
  }, [success, order, navigate]);

  // When component unmounts, reset order state
  useEffect(() => {
    return () => {
      // Reset order state when leaving checkout
      dispatch(resetOrderState());
    };
  }, [dispatch]);

  const goToNextStep = () => {
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    } else {
      navigate("/cart");
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setError(null);
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    setError(null);
  };

  const handlePlaceOrder = async () => {
    // Validation checks
    if (!selectedAddress) {
      setError("Please select a shipping address");
      return;
    }
  
    if (!paymentMethod) {
      setError("Please select a payment method");
      return;
    }
  
    // Ensure user is authenticated
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
  
    // Check authentication status from localStorage as a backup
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData.isLoggedIn) {
      // User is not logged in, redirect to login
      setError('Your session may have expired. Please try again or log in again.');
      setTimeout(() => {
        navigate('/login', { state: { from: '/checkout' } });
      }, 1500);
      return;
    }
  
    // Prepare order data with 'cash' as payment method (4+ chars required)
    const orderData = {
      addressId: selectedAddress.addressId,
      paymentMethod: 'cash',
      pgName: 'COD',
      pgPaymentId: 'NA',
      pgStatus: "pending",
      pgResponseMessage: orderNote || "Order placed",
    };
  
    console.log('Submitting order with data:', orderData);
  
    try {
      // Reset error state
      setError(null);
      
      // Place the order
      const result = await dispatch(createOrder(orderData)).unwrap();
      console.log('Order creation successful:', result);
      
      // Store the order for success page
      if (result) {
        localStorage.setItem('lastOrder', JSON.stringify(result));
        localStorage.setItem('lastOrderId', result.orderId?.toString());
      }
      
      // Clear the cart after successful order
      dispatch(clearCart());
      
      // Navigate to success page
      navigate('/checkout/success');
    } catch (err) {
      console.error("Failed to place order:", err);
      
      // Handle authentication errors
      if (err.message && err.message.toLowerCase().includes('authentication')) {
        setError('Authentication failed. Please log in again to place your order.');
        
        // Redirect to login after delay
        setTimeout(() => {
          navigate('/login', { state: { from: '/checkout' } });
        }, 2000);
      } else {
        // For other errors
        setError(err.message || "Failed to place order. Please try again.");
      }
    }
  };

  // Calculate order summary values
  const subtotal = totalPrice || 0;
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.07; // 7% tax
  const orderTotal = subtotal + shipping + tax;

  // Show loading state
  if (addressesLoading || cartLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout | ShopEasy</title>
        <meta
          name="description"
          content="Complete your purchase and place your order"
        />
      </Helmet>

      <div className="bg-gray-50 py-8">
        <div className="container-custom">
          {/* Back button */}
          {currentStep < 4 && (
            <button
              onClick={goToPreviousStep}
              className="flex items-center text-gray-600 hover:text-primary mb-6"
            >
              <FiArrowLeft className="mr-2" />
              {currentStep === 1 ? "Back to Cart" : "Back to Previous Step"}
            </button>
          )}

          {/* Page title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {currentStep === 4 ? "Order Confirmation" : "Checkout"}
          </h1>

          {/* Error message */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex items-center">
                <FiAlertCircle className="text-red-500 mr-3" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Success message (for final step) */}
          {currentStep === 4 && success && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <div className="flex items-center">
                <FiCheckCircle className="text-green-500 mr-3" />
                <p className="text-green-700">
                  Your order has been placed successfully!
                </p>
              </div>
            </div>
          )}

          {currentStep < 4 && <CheckoutSteps currentStep={currentStep} />}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Main content area */}
            <div className="lg:col-span-2">
              {/* Show different step content based on currentStep */}
              {currentStep === 1 && (
                <AddressSelection
                  addresses={addresses}
                  selectedAddress={selectedAddress}
                  onSelectAddress={handleAddressSelect}
                  onNextStep={goToNextStep}
                />
              )}

              {currentStep === 2 && (
                <PaymentMethod
                  selectedMethod={paymentMethod}
                  onSelectMethod={handlePaymentMethodSelect}
                  onNextStep={goToNextStep}
                  orderTotal={orderTotal}
                />
              )}

              {currentStep === 3 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Review & Place Order
                  </h2>

                  {/* Order summary for review */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-2">
                      Order Items
                    </h3>
                    <div className="bg-gray-50 p-4 rounded">
                      {cartItems.map((item) => (
                        <div
                          key={item.productId}
                          className="flex justify-between py-2 border-b border-gray-200 last:border-0"
                        >
                          <div>
                            <span className="font-medium">
                              {item.productName}
                            </span>
                            <span className="text-gray-600 text-sm ml-2">
                              × {item.quantity}
                            </span>
                          </div>
                          <span>
                            $
                            {(
                              (item.specialPrice || item.price) * item.quantity
                            ).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping address review */}
                  {selectedAddress && (
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Shipping Address
                      </h3>
                      <div className="bg-gray-50 p-4 rounded">
                        <p>{selectedAddress.apartmentNumber}</p>
                        <p>{selectedAddress.street}</p>
                        <p>
                          {selectedAddress.city}, {selectedAddress.state}{" "}
                          {selectedAddress.zipCode}
                        </p>
                        <p>{selectedAddress.country}</p>
                      </div>
                    </div>
                  )}

                  {/* Payment method review */}
                  {paymentMethod && (
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Payment Method
                      </h3>
                      <div className="bg-gray-50 p-4 rounded">
                        <p>{paymentMethod.name}</p>
                      </div>
                    </div>
                  )}

                  {/* Order notes */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-2">
                      Order Notes (Optional)
                    </h3>
                    <textarea
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      rows="3"
                      placeholder="Add any special instructions or notes for your order"
                    ></textarea>
                  </div>

                  {/* Place order button */}
                  <button
                    onClick={handlePlaceOrder}
                    disabled={orderLoading}
                    className="w-full btn-primary py-3 flex items-center justify-center"
                  >
                    {orderLoading ? "Processing..." : "Place Order"}
                  </button>
                </div>
              )}

              {currentStep === 4 && (
                <OrderConfirmation
                  order={order}
                  selectedAddress={selectedAddress}
                  paymentMethod={paymentMethod}
                />
              )}
            </div>

            {/* Order summary sidebar */}
            <div className="lg:col-span-1">
              {currentStep < 4 && (
                <OrderSummary
                  cartItems={cartItems}
                  subtotal={subtotal}
                  shipping={shipping}
                  tax={tax}
                  total={orderTotal}
                />
              )}

              {currentStep === 4 && order && (
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Order Information
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Order Number
                      </h3>
                      <p className="text-gray-900 font-medium">
                        #{order.orderId}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Order Date
                      </h3>
                      <p className="text-gray-900">
                        {new Date(order.orderDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Order Status
                      </h3>
                      <p className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {order.orderStatus}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Payment Method
                      </h3>
                      <p className="text-gray-900">
                        {order.paymentDTO?.paymentMethod || "Cash on Delivery"}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-500">
                        Total Amount
                      </h3>
                      <p className="text-2xl font-bold text-primary">
                        ${order.totalAmount?.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={() => navigate("/products")}
                      className="w-full btn-primary flex items-center justify-center"
                    >
                      <FiShoppingBag className="mr-2" /> Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;