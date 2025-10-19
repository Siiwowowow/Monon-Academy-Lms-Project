'use client'
import React, { useEffect, useState } from 'react'
import { Tiro_Bangla } from 'next/font/google'
import { 
  FaUser,
  FaEdit,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaBook,
  FaStar,
  FaUsers,
  FaCertificate,
  FaShare,
  FaEnvelope,
  FaPhone,
  FaClock,
  FaCrown,
  FaCalendarAlt,
  FaShield
} from 'react-icons/fa'
import useAxiosSecure from '@/hooks/useAxiosSecure'
import useAuth from '@/hooks/useAuth'

const tiroBangla = Tiro_Bangla({
  weight: ["400"],
  subsets: ["bengali"],
})

export default function Profile() {
  const axiosInstance = useAxiosSecure()
  const { user: authUser } = useAuth()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCurrentUserProfile = async () => {    
      try {
        // Get current logged-in user's data
        const response = await axiosInstance.get('/api/users/me'); 
        setUserData(response.data.user)
        console.log('Current User Profile Data:', response.data);
      } catch (error) {
        console.error('Error fetching current user profile:', error);
        // If API fails, use auth user data
        if (authUser) {
          setUserData({
            name: authUser.displayName || authUser.email?.split('@')[0] || 'ব্যবহারকারী',
            email: authUser.email,
            photoURL: authUser.photoURL,
            provider: authUser.providerData?.[0]?.providerId || 'credentials',
            role: 'user',
            isVerified: authUser.emailVerified || false,
            status: 'active',
            phone: null,
            address: null,
            preferences: {
              language: 'en',
              theme: 'light',
              notifications: true,
            },
            createdAt: authUser.metadata?.creationTime || new Date().toISOString(),
            updatedAt: authUser.metadata?.lastSignInTime || new Date().toISOString(),
            lastLogin: authUser.metadata?.lastSignInTime || new Date().toISOString(),
            stats: {
              coursesCompleted: 12,
              rating: "৪.৮/৫",
              followers: "২.৫K",
              certificates: 8
            }
          })
        }
      } finally {
        setLoading(false)
      }
    };
    
    if (authUser) {
      fetchCurrentUserProfile();
    } else {
      setLoading(false)
    }
  }, [axiosInstance, authUser])

  // Format date to Bengali readable format
  const formatDateToBengali = (dateString) => {
    if (!dateString) return 'অজানা';
    
    try {
      const date = new Date(dateString);
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return date.toLocaleDateString('bn-BD', options);
    } catch (error) {
      return 'অজানা';
    }
  }

  // User stats data
  const userStats = [
    { label: "কোর্স সম্পন্ন", value: userData?.stats?.coursesCompleted || "১২", icon: FaBook },
    { label: "রেটিং", value: userData?.stats?.rating || "৪.৮/৫", icon: FaStar },
    { label: "অনুসরণকারী", value: userData?.stats?.followers || "২.৫K", icon: FaUsers },
    { label: "সার্টিফিকেট", value: userData?.stats?.certificates || "৮", icon: FaCertificate }
  ]

  // Enrolled courses data
  const enrolledCourses = [
    { name: "এসএসসি গণিত প্রস্তুতি", progress: 85 },
    { name: "ইংরেজি গ্রামার মাস্টারি", progress: 60 },
    { name: "পদার্থবিজ্ঞান ফান্ডামেন্টাল", progress: 45 }
  ]

  if (loading) {
    return (
      <div className={`${tiroBangla.className} min-h-screen bg-gradient-to-br from-[#F9F5F0] to-white py-8 px-4 flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#3396D3] mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">প্রোফাইল লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className={`${tiroBangla.className} min-h-screen bg-gradient-to-br from-[#F9F5F0] to-white py-8 px-4 flex items-center justify-center`}>
        <div className="text-center">
          <p className="text-gray-700 text-lg">দুঃখিত, আপনার প্রোফাইল ডেটা লোড করতে সমস্যা হচ্ছে</p>
          <p className="text-gray-500 mt-2">দয়া করে লগইন করুন বা পুনরায় চেষ্টা করুন</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${tiroBangla.className} min-h-screen bg-gradient-to-br from-[#F9F5F0] to-white py-8 px-4`}>
      <div className="max-w-4xl mx-auto">
        
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 border border-gray-200">
          {/* Cover Photo */}
          <div className="h-32 bg-gradient-to-r from-[#3396D3] to-[#A8FBD3] relative">
            <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-white transition-all border border-gray-300">
              <FaEdit className="inline mr-2" />
              কভার ফটো পরিবর্তন
            </button>
          </div>
          
          {/* Profile Info */}
          <div className="px-6 pb-6 -mt-12 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-lg">
                  {userData?.photoURL ? (
                    <img 
                      src={userData.photoURL} 
                      alt={userData.name}
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full rounded-full bg-gradient-to-br from-[#3396D3] to-[#A8FBD3] flex items-center justify-center ${userData?.photoURL ? 'hidden' : 'flex'}`}>
                    <FaUser className="text-white text-2xl" />
                  </div>
                </div>
                <button className="absolute bottom-1 right-1 bg-[#3396D3] text-white p-1 rounded-full hover:bg-[#2A7BB9] transition-colors border border-white shadow-sm">
                  <FaEdit className="text-xs" />
                </button>
              </div>

              {/* User Details */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">{userData?.name || 'ব্যবহারকারী'}</h1>
                    <p className="text-gray-600">
                      {userData?.role === 'admin' ? 'অ্যাডমিন' : 'শিক্ষার্থী'}, মনন একাডেমি
                      {userData?.provider === 'google' && (
                        <span className="ml-2 text-green-500 text-sm">● গুগল অ্যাকাউন্ট</span>
                      )}
                    </p>
                    
                    {/* Role and Time Info */}
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FaCrown className={`${userData?.role === 'admin' ? 'text-yellow-500' : 'text-[#3396D3]'}`} />
                        <span>রোল: {userData?.role === 'admin' ? 'অ্যাডমিন' : 'শিক্ষার্থী'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaClock className="text-green-500" />
                        <span>শেষ লগইন: {formatDateToBengali(userData?.lastLogin)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt className="text-purple-500" />
                        <span>একাউন্ট তৈরি: {formatDateToBengali(userData?.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-center sm:justify-start">
                    <button className="bg-[#3396D3] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#2A7BB9] transition-colors flex items-center gap-2 shadow-sm">
                      <FaEdit className="text-sm" />
                      এডিট প্রোফাইল
                    </button>
                    <button className="border border-[#3396D3] text-[#3396D3] px-4 py-2 rounded-full font-semibold hover:bg-[#3396D3] hover:text-white transition-colors flex items-center gap-2">
                      <FaShare className="text-sm" />
                      শেয়ার
                    </button>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 justify-center sm:justify-start">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#3396D3]" />
                    <span>{userData?.address || 'ঢাকা, বাংলাদেশ'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaGraduationCap className="text-[#3396D3]" />
                    <span>ইনস্টিটিউট: মনন একাডেমি</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-[#3396D3]" />
                    <span>{userData?.email || 'email@example.com'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-[#3396D3]" />
                    <span>{userData?.phone || '+৮৮০ XXX-XXXXXX'}</span>
                  </div>
                  {userData?.isVerified && (
                    <div className="flex items-center gap-2">
                      
                      <span className="text-green-500">ভেরিফাইড অ্যাকাউন্ট</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">প্রোফাইল স্ট্যাটস</h3>
              <div className="grid grid-cols-2 gap-4">
                {userStats.map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-[#F9F5F0] rounded-xl hover:bg-[#3396D3] hover:text-white transition-all group cursor-pointer border border-gray-100">
                    <div className="flex justify-center mb-2">
                      <div className="p-3 rounded-full bg-[#3396D3] text-white group-hover:bg-white group-hover:text-[#3396D3] transition-colors">
                        <stat.icon />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 group-hover:text-white">{stat.value}</div>
                    <div className="text-sm text-gray-600 group-hover:text-white/90 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">অর্জনসমূহ</h3>
              <div className="space-y-3">
                {[
                  { name: "গোল্ড মেম্বার", color: "bg-yellow-500" },
                  { name: "কুইজ মাস্টার", color: "bg-purple-500" },
                  { name: "নিয়মিত শিক্ষার্থী", color: "bg-green-500" },
                  { name: "টপ পারফর্মার", color: "bg-red-500" }
                ].map((badge, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-[#F9F5F0] rounded-lg hover:bg-[#3396D3] hover:text-white transition-all group border border-gray-100">
                    <div className={`w-8 h-8 rounded-full ${badge.color} flex items-center justify-center text-white text-xs font-bold`}>
                      {badge.name.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-white text-sm">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Courses & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enrolled Courses */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">এনরোল্ড কোর্সসমূহ</h3>
                <button className="text-[#3396D3] hover:text-[#2A7BB9] font-semibold">
                  সকল দেখুন
                </button>
              </div>
              <div className="space-y-4">
                {enrolledCourses.map((course, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 hover:border-[#3396D3] transition-colors group bg-[#F9F5F0]/50">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-gray-800 group-hover:text-[#3396D3]">{course.name}</h4>
                      <span className="text-sm text-[#3396D3] font-semibold">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-[#3396D3] to-[#A8FBD3] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">সাম্প্রতিক এক্টিভিটি</h3>
              <div className="space-y-4">
                {[
                  { action: "কুইজ সম্পন্ন", course: "এসএসসি গণিত", time: "২ ঘন্টা আগে", score: "৯৫%" },
                  { action: "লেকচার দেখেছেন", course: "ইংরেজি গ্রামার", time: "১ দিন আগে", duration: "৪৫ মিনিট" },
                  { action: "অ্যাসাইনমেন্ট জমা", course: "পদার্থবিজ্ঞান", time: "২ দিন আগে", status: "রিভিউPending" }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 bg-[#F9F5F0] rounded-lg hover:bg-[#3396D3] hover:text-white transition-all group border border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-[#3396D3] flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#3396D3]">
                      <FaBook className="text-sm" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-700 group-hover:text-white text-sm">{activity.action}</p>
                          <p className="text-xs text-gray-600 group-hover:text-white/80">{activity.course}</p>
                        </div>
                        <span className="text-xs text-gray-500 group-hover:text-white/70">{activity.time}</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-xs bg-white text-[#3396D3] px-2 py-1 rounded-full group-hover:bg-white/20 group-hover:text-white border border-gray-200">
                          {activity.score || activity.duration || activity.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}