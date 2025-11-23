"use client";
import React, { useState, useEffect } from 'react';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import useAuth from '@/hooks/useAuth';
import { 
  FaUser, 
  FaEnvelope, 
  FaCalendarAlt, 
  FaClock,
  FaGraduationCap,
  FaCheckCircle,
  FaEdit,
  FaCamera
} from 'react-icons/fa';
import { MdVerified, MdEmail, MdWork } from 'react-icons/md';

export default function Profile() {
  const axiosSecure = useAxiosSecure();
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!authUser?.email) return;

        const response = await axiosSecure.get(`/api/users?email=${authUser.email}`);
        if (response.data.users && response.data.users.length > 0) {
          setUser(response.data.users[0]);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [axiosSecure, authUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Profile Not Found</h3>
          <p className="text-gray-500">Unable to load user profile</p>
        </div>
      </div>
    );
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now - date;
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) return 'Today';
      if (diffInDays === 1) return 'Yesterday';
      if (diffInDays < 7) return `${diffInDays} days ago`;
      if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
      if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
      return `${Math.floor(diffInDays / 365)} years ago`;
    } catch {
      return 'N/A';
    }
  };

  const getRoleDisplay = (role) => {
    const roles = {
      teacher: { title: 'Teacher', color: 'bg-purple-100 text-purple-800', icon: <FaGraduationCap /> },
      student: { title: 'Student', color: 'bg-blue-100 text-blue-800', icon: <FaUser /> },
      admin: { title: 'Administrator', color: 'bg-red-100 text-red-800', icon: <MdWork /> },
      user: { title: 'User', color: 'bg-gray-100 text-gray-800', icon: <FaUser /> }
    };
    return roles[role] || roles.user;
  };

  const roleInfo = getRoleDisplay(user.role);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cover Photo Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-80 relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute bottom-4 right-4">
          <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-200 flex items-center gap-2">
            <FaCamera />
            <span className="hidden sm:inline">Edit Cover Photo</span>
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="max-w-6xl mx-auto px-4 -mt-32 relative">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Info Section */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row items-start lg:items-end gap-8">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-40 h-40 rounded-full border-4 border-white shadow-2xl bg-gray-200 overflow-hidden">
                  <img 
                    src={user.photoURL || '/default-avatar.png'} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                </div>
                <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-200 shadow-lg">
                  <FaCamera className="text-sm" />
                </button>
              </div>

              {/* User Information */}
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">
                        {user.name || 'User Name'}
                      </h1>
                      {user.isVerified && (
                        <MdVerified className="text-blue-500 text-2xl" />
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${roleInfo.color} flex items-center gap-2`}>
                        {roleInfo.icon}
                        {roleInfo.title}
                      </span>
                      
                      <span className="px-3 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800 flex items-center gap-2">
                        <FaCheckCircle />
                        {user.status?.charAt(0).toUpperCase() + user.status?.slice(1)}
                      </span>
                    </div>

                    <p className="text-gray-600 flex items-center gap-2 text-lg">
                      <MdEmail className="text-gray-400" />
                      {user.email}
                    </p>
                  </div>

                  
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 p-8">
            {/* Introduction Card */}
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Introduction</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <FaGraduationCap className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{roleInfo.title}</p>
                      <p className="text-gray-600 text-sm">Role at Learning Platform</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <FaCalendarAlt className="text-green-600 text-xl" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Joined {formatDate(user.createdAt)}</p>
                      <p className="text-gray-600 text-sm">
                        Member since {formatDateTime(user.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <FaClock className="text-purple-600 text-xl" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Last active {getTimeAgo(user.lastLogin)}</p>
                      <p className="text-gray-600 text-sm">
                        {formatDateTime(user.lastLogin)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <FaCalendarAlt className="text-orange-600 text-xl" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Profile Updated</p>
                      <p className="text-gray-600 text-sm">
                        {formatDateTime(user.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Timeline Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Timeline</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-full mt-1">
                      <FaCalendarAlt className="text-green-600 text-lg" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Account Created</p>
                      <p className="text-gray-600 text-sm mt-1">
                        {formatDateTime(user.createdAt)}
                      </p>
                      <p className="text-green-600 text-xs font-medium mt-1">
                        {getTimeAgo(user.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-full mt-1">
                      <FaClock className="text-blue-600 text-lg" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Last Login</p>
                      <p className="text-gray-600 text-sm mt-1">
                        {formatDateTime(user.lastLogin)}
                      </p>
                      <p className="text-blue-600 text-xs font-medium mt-1">
                        {getTimeAgo(user.lastLogin)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-3 rounded-full mt-1">
                      <FaEdit className="text-purple-600 text-lg" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Last Profile Update</p>
                      <p className="text-gray-600 text-sm mt-1">
                        {formatDateTime(user.updatedAt)}
                      </p>
                      <p className="text-purple-600 text-xs font-medium mt-1">
                        {getTimeAgo(user.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - About */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email Address</p>
                    <p className="font-medium text-gray-900">{user.email}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Account Status</p>
                    <p className="font-medium text-gray-900 capitalize">{user.status}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Account Type</p>
                    <p className="font-medium text-gray-900 capitalize">{user.role}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Verification Status</p>
                    <p className={`font-medium ${user.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                      {user.isVerified ? 'Verified' : 'Not Verified'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Authentication Provider</p>
                    <p className="font-medium text-gray-900 capitalize">{user.provider}</p>
                  </div>
                </div>
              </div>

              {/* Date Information Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Date Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Account Creation</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {formatDateTime(user.createdAt)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Last Login</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {formatDateTime(user.lastLogin)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Last Update</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {formatDateTime(user.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Platform Activity</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Days Since Join</span>
                    <span className="font-semibold text-gray-900">
                      {Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Account Age</span>
                    <span className="font-semibold text-gray-900">
                      {getTimeAgo(user.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Last Active</span>
                    <span className="font-semibold text-gray-900">
                      {getTimeAgo(user.lastLogin)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}