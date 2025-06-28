// Updated Header component with seller and admin links
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { getCart } from "../../features/cart/cartSlice";
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiPackage, FiGrid, FiShoppingBag } from "react-icons/fi";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated, user, authChecked } = useSelector((state) => state.auth);
  const { cartItems, cartUpdated, isLoading: cartLoading } = useSelector((state) => state.cart);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);
  const cartFetchTimeoutRef = useRef(null);

  // Check if user is a seller or admin
  const isSeller = user?.roles?.includes('ROLE_SELLER') || user?.roles?.includes('ROLE_ADMIN');
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  // Fetch cart data when component mounts or cart is updated
  useEffect(() => {
    // Cancel any pending timeouts
    if (cartFetchTimeoutRef.current) {
      clearTimeout(cartFetchTimeoutRef.current);
      cartFetchTimeoutRef.current = null;
    }

    // Only fetch if authenticated status is confirmed and we're not already loading
    if (authChecked && !cartLoading) {
      // Set a timeout to prevent rapid sequential fetches
      cartFetchTimeoutRef.current = setTimeout(() => {
        dispatch(getCart());
        cartFetchTimeoutRef.current = null;
      }, 300);
    }

    // Cleanup on unmount
    return () => {
      if (cartFetchTimeoutRef.current) {
        clearTimeout(cartFetchTimeoutRef.current);
      }
    };
  }, [dispatch, cartUpdated, authChecked, isAuthenticated]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle clicks outside of the profile menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    }

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery("");
      setIsMenuOpen(false); // Close mobile menu after search
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      // After logout completes, redirect to home
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Calculate total cart items quantity
  const cartItemsQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">FlipDot</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full py-2 pl-4 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 mt-2 mr-3 text-gray-500 hover:text-primary"
                >
                  <FiSearch size={20} />
                </button>
              </div>
            </form>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/products" className="text-gray-700 hover:text-primary">
              Products
            </Link>
            <Link to="/categories" className="text-gray-700 hover:text-primary">
              Categories
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  className={`flex items-center ${
                    isProfileMenuOpen
                      ? "text-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <FiUser className="mr-1" />
                  {user?.username || "User"}
                  <svg
                    className={`ml-1 h-5 w-5 transition-transform duration-200 ${
                      isProfileMenuOpen ? "rotate-180" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 z-10 w-48 mt-2 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      
                      {/* Seller/Admin links */}
                      {isSeller && (
                        <Link
                          to="/seller/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Seller Dashboard
                        </Link>
                      )}
                      
                      {isAdmin && (
                        <>
                          <Link
                            to="/admin/products"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            Product Management
                          </Link>
                          <Link
                            to="/admin/categories"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            Category Management
                          </Link>
                        </>
                      )}
                      
                      <div className="border-t border-gray-100 my-1"></div>
                      
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-primary">
                <FiUser className="mr-1 inline" />
                Login
              </Link>
            )}

            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-primary"
            >
              <FiShoppingCart size={22} />
              {cartItemsQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemsQuantity > 99 ? "99+" : cartItemsQuantity}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Search Bar - Mobile */}
        <div className="mt-4 md:hidden">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full py-2 pl-4 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-0 top-0 mt-2 mr-3 text-gray-500 hover:text-primary"
              >
                <FiSearch size={20} />
              </button>
            </div>
          </form>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-2">
            <div className="flex flex-col space-y-3">
              <Link
                to="/products"
                className="text-gray-700 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/categories"
                className="text-gray-700 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-primary flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiUser className="mr-2" />
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="text-gray-700 hover:text-primary flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiShoppingBag className="mr-2" />
                    My Orders
                  </Link>
                  
                  {/* Seller/Admin mobile links */}
                  {isSeller && (
                    <Link
                      to="/seller/dashboard"
                      className="text-gray-700 hover:text-primary flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiPackage className="mr-2" />
                      Seller Dashboard
                    </Link>
                  )}
                  
                  {isAdmin && (
                    <>
                      <Link
                        to="/admin/products"
                        className="text-gray-700 hover:text-primary flex items-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiPackage className="mr-2" />
                        Product Management
                      </Link>
                      <Link
                        to="/admin/categories"
                        className="text-gray-700 hover:text-primary flex items-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiGrid className="mr-2" />
                        Category Management
                      </Link>
                    </>
                  )}
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-gray-700 hover:text-primary flex items-center"
                  >
                    <FiX className="mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}

              <Link
                to="/cart"
                className="flex items-center text-gray-700 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <FiShoppingCart className="mr-2" />
                Cart
                {cartItemsQuantity > 0 && (
                  <span className="ml-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                    {cartItemsQuantity > 99 ? "99+" : cartItemsQuantity}
                  </span>
                )}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;