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
  ChevronUp,
  GraduationCap,
  Bookmark,
  Grid3X3,
  List,
  Sparkles
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
  const [activeFilterTab, setActiveFilterTab] = useState('class');

  const { data: courses = [], isLoading, isError, error } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const res = await axiosInstance.get('/api/courses');
      return res.data;
    },
  });

  // Get unique values for filters with counts
  const filterOptions = useMemo(() => {
    const classes = [...new Set(courses.map(course => course.class))].sort((a, b) => a - b);
    const subjects = [...new Set(courses.map(course => course.subject || course.category))].sort();
    
    // Calculate counts for each filter option
    const classCounts = classes.reduce((acc, cls) => {
      acc[cls] = courses.filter(course => course.class === cls).length;
      return acc;
    }, {});

    const subjectCounts = subjects.reduce((acc, subject) => {
      acc[subject] = courses.filter(course => (course.subject || course.category) === subject).length;
      return acc;
    }, {});

    const totalCount = courses.length;
    const freeCount = courses.filter(course => course.price === 0).length;
    const paidCount = courses.filter(course => course.price > 0).length;
    const discountCount = courses.filter(course => course.original_price > course.price).length;
    
    const rating45Count = courses.filter(course => course.rating >= 4.5).length;
    const rating40Count = courses.filter(course => course.rating >= 4.0).length;
    const rating35Count = courses.filter(course => course.rating >= 3.5).length;

    return {
      classes: ['all', ...classes],
      subjects: ['all', ...subjects],
      classCounts,
      subjectCounts,
      totalCount,
      prices: [
        { value: 'all', label: 'সকল কোর্স', count: totalCount, icon: <BookOpen className="w-4 h-4" /> },
        { value: 'free', label: 'ফ্রি কোর্স', count: freeCount, icon: <Award className="w-4 h-4" /> },
        { value: 'paid', label: 'পেইড কোর্স', count: paidCount, icon: <DollarSign className="w-4 h-4" /> },
        { value: 'discount', label: 'ডিসকাউন্ট', count: discountCount, icon: <TrendingUp className="w-4 h-4" /> }
      ],
      ratings: [
        { value: 'all', label: 'সকল রেটিং', count: totalCount, icon: <Star className="w-4 h-4" /> },
        { value: '4.5', label: '৪.৫+ স্টার', count: rating45Count, icon: <Sparkles className="w-4 h-4" /> },
        { value: '4.0', label: '৪.০+ স্টার', count: rating40Count, icon: <Star className="w-4 h-4" /> },
        { value: '3.5', label: '৩.৫+ স্টার', count: rating35Count, icon: <Star className="w-4 h-4" /> }
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
          ${course.group || ''}
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
      },
      'বাধ্যতামূলক': { 
        color: 'bg-blue-600', 
        icon: <GraduationCap className="w-4 h-4" />,
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700'
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

  // Filter Tabs Component
  const FilterTabs = () => (
    <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
      <div className="flex space-x-2 min-w-max">
        {[
          { id: 'class', label: 'ক্লাস ভিত্তিক', icon: <GraduationCap className="w-4 h-4" />, color: 'blue' },
          { id: 'subject', label: 'বিষয় ভিত্তিক', icon: <Bookmark className="w-4 h-4" />, color: 'green' },
          { id: 'price', label: 'মূল্য ভিত্তিক', icon: <DollarSign className="w-4 h-4" />, color: 'purple' },
          { id: 'rating', label: 'রেটিং ভিত্তিক', icon: <Star className="w-4 h-4" />, color: 'amber' },
        ].map(tab => {
          const isActive = activeFilterTab === tab.id;
          const colorClasses = {
            blue: isActive ? 'bg-blue-600 text-white shadow-blue-500/25' : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50',
            green: isActive ? 'bg-green-600 text-white shadow-green-500/25' : 'bg-white text-gray-700 border-gray-200 hover:bg-green-50',
            purple: isActive ? 'bg-purple-600 text-white shadow-purple-500/25' : 'bg-white text-gray-700 border-gray-200 hover:bg-purple-50',
            amber: isActive ? 'bg-amber-600 text-white shadow-amber-500/25' : 'bg-white text-gray-700 border-gray-200 hover:bg-amber-50',
          };

          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilterTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap shadow-lg ${
                colorClasses[tab.color]
              } ${!isActive && 'border'}`}
            >
              {tab.icon}
              {tab.label}
              {filters[tab.id] !== 'all' && (
                <span className="w-2 h-2 bg-white rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  // Class Based Filter
  const ClassFilter = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">ক্লাস ভিত্তিক কোর্স</h3>
          <p className="text-sm text-gray-600">আপনার ক্লাস নির্বাচন করুন</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <button
          onClick={() => updateFilter('class', 'all')}
          className={`p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
            filters.class === 'all'
              ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10'
              : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              filters.class === 'all' ? 'bg-blue-500' : 'bg-gray-100 group-hover:bg-blue-100'
            }`}>
              <BookOpen className={`w-5 h-5 ${
                filters.class === 'all' ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'
              }`} />
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              filters.class === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
            }`}>
              {filterOptions.totalCount}
            </span>
          </div>
          <h4 className={`font-semibold mb-1 ${
            filters.class === 'all' ? 'text-blue-900' : 'text-gray-900'
          }`}>
            সকল ক্লাস
          </h4>
          <p className={`text-xs ${
            filters.class === 'all' ? 'text-blue-700' : 'text-gray-500'
          }`}>
            সকল ক্লাসের কোর্স
          </p>
        </button>

        {filterOptions.classes.filter(cls => cls !== 'all').map(cls => (
          <button
            key={cls}
            onClick={() => updateFilter('class', cls)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
              filters.class === cls
                ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                filters.class === cls ? 'bg-blue-500' : 'bg-gray-100 group-hover:bg-blue-100'
              }`}>
                <span className={`font-bold ${
                  filters.class === cls ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'
                }`}>
                  {cls}
                </span>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                filters.class === cls 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
              }`}>
                {filterOptions.classCounts[cls] || 0}
              </span>
            </div>
            <h4 className={`font-semibold mb-1 ${
              filters.class === cls ? 'text-blue-900' : 'text-gray-900'
            }`}>
              ক্লাস {cls}
            </h4>
            <p className={`text-xs ${
              filters.class === cls ? 'text-blue-700' : 'text-gray-500'
            }`}>
              {filterOptions.classCounts[cls] || 0} টি কোর্স
            </p>
          </button>
        ))}
      </div>
    </div>
  );

  // Subject Based Filter
  const SubjectFilter = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
          <Bookmark className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">বিষয় ভিত্তিক কোর্স</h3>
          <p className="text-sm text-gray-600">আপনার পছন্দের বিষয় নির্বাচন করুন</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <button
          onClick={() => updateFilter('subject', 'all')}
          className={`p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
            filters.subject === 'all'
              ? 'border-green-500 bg-green-50 shadow-lg shadow-green-500/10'
              : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              filters.subject === 'all' ? 'bg-green-500' : 'bg-gray-100 group-hover:bg-green-100'
            }`}>
              <BookOpen className={`w-5 h-5 ${
                filters.subject === 'all' ? 'text-white' : 'text-gray-600 group-hover:text-green-600'
              }`} />
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              filters.subject === 'all' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 text-gray-600 group-hover:bg-green-100 group-hover:text-green-600'
            }`}>
              {filterOptions.totalCount}
            </span>
          </div>
          <h4 className={`font-semibold mb-1 ${
            filters.subject === 'all' ? 'text-green-900' : 'text-gray-900'
          }`}>
            সকল বিষয়
          </h4>
          <p className={`text-xs ${
            filters.subject === 'all' ? 'text-green-700' : 'text-gray-500'
          }`}>
            সকল বিষয়ের কোর্স
          </p>
        </button>

        {filterOptions.subjects.filter(sub => sub !== 'all').map(subject => {
          const categoryInfo = getCategoryInfo(subject);
          return (
            <button
              key={subject}
              onClick={() => updateFilter('subject', subject)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
                filters.subject === subject
                  ? `${categoryInfo.bgColor} border-green-500 shadow-lg shadow-green-500/10`
                  : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  filters.subject === subject ? categoryInfo.color : 'bg-gray-100 group-hover:bg-green-100'
                }`}>
                  {React.cloneElement(categoryInfo.icon, {
                    className: `w-5 h-5 ${
                      filters.subject === subject ? 'text-white' : 'text-gray-600 group-hover:text-green-600'
                    }`
                  })}
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  filters.subject === subject 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-600 group-hover:bg-green-100 group-hover:text-green-600'
                }`}>
                  {filterOptions.subjectCounts[subject] || 0}
                </span>
              </div>
              <h4 className={`font-semibold mb-1 ${
                filters.subject === subject ? 'text-green-900' : 'text-gray-900'
              }`}>
                {subject}
              </h4>
              <p className={`text-xs ${
                filters.subject === subject ? 'text-green-700' : 'text-gray-500'
              }`}>
                {filterOptions.subjectCounts[subject] || 0} টি কোর্স
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );

  // Price Based Filter
  const PriceFilter = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
          <DollarSign className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">মূল্য ভিত্তিক কোর্স</h3>
          <p className="text-sm text-gray-600">আপনার বাজেট অনুযায়ী কোর্স নির্বাচন করুন</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filterOptions.prices.map(price => (
          <button
            key={price.value}
            onClick={() => updateFilter('price', price.value)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
              filters.price === price.value
                ? 'border-purple-500 bg-purple-50 shadow-lg shadow-purple-500/10'
                : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                filters.price === price.value ? 'bg-purple-500' : 'bg-gray-100 group-hover:bg-purple-100'
              }`}>
                {React.cloneElement(price.icon, {
                  className: `w-5 h-5 ${
                    filters.price === price.value ? 'text-white' : 'text-gray-600 group-hover:text-purple-600'
                  }`
                })}
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                filters.price === price.value 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-100 text-gray-600 group-hover:bg-purple-100 group-hover:text-purple-600'
              }`}>
                {price.count}
              </span>
            </div>
            <h4 className={`font-semibold mb-1 ${
              filters.price === price.value ? 'text-purple-900' : 'text-gray-900'
            }`}>
              {price.label}
            </h4>
            <p className={`text-xs ${
              filters.price === price.value ? 'text-purple-700' : 'text-gray-500'
            }`}>
              {price.count} টি কোর্স
            </p>
          </button>
        ))}
      </div>
    </div>
  );

  // Rating Based Filter
  const RatingFilter = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl">
          <Star className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">রেটিং ভিত্তিক কোর্স</h3>
          <p className="text-sm text-gray-600">উচ্চ রেটেড কোর্স নির্বাচন করুন</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filterOptions.ratings.map(rating => (
          <button
            key={rating.value}
            onClick={() => updateFilter('rating', rating.value)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
              filters.rating === rating.value
                ? 'border-amber-500 bg-amber-50 shadow-lg shadow-amber-500/10'
                : 'border-gray-200 bg-white hover:border-amber-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                filters.rating === rating.value ? 'bg-amber-500' : 'bg-gray-100 group-hover:bg-amber-100'
              }`}>
                {React.cloneElement(rating.icon, {
                  className: `w-5 h-5 ${
                    filters.rating === rating.value ? 'text-white' : 'text-gray-600 group-hover:text-amber-600'
                  }`
                })}
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                filters.rating === rating.value 
                  ? 'bg-amber-500 text-white' 
                  : 'bg-gray-100 text-gray-600 group-hover:bg-amber-100 group-hover:text-amber-600'
              }`}>
                {rating.count}
              </span>
            </div>
            <h4 className={`font-semibold mb-1 ${
              filters.rating === rating.value ? 'text-amber-900' : 'text-gray-900'
            }`}>
              {rating.label}
            </h4>
            <p className={`text-xs ${
              filters.rating === rating.value ? 'text-amber-700' : 'text-gray-500'
            }`}>
              {rating.count} টি কোর্স
            </p>
          </button>
        ))}
      </div>
    </div>
  );

  // Main Filter Content
  const FilterContent = () => (
    <div className="space-y-6">
      {activeFilterTab === 'class' && <ClassFilter />}
      {activeFilterTab === 'subject' && <SubjectFilter />}
      {activeFilterTab === 'price' && <PriceFilter />}
      {activeFilterTab === 'rating' && <RatingFilter />}
    </div>
  );

  // Active Filters Display
  const ActiveFilters = () => {
    const activeFiltersList = [];
    
    if (filters.class !== 'all') {
      activeFiltersList.push(`ক্লাস ${filters.class}`);
    }
    if (filters.subject !== 'all') {
      activeFiltersList.push(filters.subject);
    }
    if (filters.price !== 'all') {
      const priceLabel = filterOptions.prices.find(p => p.value === filters.price)?.label;
      activeFiltersList.push(priceLabel);
    }
    if (filters.rating !== 'all') {
      const ratingLabel = filterOptions.ratings.find(r => r.value === filters.rating)?.label;
      activeFiltersList.push(ratingLabel);
    }

    if (activeFiltersList.length === 0) return null;

    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-gray-600 font-medium">সক্রিয় ফিল্টার:</span>
        {activeFiltersList.map((filter, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
          >
            {filter}
            <button
              onClick={() => {
                if (filter.startsWith('ক্লাস')) updateFilter('class', 'all');
                else if (filterOptions.subjects.includes(filter)) updateFilter('subject', 'all');
                else if (filterOptions.prices.some(p => p.label === filter)) updateFilter('price', 'all');
                else if (filterOptions.ratings.some(r => r.label === filter)) updateFilter('rating', 'all');
              }}
              className="hover:text-blue-600"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <button
          onClick={clearFilters}
          className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
        >
          <X className="w-4 h-4" />
          সব ক্লিয়ার
        </button>
      </div>
    );
  };

  // Course Card Component (Keep your existing CourseCard component)
  const CourseCard = ({ course }) => {
    const categoryInfo = getCategoryInfo(course.subject || course.category);
    
    // Calculate total lessons from curriculum
    const totalLessons = course.curriculum?.reduce((total, chapter) => 
      total + (chapter.lessons?.length || 0), 0
    ) || 0;

    // Calculate discount percentage
    const discountPercentage = course.original_price > course.price 
      ? Math.round((1 - course.price / course.original_price) * 100)
      : 0;

    // Get first lesson duration for display
    const firstLessonDuration = course.curriculum?.[0]?.lessons?.[0]?.video_duration || '00:00:00';

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
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            <span className={`${categoryInfo.color} text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 backdrop-blur-sm`}>
              {categoryInfo.icon}
              {course.subject}
            </span>
            <span className={`${getClassColor(course.class)} text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm`}>
              ক্লাস {course.class}
            </span>
            {course.group && (
              <span className="bg-gray-800/80 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                {course.group}
              </span>
            )}
          </div>
          
          {/* Certificate Badge */}
          <div className="absolute top-3 right-3">
            {course.certificate_included && (
              <div className="flex items-center gap-1 bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-sm">
                <Award className="w-3 h-3" />
                সার্টিফিকেট
              </div>
            )}
          </div>
          
          {/* Video Info */}
          <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-lg text-sm flex items-center backdrop-blur-sm">
            <Video className="w-3 h-3 mr-1" />
            {course.total_videos} ভিডিও
          </div>

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-3 right-3 mt-8 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
              {discountPercentage}% ছাড়
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          
          {/* Short Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
            {course.short_description}
          </p>

          {/* Instructor */}
          <div className="flex items-center mb-4">
            <User className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">শিক্ষক: {course.instructor_name}</span>
          </div>

          {/* Course Stats */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <div className="flex items-center">
                <Video className="w-4 h-4 mr-1" />
                <span>{course.total_videos} ভিডিও</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                <span>{totalLessons} লেসন</span>
              </div>
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-1" />
                <span>{course.language}</span>
              </div>
            </div>

            {/* Rating and Students */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="ml-1 font-semibold text-gray-900">{course.rating}</span>
                <span className="text-gray-500 ml-1">({course.reviews_count || 0})</span>
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
              {course.price > 0 ? (
                <div className="text-left">
                  <span className="text-lg font-bold text-gray-900 block">
                    ৳{course.price}
                  </span>
                  {course.original_price > course.price && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500 line-through">
                        ৳{course.original_price}
                      </span>
                      <span className="text-xs text-green-600 font-medium">
                        {discountPercentage}% ছাড়
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-lg font-bold text-green-600">ফ্রি</span>
              )}
            </div>
            <Link href={`/courses/${course._id}`}>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                {course.is_enrolled ? 'কোর্সে যান' : 'এনরোল করুন'}
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
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 lg:mb-4">
            আমাদের সকল কোর্স
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            ক্লাস ৮-১২ এর শিক্ষার্থীদের জন্য প্রস্তুতকৃত সম্পূর্ণ কারিকুলাম ভিত্তিক কোর্সসমূহ
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="কোর্স, বিষয় বা শিক্ষক খুঁজুন..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
            />
          </div>
        </div>

        {/* Main Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          {/* Filter Tabs */}
          <FilterTabs />
          
          {/* Filter Content */}
          <FilterContent />
          
          {/* Active Filters */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <ActiveFilters />
          </div>
        </div>

        {/* Results and View Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  {filteredCourses.length} টি কোর্স পাওয়া গেছে
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
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className={`grid gap-6 mb-8 ${
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
          <div className="text-center py-16 px-4">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">কোন কোর্স পাওয়া যায়নি</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto text-base">
              {hasActiveFilters 
                ? 'আপনার বর্তমান ফিল্টারের সাথে মিলছে না। ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।'
                : 'বর্তমানে কোন কোর্স উপলব্ধ নেই। শীঘ্রই নতুন কোর্স যোগ করা হবে।'
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                সকল ফিল্টার ক্লিয়ার করুন
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {filteredCourses.length > 0 && totalPages > 1 && <Pagination />}
      </div>
    </div>
  );
}