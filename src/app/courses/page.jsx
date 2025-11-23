'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollmentLoading, setEnrollmentLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [group, setGroup] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  
  const { user } = useAuth();
  const router = useRouter();
  const currentUserEmail = user?.email;

  // Color schemes for different course types
  const courseTypeColors = {
    free: {
      badge: 'bg-green-100 text-green-800 border-green-200',
      price: 'text-green-600',
      button: 'bg-green-600 hover:bg-green-700 text-white',
      icon: 'text-green-500',
      gradient: 'from-green-400 to-green-600',
      tag: 'ফ্রি'
    },
    discounted: {
      badge: 'bg-red-100 text-red-800 border-red-200',
      price: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700 text-white',
      icon: 'text-red-500',
      gradient: 'from-red-400 to-red-600',
      tag: 'ডিসকাউন্ট'
    },
    premium: {
      badge: 'bg-purple-100 text-purple-800 border-purple-200',
      price: 'text-purple-600',
      button: 'bg-purple-600 hover:bg-purple-700 text-white',
      icon: 'text-purple-500',
      gradient: 'from-purple-400 to-purple-600',
      tag: 'প্রিমিয়াম'
    },
    popular: {
      badge: 'bg-orange-100 text-orange-800 border-orange-200',
      price: 'text-orange-600',
      button: 'bg-orange-600 hover:bg-orange-700 text-white',
      icon: 'text-orange-500',
      gradient: 'from-orange-400 to-orange-600',
      tag: 'জনপ্রিয়'
    },
    new: {
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
      price: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      icon: 'text-blue-500',
      gradient: 'from-blue-400 to-blue-600',
      tag: 'নতুন'
    },
    // ENROLLED COURSE STYLING
    enrolled: {
      badge: 'bg-green-100 text-green-800 border-green-200',
      price: 'text-green-600',
      button: 'bg-green-500 hover:bg-green-600 text-white',
      icon: 'text-green-500',
      gradient: 'from-green-400 to-green-600',
      tag: 'এনরোল্ড',
      card: 'border-green-200 hover:border-green-300',
      status: 'bg-green-100 text-green-800'
    }
  };

  // Group colors
  const groupColors = {
    'বিজ্ঞান': 'bg-blue-50 text-blue-700 border-blue-200',
    'মানবিক': 'bg-green-50 text-green-700 border-green-200',
    'ব্যবসায় শিক্ষা': 'bg-purple-50 text-purple-700 border-purple-200',
    'default': 'bg-gray-50 text-gray-700 border-gray-200'
  };

  // Fetch enrolled courses for current user
  const fetchEnrolledCourses = useCallback(async () => {
    if (!currentUserEmail) {
      setEnrollmentLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/user-courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail: currentUserEmail }),
      });

      if (response.ok) {
        const data = await response.json();
        // Extract course IDs from enrolled courses
        const enrolledIds = data.courses?.map(course => course.courseId || course._id) || [];
        setEnrolledCourseIds(enrolledIds);
      }
    } catch (err) {
      console.error('Error fetching enrolled courses:', err);
    } finally {
      setEnrollmentLoading(false);
    }
  }, [currentUserEmail]);

  // Determine course type
  const getCourseType = (course) => {
    // First check if course is enrolled
    if (enrolledCourseIds.includes(course._id)) {
      return 'enrolled';
    }
    if (course.price === 0) return 'free';
    if (course.original_price > course.price) return 'discounted';
    if (course.is_popular) return 'popular';
    if (course.is_new) return 'new';
    return 'premium';
  };

  // Fetch courses from API
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(search && { search }),
        ...(group && { group })
      });

      const response = await fetch(`/api/courses?${params}`);
      const data = await response.json();

      if (data.success) {
        setCourses(data.data);
        setTotalPages(data.totalPages);
        setTotalCourses(data.total);
      } else {
        setError('Failed to fetch courses');
      }
    } catch (err) {
      setError('Error fetching courses');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, group]);

  // Debounced search
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
      setPage(1);
    }, 500),
    []
  );

  useEffect(() => {
    fetchEnrolledCourses();
  }, [fetchEnrolledCourses]);

  useEffect(() => {
    if (!enrollmentLoading) {
      fetchCourses();
    }
  }, [fetchCourses, enrollmentLoading]);

  // Handle search input change with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    debouncedSearch(value);
  };

  // Handle group filter
  const handleGroupChange = (e) => {
    setGroup(e.target.value);
    setPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch('');
    setGroup('');
    setPage(1);
    setShowFilters(false);
  };

  const handleCardClick = (courseId, isEnrolled) => {
    if (isEnrolled) {
      router.push(`/dashboard/user/enroll`);
    } else {
      router.push(`/courses/${courseId}`);
    }
  };

  // Course card component
  const CourseCard = ({ course }) => {
    const isEnrolled = enrolledCourseIds.includes(course._id);
    const courseType = getCourseType(course);
    const colors = courseTypeColors[courseType];
    const groupColor = groupColors[course.group] || groupColors.default;
    const discountPercentage = course.original_price > course.price 
      ? Math.round(((course.original_price - course.price) / course.original_price) * 100)
      : 0;

    // Default image if not available
    const defaultImages = {
      'বিজ্ঞান': '/api/placeholder/320/180?text=বিজ্ঞান',
      'মানবিক': '/api/placeholder/320/180?text=মানবিক',
      'ব্যবসায় শিক্ষা': '/api/placeholder/320/180?text=ব্যবসায়+শিক্ষা',
      'default': '/api/placeholder/320/180?text=কোর্স'
    };

    const imageUrl = course.thumbnail_url || defaultImages[course.group] || defaultImages.default;

    return (
      <div 
        className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border ${
          isEnrolled ? 'border-green-200 hover:border-green-300' : 'border-gray-200'
        } overflow-hidden flex flex-col h-full cursor-pointer`}
        onClick={() => handleCardClick(course._id, isEnrolled)}
      >
        {/* Image Container with consistent aspect ratio */}
        <div className="relative w-full pt-[56.25%] bg-gray-100 overflow-hidden">
          <img 
            className="absolute inset-0 p-1 rounded-xl w-full h-full object-cover"
            src={imageUrl}
            alt={course.title}
            onError={(e) => {
              e.target.src = defaultImages.default;
            }}
          />
          
          {/* Course Type Badge */}
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold border ${colors.badge}`}>
            {colors.tag}
          </div>

          {/* Enrolled Status Badge */}
          {isEnrolled && (
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold border bg-green-100 text-green-800 border-green-200">
              ✓ সম্পূর্ণ
            </div>
          )}

          {/* Discount Badge */}
          {!isEnrolled && discountPercentage > 0 && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-600 text-white px-2 py-1 rounded text-xs font-bold">
              {discountPercentage}% OFF
            </div>
          )}

          {/* Free Course Ribbon */}
          {!isEnrolled && courseType === 'free' && (
            <div className="absolute top-10 left-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
              সম্পূর্ণ ফ্রি
            </div>
          )}
        </div>

        {/* Card Content - Consistent height */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Group and Class */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${groupColor}`}>
              {course.group}
            </span>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs font-medium border border-gray-200">
              ক্লাস {course.class}
            </span>
          </div>

          {/* Title - Fixed height with line clamp */}
          <h3 className="text-gray-900 font-bold text-lg mb-2 line-clamp-2 leading-tight min-h-[56px] flex items-start">
            {course.title}
          </h3>

          {/* Instructor */}
          <div className="flex items-center mb-3">
            <svg className={`w-4 h-4 mr-2 ${colors.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-gray-600 text-sm font-medium truncate">
              {course.instructor_name}
            </span>
          </div>

          {/* Description - Fixed height */}
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4 flex-1 min-h-[60px]">
            {course.short_description || course.full_description || 'কোর্সের বিস্তারিত জানতে বিস্তারিত দেখুন ক্লিক করুন।'}
          </p>

          {/* Stats */}
          <div className={`flex items-center justify-between mb-4 rounded-lg p-3 ${
            isEnrolled ? 'bg-green-50 border border-green-100' : 'bg-gray-50'
          }`}>
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span className="text-gray-700 text-sm font-semibold">{course.rating || '৪.৫'}</span>
            </div>

            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
              <span className="text-gray-700 text-sm font-semibold">{course.total_videos || '১২'} ভিডিও</span>
            </div>

            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
              <span className="text-gray-700 text-sm font-semibold">{course.language || 'বাংলা'}</span>
            </div>
          </div>

          {/* Price and Action */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center space-x-2">
              {!isEnrolled && course.original_price > course.price && (
                <span className="text-gray-400 text-sm line-through font-medium">
                  ৳{course.original_price}
                </span>
              )}
              <span className={`text-lg font-bold ${colors.price}`}>
                {isEnrolled ? 'পেইড' : course.price === 0 ? 'ফ্রি' : `৳${course.price}`}
              </span>
            </div>
            
            {isEnrolled ? (
              <button 
                className={`${colors.button} py-2 px-4 rounded-lg font-semibold transition-all duration-200 text-sm flex items-center space-x-1`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
                <span>সম্পন্ন</span>
              </button>
            ) : (
              <Link 
                href={`/courses/${course._id}`}
                className={`${colors.button} py-2 px-4 rounded-lg font-semibold transition-all duration-200 text-sm flex items-center space-x-1`}
                onClick={(e) => e.stopPropagation()}
              >
                <span>বিস্তারিত</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full animate-pulse">
      <div className="w-full pt-[56.25%] bg-gray-300 relative"></div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex gap-2 mb-3">
          <div className="h-6 bg-gray-300 rounded-lg w-20"></div>
          <div className="h-6 bg-gray-300 rounded-lg w-16"></div>
        </div>
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
        <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-2/3 mb-4"></div>
        <div className="flex justify-between mb-4 bg-gray-200 rounded-lg p-3">
          <div className="h-4 bg-gray-300 rounded w-16"></div>
          <div className="h-4 bg-gray-300 rounded w-20"></div>
          <div className="h-4 bg-gray-300 rounded w-12"></div>
        </div>
        <div className="flex justify-between items-center mt-auto">
          <div className="h-6 bg-gray-300 rounded w-20"></div>
          <div className="h-8 bg-gray-300 rounded w-20"></div>
        </div>
      </div>
    </div>
  );

  // Pagination component
  const Pagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-sm ${
            page === i
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12">
        <div className="text-gray-600 text-sm">
          পৃষ্ঠা {page} এর {totalPages}, মোট {totalCourses} কোর্স
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200 flex items-center space-x-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            <span className="hidden sm:inline">পূর্ববর্তী</span>
          </button>
          
          <div className="flex items-center space-x-1">
            {pages}
          </div>
          
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200 flex items-center space-x-2 text-sm"
          >
            <span className="hidden sm:inline">পরবর্তী</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full relative">
      {/* Soft Pastel Dream Gradient Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(135deg, #F8BBD9 0%, #FDD5B4 25%, #FFF2CC 50%, #E1F5FE 75%, #BBDEFB 100%)`,
        }}
      />
      
      <div className="relative z-10 py-6">
        <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-block bg-white/80 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-sm font-semibold mb-3 shadow-sm border border-white/20">
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z"/>
              </svg>
              মানসম্মত শিক্ষা
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              আমাদের কোর্সসমূহ
            </h1>
            <p className="text-gray-700 text-sm sm:text-lg max-w-2xl mx-auto px-4">
              বিভিন্ন বিষয়ের উপর উচ্চমানের শিক্ষা materials এবং এক্সপার্ট গাইডেন্স
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8 sm:mb-12">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full bg-white border border-gray-300 rounded-lg p-3 font-semibold text-gray-700 flex items-center justify-between"
              >
                <span>ফিল্টার এবং অনুসন্ধান</span>
                <svg className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
            </div>

            {/* Filter and Search Content */}
            <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                {/* Search Bar */}
                <div className="mb-4 sm:mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    কোর্স বা ইনস্ট্রাক্টর অনুসন্ধান করুন
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="যেমন: পদার্থবিজ্ঞান, গণিত, ড. আহমেদ হোসেন..."
                      onChange={handleSearchChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      গ্রুপ নির্বাচন করুন
                    </label>
                    <select
                      value={group}
                      onChange={handleGroupChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
                    >
                      <option value="">সকল গ্রুপ</option>
                      <option value="বিজ্ঞান">বিজ্ঞান</option>
                      <option value="মানবিক">মানবিক</option>
                      <option value="ব্যবসায় শিক্ষা">ব্যবসায় শিক্ষা</option>
                    </select>
                  </div>

                  {/* Results and Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                      <div className="text-blue-700 text-sm font-semibold">
                        মোট <span className="text-blue-800">{totalCourses}</span>টি কোর্স
                      </div>
                    </div>
                    
                    {(search || group) && (
                      <button
                        onClick={clearFilters}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                        </svg>
                        <span>ফিল্টার সরান</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          {error && (
            <div className="bg-white border border-red-200 rounded-xl p-6 mb-8 text-center">
              <div className="text-red-600 font-semibold mb-2 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                ত্রুটি!
              </div>
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, index) => (
                <LoadingSkeleton key={index} />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">কোন কোর্স পাওয়া যায়নি</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">আপনার অনুসন্ধানের সাথে মিলিয়ে কোন কোর্স পাওয়া যায়নি। অন্য কীওয়ার্ড দিয়ে চেষ্টা করুন।</p>
              <button
                onClick={clearFilters}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-200 inline-flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <span>সব ফিল্টার সরান</span>
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {courses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && <Pagination />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}