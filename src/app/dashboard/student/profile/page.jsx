
"use client";
import useAuth from '@/hooks/useAuth';
import React, { useState, useEffect } from 'react';

import { 
  FaUser, 
  FaEnvelope, 
  FaCalendarAlt, 
  FaClock,
  FaGraduationCap,
  FaCheckCircle,
  FaEdit,
  FaCamera,
  FaPhone,
  FaMapMarkerAlt,
  FaGlobe,
  FaBell,
  FaLock,
  FaBookOpen,
  FaCreditCard
} from 'react-icons/fa';
import { 
  MdVerified, 
  MdEmail, 
  MdWork,
  MdPerson,
  MdUpdate,
  MdDateRange,
  MdSecurity,
  MdSettings
} from 'react-icons/md';

// Utility functions
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

const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

export default function Profile() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!authUser?.email) return;

        const response = await fetch(`/api/users?email=${authUser.email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        
        const data = await response.json();
        if (data.users && data.users.length > 0) {
          setUser(data.users[0]);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [authUser]);

  const handleEditProfile = async () => {
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Add your update data here
          name: user?.name,
          phone: user?.phone,
          address: user?.address
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      if (data.success) {
        alert('Profile updated successfully');
        // You can refresh the user data here
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!user) {
    return <ProfileNotFound />;
  }

  const roleInfo = getRoleDisplay(user.role);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Cover Photo */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-64 relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/20 to-transparent h-20"></div>
        
        {/* User Profile Header */}
        <div className="max-w-7xl mx-auto px-4 relative h-full flex items-end pb-6">
          <div className="flex items-end gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-gray-100 overflow-hidden">
                <img 
                  src={user.photoURL || '/default-avatar.png'} 
                  alt={user.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/default-avatar.png';
                  }}
                />
              </div>
              <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg">
                <FaCamera className="text-sm" />
              </button>
            </div>

            {/* User Info */}
            <div className="text-white mb-2">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{user.name || 'User Name'}</h1>
                {user.isVerified && (
                  <MdVerified className="text-blue-300 text-2xl" />
                )}
              </div>
              <p className="text-blue-100 flex items-center gap-2">
                <MdEmail />
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 -mt-40 relative">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          
          {/* Profile Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto px-6">
              {[
                { id: 'overview', label: 'Overview', icon: <FaUser /> },
                { id: 'personal', label: 'Personal Info', icon: <MdPerson /> },
                { id: 'enrollments', label: 'Enrollments', icon: <FaBookOpen /> },
                { id: 'settings', label: 'Settings', icon: <MdSettings /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Main Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <FaCalendarAlt className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Member Since</p>
                          <p className="font-semibold text-gray-900">{formatDate(user.createdAt)}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{getTimeAgo(user.createdAt)}</p>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <FaClock className="text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Last Active</p>
                          <p className="font-semibold text-gray-900">{formatDateTime(user.lastLogin)}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{getTimeAgo(user.lastLogin)}</p>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <FaCheckCircle className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Account Status</p>
                          <p className={`font-semibold ${user.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                            {user.status}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {roleInfo.icon}
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">User Role</p>
                          <p className={`font-semibold ${roleInfo.color.split(' ')[1]}`}>
                            {roleInfo.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Timeline</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white border border-gray-200 rounded-lg">
                          <FaCalendarAlt className="text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Account Created</p>
                          <p className="text-sm text-gray-600">{formatDateTime(user.createdAt)}</p>
                          <p className="text-xs text-gray-500 mt-1">{getTimeAgo(user.createdAt)}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white border border-gray-200 rounded-lg">
                          <FaClock className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Last Login</p>
                          <p className="text-sm text-gray-600">{formatDateTime(user.lastLogin)}</p>
                          <p className="text-xs text-gray-500 mt-1">{getTimeAgo(user.lastLogin)}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white border border-gray-200 rounded-lg">
                          <MdUpdate className="text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Last Update</p>
                          <p className="text-sm text-gray-600">{formatDateTime(user.updatedAt)}</p>
                          <p className="text-xs text-gray-500 mt-1">{getTimeAgo(user.updatedAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Account Info Card */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MdSecurity />
                      Account Information
                    </h3>
                    <div className="space-y-3">
                      <InfoRow label="Email" value={user.email} />
                      <InfoRow 
                        label="Status" 
                        value={user.status} 
                        badgeColor={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} 
                      />
                      <InfoRow 
                        label="Role" 
                        value={user.role} 
                        badgeColor={roleInfo.color} 
                      />
                      <InfoRow 
                        label="Verified" 
                        value={user.isVerified ? 'Yes' : 'No'} 
                        badgeColor={user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} 
                      />
                      <InfoRow label="Provider" value={user.provider} />
                    </div>
                  </div>

                  {/* Preferences Card */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FaGlobe />
                      Preferences
                    </h3>
                    <div className="space-y-3">
                      <InfoRow label="Language" value={user.preferences?.language || 'English'} />
                      <InfoRow label="Theme" value={user.preferences?.theme || 'Light'} />
                      <InfoRow 
                        label="Notifications" 
                        value={user.preferences?.notifications ? 'On' : 'Off'} 
                        badgeColor={user.preferences?.notifications ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'personal' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Details */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h3>
                  <div className="space-y-4">
                    <DetailItem icon={<FaUser />} label="Full Name" value={user.name || 'Not set'} />
                    <DetailItem icon={<MdEmail />} label="Email Address" value={user.email} />
                    <DetailItem icon={<FaPhone />} label="Phone Number" value={user.phone || 'Not set'} />
                    <DetailItem icon={<FaMapMarkerAlt />} label="Address" value={user.address || 'Not set'} />
                  </div>
                  <button 
                    onClick={handleEditProfile}
                    className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaEdit />
                    Edit Personal Information
                  </button>
                </div>

                {/* Account Details */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
                  <div className="space-y-4">
                    <DetailItem 
                      icon={<MdDateRange />} 
                      label="Created Date" 
                      value={formatDateTime(user.createdAt)} 
                    />
                    <DetailItem 
                      icon={<FaClock />} 
                      label="Last Login" 
                      value={formatDateTime(user.lastLogin)} 
                    />
                    <DetailItem 
                      icon={<MdUpdate />} 
                      label="Last Updated" 
                      value={formatDateTime(user.updatedAt)} 
                    />
                    <DetailItem 
                      icon={<FaGlobe />} 
                      label="Authentication" 
                      value={user.provider} 
                    />
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <button className="w-full py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                      Change Password
                    </button>
                    <button className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Download Data
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'enrollments' && (
              <EnrollmentsTab user={user} />
            )}

            {activeTab === 'settings' && (
              <SettingsTab user={user} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== SMALL COMPONENTS ==========

function InfoRow({ label, value, badgeColor }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      {badgeColor ? (
        <span className={`px-2 py-1 text-xs rounded ${badgeColor}`}>
          {value}
        </span>
      ) : (
        <span className="font-medium text-gray-900">{value}</span>
      )}
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
      <div className="p-2 bg-gray-100 rounded-lg">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function EnrollmentsTab({ user }) {
  const enrollments = user.enrolledCourses || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">My Enrollments</h3>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          {enrollments.length} courses
        </span>
      </div>

      {enrollments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <FaBookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-700 mb-2">No Enrollments Yet</h4>
          <p className="text-gray-500 mb-6">You haven't enrolled in any courses</p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Browse Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enrollments.map((course, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900 line-clamp-1">{course.courseTitle}</h4>
                  <p className="text-sm text-gray-600 mt-1">By {course.courseInstructor}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  Enrolled
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <FaCalendarAlt className="w-4 h-4" />
                  <span>{formatDate(course.enrolledAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaCreditCard className="w-4 h-4" />
                  <span>৳{course.coursePrice}</span>
                </div>
                <div className="col-span-2 text-xs text-gray-500 truncate">
                  Transaction: {course.transactionId}
                </div>
              </div>
              
              <button className="mt-4 w-full py-2 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                View Course Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsTab({ user }) {
  const [preferences, setPreferences] = useState({
    language: user.preferences?.language || 'en',
    theme: user.preferences?.theme || 'light',
    notifications: user.preferences?.notifications !== false
  });

  const handleSaveSettings = async () => {
    try {
      const response = await fetch('/api/users/profile/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences)
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      const data = await response.json();
      if (data.success) {
        alert('Settings saved successfully');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Settings</h3>
        <div className="space-y-4">
          <ToggleSetting
            icon={<FaBell />}
            label="Email Notifications"
            description="Receive email updates about courses and announcements"
            checked={preferences.notifications}
            onChange={(checked) => setPreferences(prev => ({ ...prev, notifications: checked }))}
          />
          <ToggleSetting
            icon={<FaBell />}
            label="Course Updates"
            description="Get notified about new content in enrolled courses"
            checked={true}
            onChange={() => {}}
          />
          <ToggleSetting
            icon={<FaBell />}
            label="Promotional Emails"
            description="Receive updates about new courses and offers"
            checked={false}
            onChange={() => {}}
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Appearance</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme Preference
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setPreferences(prev => ({ ...prev, theme: 'light' }))}
                className={`flex-1 p-4 border rounded-lg flex flex-col items-center gap-2 ${
                  preferences.theme === 'light'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="w-8 h-8 bg-yellow-400 rounded-full"></div>
                <span>Light</span>
              </button>
              <button
                onClick={() => setPreferences(prev => ({ ...prev, theme: 'dark' }))}
                className={`flex-1 p-4 border rounded-lg flex flex-col items-center gap-2 ${
                  preferences.theme === 'dark'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="w-8 h-8 bg-gray-800 rounded-full"></div>
                <span>Dark</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={preferences.language}
              onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="en">English</option>
              <option value="bn">বাংলা</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
        <p className="text-red-700 mb-4">These actions are irreversible. Please proceed with caution.</p>
        <div className="space-y-3">
          <button 
            onClick={async () => {
              if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                try {
                  const response = await fetch('/api/users/profile', {
                    method: 'DELETE'
                  });
                  
                  if (response.ok) {
                    alert('Account deleted successfully');
                    window.location.href = '/';
                  }
                } catch (error) {
                  console.error('Error deleting account:', error);
                  alert('Failed to delete account');
                }
              }
            }}
            className="w-full py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
          >
            Delete Account Permanently
          </button>
          <button className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Request Data Export
          </button>
        </div>
      </div>

      <button 
        onClick={handleSaveSettings}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Save All Changes
      </button>
    </div>
  );
}

function ToggleSetting({ icon, label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white rounded-lg">
          {icon}
        </div>
        <div>
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );
}

// ========== STATES ==========

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-64 animate-pulse"></div>
      <div className="max-w-7xl mx-auto px-4 -mt-40 relative">
        <div className="animate-pulse space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-end gap-6 mb-8">
              <div className="w-32 h-32 bg-gray-300 rounded-full"></div>
              <div className="h-8 bg-gray-300 rounded w-64 mb-4"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-48 bg-gray-200 rounded-xl"></div>
                <div className="h-48 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaUser className="w-12 h-12 text-red-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Profile Not Found</h3>
        <p className="text-gray-600 mb-8">
          We couldn't find your profile information. Please try logging in again or contact support.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}