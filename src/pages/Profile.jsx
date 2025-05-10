import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiShoppingBag, FiMapPin, FiCreditCard } from 'react-icons/fi';

// Redux actions
import { getUserProfile } from '../features/user/userProfileSlice';

// Components
import PersonalInfo from '../components/profile/PersonalInfo';
import Orders from '../components/profile/Orders';
import Addresses from '../components/profile/Addresses';
import PaymentMethods from '../components/profile/PaymentMethods';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, isAuthenticated, isLoading: authLoading } = useSelector((state) => state.auth);
  const { profile, isLoading: profileLoading } = useSelector((state) => state.userProfile);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: '/profile' } });
    }
  }, [isAuthenticated, authLoading, navigate]);
  
  // Fetch profile data when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      // Check if we already have user data from auth state
      console.log('Checking for user data...', user);
      
      // Only dispatch getUserProfile if we need more profile data
      const needsFetching = !profile;
      if (needsFetching) {
        console.log('Fetching profile data...');
        dispatch(getUserProfile())
          .catch(err => {
            console.error('Failed to fetch profile:', err);
          });
      } else {
        console.log('Using existing profile data');
      }
    }
  }, [dispatch, isAuthenticated, profile, user]);
  
  // Show loading state while checking authentication or fetching profile
  const isLoading = authLoading || profileLoading;
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If not authenticated and not loading, don't render the profile content
  if (!isAuthenticated) {
    return null;
  }
  
  // Only render the profile content if authenticated and user data exists
  return (
    <div className="bg-gray-50 py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Account</h1>

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
                    <h2 className="text-lg font-semibold text-gray-900">{user?.username || profile?.username || "User"}</h2>
                    <p className="text-gray-600 text-sm">{user?.email || profile?.email || "user@example.com"}</p>
                  </div>
                </div>
              </div>

              <nav className="p-2">
                <ul>
                  {[
                    { id: 'profile', label: 'Profile', icon: <FiUser /> },
                    { id: 'orders', label: 'Orders', icon: <FiShoppingBag /> },
                    { id: 'addresses', label: 'Addresses', icon: <FiMapPin /> },
                    { id: 'payment', label: 'Payment Methods', icon: <FiCreditCard /> },
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
              <PersonalInfo profile={profile || user} />
            )}

            {activeTab === 'orders' && (
              <Orders />
            )}

            {activeTab === 'addresses' && (
              <Addresses />
            )}

            {activeTab === 'payment' && (
              <PaymentMethods />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;