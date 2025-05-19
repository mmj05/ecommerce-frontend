// src/components/profile/ProfileInfo.jsx
import { useState } from 'react';
import { FiUser, FiMail, FiCalendar } from 'react-icons/fi';

const ProfileInfo = ({ user, onMessage }) => {
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

  const joinDate = user?.createdAt 
    ? formatDate(user.createdAt) 
    : 'N/A';

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Overview</h2>
      
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="w-24 h-24 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
            <FiUser className="w-10 h-10 text-primary" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{user?.username}</h3>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center mb-3">
              <FiUser className="text-gray-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-500">Username</h4>
            </div>
            <p className="text-gray-900 font-medium">{user?.username}</p>
          </div>
          
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center mb-3">
              <FiMail className="text-gray-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-500">Email</h4>
            </div>
            <p className="text-gray-900 font-medium">{user?.email}</p>
          </div>
          
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center mb-3">
              <FiCalendar className="text-gray-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-500">Member Since</h4>
            </div>
            <p className="text-gray-900 font-medium">{joinDate}</p>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg mt-6">
          <h3 className="text-blue-800 font-medium mb-2">Account Information</h3>
          <p className="text-blue-700 text-sm">
            You can update your email address in the Account Settings tab and change your password in the Change Password tab.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;