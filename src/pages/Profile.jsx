// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
  FiUser, 
  FiShoppingBag, 
  FiMapPin, 
  FiKey, 
  FiSettings,
  FiAlertCircle,
  FiCheckCircle
} from 'react-icons/fi';

// Components
import ProfileInfo from '../components/profile/ProfileInfo';
import OrderHistory from '../components/profile/OrderHistory';
import AddressList from '../components/profile/AddressList';
import ChangePassword from '../components/profile/ChangePassword';
import AccountSettings from '../components/profile/AccountSettings';

// Redux actions
import { getUserOrders } from '../features/orders/orderSlice';
import { getAddresses } from '../features/address/addressSlice';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const { user, isAuthenticated, isLoading: authLoading } = useSelector((state) => state.auth);
  const { orders, isLoading: ordersLoading } = useSelector((state) => state.order);
  const { addresses, isLoading: addressesLoading } = useSelector((state) => state.address);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: '/profile' } });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Load initial data
  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'orders') {
        dispatch(getUserOrders());
      } else if (activeTab === 'addresses') {
        dispatch(getAddresses());
      }
    }
  }, [dispatch, isAuthenticated, activeTab]);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render profile content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Handler for success/error messages
  const handleMessage = (type, message) => {
    if (type === 'success') {
      setSuccess(message);
      setError('');
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
    } else {
      setError(message);
      setSuccess('');
    }
    
    // Scroll to top of page to show message
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Helmet>
        <title>My Account | ShopEasy</title>
        <meta name="description" content="Manage your account, orders, and addresses" />
      </Helmet>

      <div className="bg-gray-50 py-8">
        <div className="container-custom">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">My Account</h1>
          
          {/* Success message */}
          {success && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded flex items-start">
              <FiCheckCircle className="text-green-500 mt-1 mr-3" />
              <p className="text-green-700">{success}</p>
            </div>
          )}
          
          {/* Error message */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start">
              <FiAlertCircle className="text-red-500 mt-1 mr-3" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full md:w-1/4">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-full">
                      <FiUser className="text-primary text-xl" />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-lg font-semibold text-gray-900">{user?.username}</h2>
                      <p className="text-gray-600 text-sm">{user?.email}</p>
                    </div>
                  </div>
                </div>

                <nav className="p-2">
                  <ul>
                    {[
                      { id: 'profile', label: 'Profile', icon: <FiUser /> },
                      { id: 'orders', label: 'Orders', icon: <FiShoppingBag /> },
                      { id: 'addresses', label: 'Addresses', icon: <FiMapPin /> },
                      { id: 'password', label: 'Change Password', icon: <FiKey /> },
                      { id: 'settings', label: 'Account Settings', icon: <FiSettings /> },
                    ].map((tab) => (
                      <li key={tab.id}>
                        <button
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center p-3 rounded-md text-left transition-colors ${
                            activeTab === tab.id
                              ? 'bg-primary bg-opacity-10 text-primary'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <span className="mr-3">{tab.icon}</span>
                          {tab.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-full md:w-3/4 bg-white rounded-lg shadow-sm p-6">
              {activeTab === 'profile' && (
                <ProfileInfo user={user} onMessage={handleMessage} />
              )}
              
              {activeTab === 'orders' && (
                <OrderHistory 
                  orders={orders} 
                  isLoading={ordersLoading} 
                  onMessage={handleMessage} 
                />
              )}
              
              {activeTab === 'addresses' && (
                <AddressList 
                  addresses={addresses} 
                  isLoading={addressesLoading} 
                  onMessage={handleMessage} 
                />
              )}
              
              {activeTab === 'password' && (
                <ChangePassword onMessage={handleMessage} />
              )}
              
              {activeTab === 'settings' && (
                <AccountSettings user={user} onMessage={handleMessage} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;