'use client'
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import { 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  Award, 
  Play,
  Globe,
  CheckCircle,
  Video,
  BarChart3,
  BookText,
  Calculator,
  Atom,
  DollarSign,
  TrendingUp,
  User,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Search,
  SlidersHorizontal,
  ChevronDown,
  GraduationCap,
  Bookmark,
  Grid3X3,
  List,
  Menu
} from 'lucide-react';
import Link from 'next/link';

export default function CoursePage() {
  const axiosInstance = useAxiosSecure();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    class: 'all',
    subject: 'all',
    price: 'all',
    rating: 'all',
    search: ''
  });
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [activeFilterTab, setActiveFilterTab] = useState('all'); // For mobile filter tabs

  const { data: courses = [], isLoading, isError, error } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const res = await axiosInstance.get('/api/courses');
      return res.data;
    },
  });

  // Get unique values for filters
  const filterOptions = useMemo(() => {
    const classes = [...new Set(courses.map(course => course.class))].sort((a, b) => a - b);
    const subjects = [...new Set(courses.map(course => course.subject || course.category))].sort();
    
    return {
      classes: ['all', ...classes],
      subjects: ['all', ...subjects],
      prices: [
        { value: 'all', label: 'সকল মূল্য' },
        { value: 'free', label: 'ফ্রি' },
        { value: 'paid', label: 'পেইড' },
        { value: 'discount', label: 'ডিসকাউন্ট' }
      ],
      ratings: [
        { value: 'all', label: 'সকল রেটিং' },
        { value: '4.5', label: '৪.৫+ স্টার' },
        { value: '4.0', label: '৪.০+ স্টার' },
        { value: '3.5', label: '৩.৫+ স্টার' }
      ]
    };
  }, [courses]);

  // Filter courses based on all criteria
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      if (filters.class !== 'all' && course.class !== filters.class) return false;
      if (filters.subject !== 'all' && (course.subject || course.category) !== filters.subject) return false;
      
      if (filters.price !== 'all') {
        if (filters.price === 'free' && course.price > 0) return false;
        if (filters.price === 'paid' && course.price === 0) return false;
        if (filters.price === 'discount' && course.original_price <= course.price) return false;
      }
      
      if (filters.rating !== 'all' && course.rating < parseFloat(filters.rating)) return false;
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableText = `
          ${course.title} 
          ${course.short_description} 
          ${course.instructor_name}
          ${course.subject || course.category}
        `.toLowerCase();
        
        if (!searchableText.includes(searchTerm)) return false;
      }
      
      return true;
    });
  }, [courses, filters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters, itemsPerPage]);

  // Update filter function
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      class: 'all',
      subject: 'all',
      price: 'all',
      rating: 'all',
      search: ''
    });
  };

  // Check if any filter is active
  const hasActiveFilters = Object.values(filters).some(value => 
    value !== 'all' && value !== ''
  );

  // Pagination controls
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  // Function to get category color and icon
  const getCategoryInfo = (category) => {
    const categoryData = {
      'বাংলা': { 
        color: 'bg-green-500', 
        icon: <BookText className="w-4 h-4" />,
        bgColor: 'bg-green-50',
        textColor: 'text-green-700'
      },
      'ইংরেজি': { 
        color: 'bg-blue-500', 
        icon: <BookOpen className="w-4 h-4" />,
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700'
      },
      'গণিত': { 
        color: 'bg-purple-500', 
        icon: <Calculator className="w-4 h-4" />,
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700'
      },
      'বিজ্ঞান': { 
        color: 'bg-red-500', 
        icon: <Atom className="w-4 h-4" />,
        bgColor: 'bg-red-50',
        textColor: 'text-red-700'
      },
      'পদার্থবিজ্ঞান': { 
        color: 'bg-orange-500', 
        icon: <Atom className="w-4 h-4" />,
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-700'
      },
      'ব্যবসায় শিক্ষা': { 
        color: 'bg-indigo-500', 
        icon: <DollarSign className="w-4 h-4" />,
        bgColor: 'bg-indigo-50',
        textColor: 'text-indigo-700'
      },
      'হিসাববিজ্ঞান': { 
        color: 'bg-teal-500', 
        icon: <TrendingUp className="w-4 h-4" />,
        bgColor: 'bg-teal-50',
        textColor: 'text-teal-700'
      },
      'মানবিক': { 
        color: 'bg-pink-500', 
        icon: <User className="w-4 h-4" />,
        bgColor: 'bg-pink-50',
        textColor: 'text-pink-700'
      },
      'অর্থনীতি': { 
        color: 'bg-amber-500', 
        icon: <TrendingUp className="w-4 h-4" />,
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700'
      }
    };
    return categoryData[category] || { 
      color: 'bg-gray-500', 
      icon: <BookOpen className="w-4 h-4" />,
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-700'
    };
  };

  // Function to get class level color
  const getClassColor = (classLevel) => {
    const colors = {
      '8': 'bg-blue-500',
      '9': 'bg-green-500',
      '10': 'bg-purple-500',
      '11': 'bg-orange-500',
      '12': 'bg-red-500'
    };
    return colors[classLevel] || 'bg-gray-500';
  };

  // Mobile Filter Component
  const MobileFilter = () => (
    <div className="fixed inset-0 bg-white z-50 lg:hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-bold text-gray-900">ফিল্টার</h3>
            <p className="text-sm text-gray-500">আপনার পছন্দের কোর্স খুঁজুন</p>
          </div>
        </div>
        <button
          onClick={() => setIsFilterOpen(false)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-200 bg-white sticky top-16 z-10">
        <button
          onClick={() => setActiveFilterTab('all')}
          className={`flex-1 py-4 text-center font-medium transition-colors ${
            activeFilterTab === 'all' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          সব ফিল্টার
        </button>
        <button
          onClick={() => setActiveFilterTab('search')}
          className={`flex-1 py-4 text-center font-medium transition-colors ${
            activeFilterTab === 'search' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          সার্চ
        </button>
        <button
          onClick={() => setActiveFilterTab('class')}
          className={`flex-1 py-4 text-center font-medium transition-colors ${
            activeFilterTab === 'class' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          ক্লাস
        </button>
        <button
          onClick={() => setActiveFilterTab('subject')}
          className={`flex-1 py-4 text-center font-medium transition-colors ${
            activeFilterTab === 'subject' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          বিষয়
        </button>
      </div>

      {/* Filter Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Search Filter */}
        {(activeFilterTab === 'all' || activeFilterTab === 'search') && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-1" />
              কোর্স, বিষয় বা শিক্ষক খুঁজুন
            </label>
            <input
              type="text"
              placeholder="খুঁজুন..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Class Filter */}
        {(activeFilterTab === 'all' || activeFilterTab === 'class') && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <GraduationCap className="w-4 h-4 inline mr-1" />
              ক্লাস নির্বাচন করুন
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => updateFilter('class', 'all')}
                className={`py-3 px-2 rounded-xl text-sm font-medium transition-colors ${
                  filters.class === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                সকল ক্লাস
              </button>
              {filterOptions.classes.filter(cls => cls !== 'all').map(cls => (
                <button
                  key={cls}
                  onClick={() => updateFilter('class', cls)}
                  className={`py-3 px-2 rounded-xl text-sm font-medium transition-colors ${
                    filters.class === cls
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ক্লাস {cls}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Subject Filter */}
        {(activeFilterTab === 'all' || activeFilterTab === 'subject') && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Bookmark className="w-4 h-4 inline mr-1" />
              বিষয় নির্বাচন করুন
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => updateFilter('subject', 'all')}
                className={`py-3 px-2 rounded-xl text-sm font-medium transition-colors ${
                  filters.subject === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                সকল বিষয়
              </button>
              {filterOptions.subjects.filter(sub => sub !== 'all').map(subject => (
                <button
                  key={subject}
                  onClick={() => updateFilter('subject', subject)}
                  className={`py-3 px-2 rounded-xl text-sm font-medium transition-colors ${
                    filters.subject === subject
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price Filter - Always show in all tab */}
        {activeFilterTab === 'all' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              মূল্য
            </label>
            <div className="grid grid-cols-2 gap-2">
              {filterOptions.prices.map(price => (
                <button
                  key={price.value}
                  onClick={() => updateFilter('price', price.value)}
                  className={`py-3 px-2 rounded-xl text-sm font-medium transition-colors ${
                    filters.price === price.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {price.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Rating Filter - Always show in all tab */}
        {activeFilterTab === 'all' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Star className="w-4 h-4 inline mr-1" />
              রেটিং
            </label>
            <div className="grid grid-cols-2 gap-2">
              {filterOptions.ratings.map(rating => (
                <button
                  key={rating.value}
                  onClick={() => updateFilter('rating', rating.value)}
                  className={`py-3 px-2 rounded-xl text-sm font-medium transition-colors ${
                    filters.rating === rating.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {rating.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
        <div className="flex gap-3">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              ক্লিয়ার
            </button>
          )}
          <button
            onClick={() => setIsFilterOpen(false)}
            className={`py-3 px-6 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors ${
              hasActiveFilters ? 'flex-1' : 'w-full'
            }`}
          >
            ফলাফল দেখুন ({filteredCourses.length})
          </button>
        </div>
      </div>
    </div>
  );

  // Desktop Filter Component
  const DesktopFilter = () => (
    <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <SlidersHorizontal className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">ফিল্টার</h3>
            <p className="text-sm text-gray-500">আপনার পছন্দের কোর্স খুঁজুন</p>
          </div>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
          >
            <X className="w-4 h-4" />
            ক্লিয়ার
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="কোর্স, বিষয় বা শিক্ষক খুঁজুন..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Class Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <GraduationCap className="w-4 h-4 inline mr-1" />
            ক্লাস
          </label>
          <select
            value={filters.class}
            onChange={(e) => updateFilter('class', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer transition-all duration-200"
          >
            <option value="all">সকল ক্লাস</option>
            {filterOptions.classes.filter(cls => cls !== 'all').map(cls => (
              <option key={cls} value={cls}>ক্লাস {cls}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-9 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Subject Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Bookmark className="w-4 h-4 inline mr-1" />
            বিষয়
          </label>
          <select
            value={filters.subject}
            onChange={(e) => updateFilter('subject', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer transition-all duration-200"
          >
            <option value="all">সকল বিষয়</option>
            {filterOptions.subjects.filter(sub => sub !== 'all').map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-9 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Price Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 inline mr-1" />
            মূল্য
          </label>
          <select
            value={filters.price}
            onChange={(e) => updateFilter('price', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer transition-all duration-200"
          >
            {filterOptions.prices.map(price => (
              <option key={price.value} value={price.value}>{price.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-9 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Rating Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Star className="w-4 h-4 inline mr-1" />
            রেটিং
          </label>
          <select
            value={filters.rating}
            onChange={(e) => updateFilter('rating', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer transition-all duration-200"
          >
            {filterOptions.ratings.map(rating => (
              <option key={rating.value} value={rating.value}>{rating.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-9 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );

  // Course Card Component
  const CourseCard = ({ course }) => {
    const categoryInfo = getCategoryInfo(course.subject || course.category);
    
    return (
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100 hover:border-blue-200 group">
        {/* Thumbnail */}
        <div className="relative overflow-hidden">
          <img 
            src={course.thumbnail_url} 
            alt={course.title}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            <span className={`${categoryInfo.color} text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 backdrop-blur-sm`}>
              {categoryInfo.icon}
              {course.subject || course.category}
            </span>
            <span className={`${getClassColor(course.class)} text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm`}>
              ক্লাস {course.class}
            </span>
          </div>
          
          <div className="absolute top-3 right-3">
            {course.certificate_included && (
              <Award className="w-5 h-5 text-yellow-400 drop-shadow-lg" />
            )}
          </div>
          
          <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-lg text-sm flex items-center backdrop-blur-sm">
            <Play className="w-3 h-3 mr-1" />
            {course.video_duration}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
            {course.short_description}
          </p>

          {/* Instructor */}
          <div className="flex items-center mb-4">
            <User className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">শিক্ষক: {course.instructor_name}</span>
          </div>

          {/* Stats */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                <span>{course.total_lessons} লেসন</span>
              </div>
              <div className="flex items-center">
                <Video className="w-4 h-4 mr-1" />
                <span>{course.total_videos} ভিডিও</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="ml-1 font-semibold text-gray-900">{course.rating}</span>
                <span className="text-gray-500 ml-1">({course.reviews_count})</span>
              </div>
              <div className="flex items-center text-gray-500">
                <Users className="w-4 h-4 mr-1" />
                <span>{course.students_count?.toLocaleString() || 0} শিক্ষার্থী</span>
              </div>
            </div>
          </div>

          {/* Price and Enroll */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
            <div className="flex items-center space-x-2">
              {course.original_price > 0 ? (
                <>
                  <span className="text-lg font-bold text-gray-900">
                    ৳{course.price}
                  </span>
                  {course.original_price > course.price && (
                    <span className="text-sm text-gray-500 line-through">
                      ৳{course.original_price}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-lg font-bold text-green-600">ফ্রি</span>
              )}
            </div>
            <Link href={`/courses/${course._id}`}>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                এনরোল করুন
                <CheckCircle className="w-4 h-4 ml-1" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Pagination Component
  const Pagination = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
      {/* Results Info */}
      <div className="text-sm text-gray-600">
        দেখানো হচ্ছে <span className="font-semibold text-gray-900">{startIndex + 1}</span> থেকে{' '}
        <span className="font-semibold text-gray-900">{Math.min(endIndex, filteredCourses.length)}</span> এর মধ্যে{' '}
        <span className="font-semibold text-gray-900">{filteredCourses.length}</span> টি কোর্সের
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Items Per Page Selector */}
        <select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value={12}>১২ প্রতি পৃষ্ঠায়</option>
          <option value={24}>২৪ প্রতি পৃষ্ঠায়</option>
          <option value={36}>৩৬ প্রতি পৃষ্ঠায়</option>
          <option value={48}>৪৮ প্রতি পৃষ্ঠায়</option>
        </select>

        {/* Pagination Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {getPageNumbers().map(page => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">কোর্স লোড হচ্ছে...</p>
      </div>
    </div>
  );
  
  if (isError) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-red-600 text-center">
        <p className="text-xl font-semibold">কোর্স লোড করতে সমস্যা হয়েছে</p>
        <p className="text-gray-600 mt-2">{error?.response?.data?.error || error.message}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-4 lg:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-8 px-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 lg:mb-4">
            আমাদের সকল কোর্স
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            ক্লাস ৮-১২ এর শিক্ষার্থীদের জন্য প্রস্তুতকৃত সম্পূর্ণ কারিকুলাম ভিত্তিক কোর্সসমূহ
          </p>
        </div>

        {/* Desktop Filter */}
        <DesktopFilter />

        {/* Results and Controls Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base lg:text-lg">
                  মোট {filteredCourses.length} টি কোর্স পাওয়া গেছে
                </h3>
                <p className="text-gray-600 text-sm">
                  {hasActiveFilters ? 'আপনার ফিল্টার অনুযায়ী' : 'সকল কোর্স দেখানো হচ্ছে'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Filter Trigger */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <SlidersHorizontal className="w-4 h-4" />
                ফিল্টার
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className={`grid gap-4 lg:gap-6 mb-6 lg:mb-8 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {currentCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12 lg:py-16 px-4">
            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-4 lg:mb-6">
              <BookOpen className="w-8 h-8 lg:w-10 lg:h-10 text-gray-400" />
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">কোন কোর্স পাওয়া যায়নি</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm lg:text-base">
              {hasActiveFilters 
                ? 'আপনার বর্তমান ফিল্টারের সাথে মিলছে না। ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।'
                : 'বর্তমানে কোন কোর্স উপলব্ধ নেই। শীঘ্রই নতুন কোর্স যোগ করা হবে।'
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 lg:px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm lg:text-base"
              >
                সকল ফিল্টার ক্লিয়ার করুন
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {filteredCourses.length > 0 && totalPages > 1 && <Pagination />}
      </div>

      {/* Mobile Filter Modal */}
      {isFilterOpen && <MobileFilter />}
    </div>
  );
}