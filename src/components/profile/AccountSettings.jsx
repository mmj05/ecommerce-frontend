// src/components/profile/AccountSettings.jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FiMail, FiInfo } from 'react-icons/fi';
import { updateUserEmail } from '../../features/auth/authSlice';

const AccountSettings = ({ user, onMessage }) => {
  const dispatch = useDispatch();
  
  const [editingEmail, setEditingEmail] = useState(false);
  const [email, setEmail] = useState(user?.email || '');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Toggle email editing
  const toggleEmailEdit = () => {
    if (editingEmail) {
      // Cancel editing
      setEmail(user?.email || '');
      setEmailError('');
    }
    setEditingEmail(!editingEmail);
  };
  
  // Handle email change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError('');
  };
  
  // Validate email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Save updated email
  const handleSaveEmail = async () => {
    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    // Skip if no change
    if (email === user?.email) {
      setEditingEmail(false);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await dispatch(updateUserEmail({ email })).unwrap();
      onMessage('success', 'Email updated successfully');
      setEditingEmail(false);
    } catch (error) {
      onMessage('error', error.message || 'Failed to update email');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>
      
      <div className="space-y-8">
        {/* Email Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Email Address</h3>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-primary bg-opacity-10 p-2 rounded-full mr-3">
                  <FiMail className="text-primary" />
                </div>
                {editingEmail ? (
                  <div className="flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      className={`block w-full px-3 py-2 border ${
                        emailError ? 'border-red-500' : 'border-gray-300'
                      } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                      placeholder="Enter new email address"
                    />
                    {emailError && (
                      <p className="mt-1 text-sm text-red-500">{emailError}</p>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="font-medium text-gray-900">{user?.email}</p>
                    <p className="text-sm text-gray-500">Used for signing in and notifications</p>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3">
                {editingEmail ? (
                  <>
                    <button
                      onClick={handleSaveEmail}
                      disabled={isSubmitting}
                      className="btn-primary text-sm px-3 py-1"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="mr-1 inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          Saving...
                        </>
                      ) : (
                        'Save'
                      )}
                    </button>
                    <button
                      onClick={toggleEmailEdit}
                      disabled={isSubmitting}
                      className="btn-outline text-sm px-3 py-1"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={toggleEmailEdit}
                    className="btn-outline text-sm px-3 py-1"
                  >
                    Change Email
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {!editingEmail && (
            <div className="mt-3 p-3 bg-yellow-50 rounded-md flex items-start">
              <FiInfo className="text-yellow-500 mt-1 mr-2" />
              <p className="text-sm text-yellow-700">
                Changing your email will require you to verify the new email address.
                You may need to log in again after changing your email.
              </p>
            </div>
          )}
        </div>
        
        {/* Account Preferences */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Preferences</h3>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
            {/* Communication Preferences */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Communication Preferences</h4>
              
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    defaultChecked
                  />
                  <span className="ml-2 text-gray-700">Email notifications for orders</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    defaultChecked
                  />
                  <span className="ml-2 text-gray-700">Email notifications for promotions and deals</span>
                </label>
              </div>
            </div>
            
            {/* Language and Region */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Language and Region</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                    <option value="usd">USD ($)</option>
                    <option value="eur">EUR (€)</option>
                    <option value="gbp">GBP (£)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Privacy and Security */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy and Security</h3>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-gray-700 mb-4">
              Manage your account security settings and privacy preferences.
            </p>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Two-Factor Authentication</h4>
                <button className="btn-primary text-sm px-3 py-1">
                  Enable 2FA
                </button>
                <p className="mt-1 text-sm text-gray-500">
                  Add an extra layer of security to your account
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Privacy Controls</h4>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    defaultChecked
                  />
                  <span className="ml-2 text-gray-700">Allow ShopEasy to use my purchase history for personalized recommendations</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Account Actions */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h3>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <button className="text-red-600 hover:text-red-700 font-medium text-sm">
              Deactivate Account
            </button>
            <p className="mt-1 text-sm text-gray-500">
              Temporarily deactivate your account. You can reactivate at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;