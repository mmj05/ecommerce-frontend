import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiEdit, FiSave, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { updateUserProfile, clearUpdateStatus, clearProfileError } from '../../features/user/userProfileSlice';

const PersonalInfo = ({ profile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [formErrors, setFormErrors] = useState({});
  
  const dispatch = useDispatch();
  const { isLoading, error, updateSuccess } = useSelector((state) => state.userProfile);
  
  // Reset form with profile data when profile changes or editing mode toggles
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        email: profile.email || '',
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || ''
      });
    }
  }, [profile, isEditing]);
  
  // Clear success/error states when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearUpdateStatus());
      dispatch(clearProfileError());
    };
  }, [dispatch]);
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear specific field error when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };
  
  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    
    if (!formData.username) {
      errors.username = 'Username is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await dispatch(updateUserProfile(formData)).unwrap();
        setIsEditing(false);
      } catch (err) {
        console.error('Failed to update profile:', err);
      }
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center text-sm text-primary hover:text-primary-dark"
          >
            <FiEdit className="mr-1" /> Edit
          </button>
        ) : (
          <button 
            onClick={() => setIsEditing(false)}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <FiX className="mr-1" /> Cancel
          </button>
        )}
      </div>
      
      {/* Success message */}
      {updateSuccess && (
        <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <div className="flex items-center">
            <FiCheck className="text-green-500 mr-3" />
            <p className="text-green-700">Profile updated successfully!</p>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center">
            <FiAlertCircle className="text-red-500 mr-3" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full p-2 border ${
                  formErrors.username ? 'border-red-500' : 'border-gray-300'
                } rounded focus:outline-none focus:ring-primary focus:border-primary`}
              />
              {formErrors.username && (
                <p className="mt-1 text-sm text-red-500">{formErrors.username}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-2 border ${
                  formErrors.email ? 'border-red-500' : 'border-gray-300'
                } rounded focus:outline-none focus:ring-primary focus:border-primary`}
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : (
                <>
                  <FiSave className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Username</h3>
            <p className="text-gray-900">{profile?.username || 'Not provided'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
            <p className="text-gray-900">{profile?.email || 'Not provided'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">First Name</h3>
            <p className="text-gray-900">{profile?.firstName || 'Not provided'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Last Name</h3>
            <p className="text-gray-900">{profile?.lastName || 'Not provided'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Phone</h3>
            <p className="text-gray-900">{profile?.phone || 'Not provided'}</p>
          </div>
        </div>
      )}
      
      <hr className="my-8" />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Security</h2>
      </div>
      
      <ChangePasswordForm />
    </div>
  );
};

const ChangePasswordForm = () => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  
  const dispatch = useDispatch();
  const { isLoading, error, updateSuccess } = useSelector((state) => state.userProfile);
  
  // Reset form when toggling mode
  useEffect(() => {
    if (!isChangingPassword) {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setFormErrors({});
    }
  }, [isChangingPassword]);
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    
    // Clear field error when typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };
  
  // Validate password form
  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle password change submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (validatePasswordForm()) {
      try {
        await dispatch(changePassword({
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })).unwrap();
        
        // Reset form and toggle mode on success
        setIsChangingPassword(false);
      } catch (err) {
        console.error('Failed to change password:', err);
      }
    }
  };
  
  return (
    <div>
      {!isChangingPassword ? (
        <button
          onClick={() => setIsChangingPassword(true)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Change Password
        </button>
      ) : (
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {/* Success message */}
          {updateSuccess && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <div className="flex items-center">
                <FiCheck className="text-green-500 mr-3" />
                <p className="text-green-700">Password changed successfully!</p>
              </div>
            </div>
          )}
          
          {/* Error message */}
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex items-center">
                <FiAlertCircle className="text-red-500 mr-3" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handleChange}
              className={`w-full p-2 border ${
                formErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
              } rounded focus:outline-none focus:ring-primary focus:border-primary`}
            />
            {formErrors.currentPassword && (
              <p className="mt-1 text-sm text-red-500">{formErrors.currentPassword}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handleChange}
              className={`w-full p-2 border ${
                formErrors.newPassword ? 'border-red-500' : 'border-gray-300'
              } rounded focus:outline-none focus:ring-primary focus:border-primary`}
            />
            {formErrors.newPassword && (
              <p className="mt-1 text-sm text-red-500">{formErrors.newPassword}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handleChange}
              className={`w-full p-2 border ${
                formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              } rounded focus:outline-none focus:ring-primary focus:border-primary`}
            />
            {formErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{formErrors.confirmPassword}</p>
            )}
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50"
            >
              {isLoading ? 'Changing...' : 'Change Password'}
            </button>
            
            <button
              type="button"
              onClick={() => setIsChangingPassword(false)}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PersonalInfo;