'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [group, setGroup] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);

  // Color schemes for different groups
  const groupColors = {
    'বিজ্ঞান': { gradient: 'from-blue-500 to-purple-600', badge: 'bg-blue-100 text-blue-800' },
    'মানবিক': { gradient: 'from-green-500 to-teal-600', badge: 'bg-green-100 text-green-800' },
    'ব্যবসায় শিক্ষা': { gradient: 'from-orange-500 to-red-600', badge: 'bg-orange-100 text-orange-800' },
    'default': { gradient: 'from-gray-500 to-gray-700', badge: 'bg-gray-100 text-gray-800' }
  };

  // Price type colors
  const getPriceTypeColor = (price, originalPrice) => {
    if (price === 0) return { gradient: 'from-green-500 to-emerald-600', text: 'text-green-600', badge: 'ফ্রি' };
    if (originalPrice > price) return { gradient: 'from-red-500 to-pink-600', text: 'text-red-600', badge: 'ডিসকাউন্ট' };
    return { gradient: 'from-purple-500 to-indigo-600', text: 'text-purple-600', badge: 'প্রিমিয়াম' };
  };

  // Fetch courses from API
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '6',
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
    fetchCourses();
  }, [fetchCourses]);

  // Handle immediate search
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCourses();
  };

  // Handle group filter
  const handleGroupChange = (e) => {
    setGroup(e.target.value);
    setPage(1);
  };

  // Handle search input change with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    debouncedSearch(value);
  };

  // Course card component
  const CourseCard = ({ course }) => {
    const groupColor = groupColors[course.group] || groupColors.default;
    const priceType = getPriceTypeColor(course.price, course.original_price);
    const discountPercentage = course.original_price > course.price 
      ? Math.round(((course.original_price - course.price) / course.original_price) * 100)
      : 0;

    return (
      <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-100 transform hover:-translate-y-2">
        {/* Card Header with Gradient */}
        <div className={`relative h-2 bg-gradient-to-r ${groupColor.gradient}`}></div>
        
        {/* Image Container */}
        <div className="relative overflow-hidden p-4 pb-0">
          <img 
            className="w-full h-40 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-md"
            src={course.thumbnail_url || "https://images.unsplash.com/photo-1560264418-c4445382edbc?q=80&w=400"} 
            alt={course.title}
          />
          
          {/* Price Type Badge */}
          <div className={`absolute top-6 left-6 ${priceType.text} bg-white px-3 py-1 rounded-full text-xs font-bold shadow-lg border`}>
            {priceType.badge}
          </div>

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-6 right-6 bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              {discountPercentage}% ছাড়
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-6">
          {/* Group and Class Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`${groupColor.badge} px-3 py-1 rounded-full text-xs font-medium`}>
              {course.group}
            </span>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
              {course.class}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-gray-900 text-lg font-bold line-clamp-2 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          
          {/* Instructor */}
          <p className="text-gray-600 text-sm font-medium mb-3">
            {course.instructor_name}
          </p>

          {/* Description */}
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
            {course.short_description || course.full_description}
          </p>

          {/* Rating and Video Count */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                <span className="text-yellow-500 text-sm">★</span>
                <span className="text-gray-700 text-sm font-medium ml-1">{course.rating}</span>
              </div>
              <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                <span className="text-blue-500 text-sm">📹</span>
                <span className="text-gray-700 text-sm font-medium ml-1">{course.total_videos} ভিডিও</span>
              </div>
            </div>
          </div>

          {/* Price Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {course.original_price > course.price && (
                <span className="text-gray-400 text-sm line-through font-medium">
                  ৳{course.original_price}
                </span>
              )}
              <span className={`text-lg font-bold ${priceType.text}`}>
                {course.price === 0 ? 'ফ্রি' : `৳${course.price}`}
              </span>
            </div>
            <span className="text-gray-500 text-sm font-medium">
              {course.language}
            </span>
          </div>

          {/* Details Button */}
          <Link 
            href={`/courses/${course._id}`}
            className={`w-full bg-gradient-to-r ${groupColor.gradient} hover:opacity-90 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-md text-center block`}
          >
            বিস্তারিত দেখুন
          </Link>
        </div>
      </div>
    );
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-2 bg-gray-200"></div>
      <div className="p-4 pb-0">
        <div className="h-40 bg-gray-300 rounded-xl"></div>
      </div>
      <div className="p-6">
        <div className="flex gap-2 mb-3">
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        </div>
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="flex justify-between mb-4">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>
        <div className="h-12 bg-gray-200 rounded-xl"></div>
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
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
            page === i
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-12">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200 flex items-center space-x-2"
        >
          <span>←</span>
          <span>পূর্ববর্তী</span>
        </button>
        
        <div className="flex items-center space-x-2">
          {pages}
        </div>
        
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200 flex items-center space-x-2"
        >
          <span>পরবর্তী</span>
          <span>→</span>
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
            মানসম্মত শিক্ষা
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            আমাদের কোর্সসমূহ
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            বিভিন্ন বিষয়ের উপর উচ্চমানের শিক্ষা materials এবং এক্সপার্ট গাইডেন্স
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
            {/* Search Input */}
            <div className="lg:col-span-2">
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200"
                />
              </div>
            </div>

            {/* Group Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                গ্রুপ নির্বাচন করুন
              </label>
              <select
                value={group}
                onChange={handleGroupChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200"
              >
                <option value="">সকল গ্রুপ</option>
                <option value="বিজ্ঞান">বিজ্ঞান</option>
                <option value="মানবিক">মানবিক</option>
                <option value="ব্যবসায় শিক্ষা">ব্যবসায় শিক্ষা</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-gray-600">
              মোট <span className="font-bold text-blue-600">{totalCourses}</span>টি কোর্স পাওয়া গেছে
            </div>
            <div className="text-gray-500 text-sm">
              পৃষ্ঠা {page} / {totalPages}
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 text-center">
            <div className="text-red-600 font-semibold mb-2">ত্রুটি!</div>
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <LoadingSkeleton key={index} />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">কোন কোর্স পাওয়া যায়নি</h3>
            <p className="text-gray-600 mb-6">আপনার অনুসন্ধানের সাথে মিলিয়ে কোন কোর্স পাওয়া যায়নি</p>
            <button
              onClick={() => {
                setSearch('');
                setGroup('');
                setPage(1);
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 transform hover:scale-105"
            >
              সব ফিল্টার সরান
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
  );
}