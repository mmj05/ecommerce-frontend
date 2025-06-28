import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  FiArrowLeft,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiShoppingBag,
} from "react-icons/fi";
import {
  getCart,
  updateCartItem,
  removeFromCart,
} from "../features/cart/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, totalPrice, isLoading, error } = useSelector(
    (state) => state.cart
  );
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [cartId, setCartId] = useState(null);
  const initialLoadDoneRef = useRef(false);

  // Fetch cart data when component mounts
  useEffect(() => {
    if (!initialLoadDoneRef.current) {
      dispatch(getCart());
      initialLoadDoneRef.current = true;
    }
  }, [dispatch]);

  // Update cartId when cart data changes
  useEffect(() => {
    // Get cart ID from first item if authenticated (all items have the same cart ID)
    if (isAuthenticated && cartItems.length > 0 && cartItems[0].cartId) {
      setCartId(cartItems[0].cartId);
    }
  }, [isAuthenticated, cartItems]);

  const handleQuantityChange = (productId, operation) => {
    // If decreasing and current quantity is 1, remove the item instead
    const currentItem = cartItems.find((item) => item.productId === productId);

    if (operation === "decrease" && currentItem && currentItem.quantity === 1) {
      // If quantity would become 0, remove the item completely
      handleRemoveItem(productId);
    } else {
      // Otherwise proceed with normal quantity update
      dispatch(updateCartItem({ productId, operation }))
        .unwrap()
        .then(() => {
          // Refresh cart after update to ensure we have the latest data
          if (isAuthenticated) {
            dispatch(getCart());
          }
        })
        .catch((error) => {
          console.error("Failed to update quantity:", error);
        });
    }
  };

  const handleRemoveItem = (productId) => {
    if (isAuthenticated && !cartId) {
      // If cartId is not available yet but we're authenticated, fetch it first
      dispatch(getCart())
        .unwrap()
        .then((response) => {
          const updatedCartId = response.cartId || (response.products && response.products.length > 0 ? response.products[0].cartId : null);
          if (updatedCartId) {
            dispatch(removeFromCart({ cartId: updatedCartId, productId }))
              .unwrap()
              .then(() => dispatch(getCart()));
          }
        });
    } else {
      // Normal flow with cartId already available or guest user
      dispatch(removeFromCart({ cartId, productId }))
        .unwrap()
        .then(() => {
          // For authenticated users, refresh the cart to ensure we have the latest data
          if (isAuthenticated) {
            dispatch(getCart());
          }
        })
        .catch((error) => {
          console.error("Failed to remove item:", error);
        });
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Redirect to login page if user is not authenticated
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    // Navigate to checkout page
    navigate("/checkout");
  };

  // Calculate subtotal, shipping, and total
  const subtotal = totalPrice || 0;
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.07; // 7% tax
  const orderTotal = subtotal + shipping + tax;

  // Format currency
  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  // Show loading state only during initial load
  if (isLoading && !initialLoadDoneRef.current) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Your Shopping Cart | ShopEasy</title>
        <meta
          name="description"
          content="Review and manage items in your shopping cart"
        />
      </Helmet>

      <div className="bg-gray-50 py-12">
        <div className="container-custom">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Your Shopping Cart
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <FiShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-6" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any products to your cart yet.
              </p>
              <Link
                to="/products"
                className="btn btn-primary inline-flex items-center px-6 py-3"
              >
                <FiArrowLeft className="mr-2" /> Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Items ({cartItems.length})
                    </h2>
                    {!isAuthenticated && (
                      <p className="text-sm text-gray-500 mt-2">
                        You're not signed in.{" "}
                        <Link
                          to="/login"
                          className="text-primary hover:underline"
                        >
                          Sign in
                        </Link>{" "}
                        to save your cart and checkout.
                      </p>
                    )}
                  </div>

                  <ul className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <li key={item.productId} className="p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center">
                          {/* Product Image */}
                          <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden mr-4 mb-4 sm:mb-0">
                            <img
                              src={
                                item.image || "https://via.placeholder.com/80"
                              }
                              alt={item.productName}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1">
                            <Link
                              to={`/products/${item.productId}`}
                              className="text-lg font-medium text-gray-900 hover:text-primary"
                            >
                              {item.productName}
                            </Link>

                            <div className="mt-1 text-sm text-gray-500 truncate max-w-md">
                              {item.description}
                            </div>

                            <div className="mt-2 flex items-center text-sm">
                              <span className="text-primary font-semibold">
                                {formatCurrency(
                                  item.specialPrice || item.price
                                )}
                              </span>

                              {item.discount > 0 && (
                                <span className="ml-2 text-gray-500 line-through">
                                  {formatCurrency(item.price)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center mt-4 sm:mt-0">
                            <div className="flex items-center border border-gray-300 rounded-md mr-4">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.productId,
                                    "decrease"
                                  )
                                }
                                className="p-2 hover:bg-gray-100"
                                aria-label="Decrease quantity"
                              >
                                <FiMinus size={16} />
                              </button>
                              <span className="w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.productId,
                                    "increase"
                                  )
                                }
                                className="p-2 hover:bg-gray-100"
                                aria-label="Increase quantity"
                              >
                                <FiPlus size={16} />
                              </button>
                            </div>

                            <button
                              onClick={() => handleRemoveItem(item.productId)}
                              className="text-red-500 hover:text-red-700"
                              aria-label="Remove item"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <Link
                    to="/products"
                    className="inline-flex items-center text-primary hover:text-primary-dark"
                  >
                    <FiArrowLeft className="mr-2" /> Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {formatCurrency(shipping)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (7%)</span>
                      <span className="font-medium">{formatCurrency(tax)}</span>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900">
                          Total
                        </span>
                        <span className="text-lg font-semibold text-primary">
                          {formatCurrency(orderTotal)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={handleCheckout}
                      className="w-full btn-primary py-3 flex items-center justify-center"
                    >
                      {isAuthenticated
                        ? "Proceed to Checkout"
                        : "Sign in to Checkout"}
                    </button>

                    {!isAuthenticated && (
                      <p className="text-sm text-gray-500 mt-4 text-center">
                        Your cart will be saved when you sign in.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;