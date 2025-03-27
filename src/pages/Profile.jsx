import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiUser, FiMail, FiShoppingBag, FiMapPin, FiCreditCard, FiEdit } from 'react-icons/fi';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, isLoading } = useSelector((state) => state.auth);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FiUser /> },
    { id: 'orders', label: 'Orders', icon: <FiShoppingBag /> },
    { id: 'addresses', label: 'Addresses', icon: <FiMapPin /> },
    { id: 'payment', label: 'Payment Methods', icon: <FiCreditCard /> },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

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
                    <h2 className="text-lg font-semibold text-gray-900">{user?.username || 'User'}</h2>
                    <p className="text-gray-600 text-sm">{user?.email || 'email@example.com'}</p>
                  </div>
                </div>
              </div>

              <nav className="p-2">
                <ul>
                  {tabs.map((tab) => (
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
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                  <button className="flex items-center text-sm text-primary hover:text-primary-dark">
                    <FiEdit className="mr-1" /> Edit
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Username</h3>
                    <p className="text-gray-900">{user?.username || 'Not provided'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                    <p className="text-gray-900">{user?.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Name</h3>
                    <p className="text-gray-900">Not provided</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Phone</h3>
                    <p className="text-gray-900">Not provided</p>
                  </div>
                </div>

                <hr className="my-8" />

                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Security</h2>
                </div>

                <button
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Change Password
                </button>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">My Orders</h2>
                <div className="bg-gray-50 p-8 rounded-md text-center">
                  <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-600 mb-4">When you place orders, they will appear here.</p>
                  <button className="btn-primary">Start Shopping</button>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">My Addresses</h2>
                  <button className="btn-primary text-sm">Add New Address</button>
                </div>
                <div className="bg-gray-50 p-8 rounded-md text-center">
                  <FiMapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
                  <p className="text-gray-600">Add a shipping or billing address to your account.</p>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Payment Methods</h2>
                  <button className="btn-primary text-sm">Add Payment Method</button>
                </div>
                <div className="bg-gray-50 p-8 rounded-md text-center">
                  <FiCreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No payment methods saved</h3>
                  <p className="text-gray-600">Add a credit or debit card for faster checkout.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;