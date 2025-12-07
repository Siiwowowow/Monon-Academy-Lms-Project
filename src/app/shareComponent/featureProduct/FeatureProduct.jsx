'use client'
import React, { useEffect, useState } from 'react'
import { 
  FaStar, 
  FaUsers, 
  FaClock, 
  FaPlayCircle, 
  FaCertificate,
  FaChalkboardTeacher,
  FaRegBookmark,
  FaFire,
  FaBook,
  FaGraduationCap,
  FaSearch,
  FaFilter,
  FaTimes
} from 'react-icons/fa'
import Image from 'next/image'
import { Tiro_Bangla } from 'next/font/google'
import Link from 'next/link'

// Load Tiro Bangla font
const tiroBangla = Tiro_Bangla({
  weight: ["400"],
  subsets: ["bengali"],
})

const FeaturedCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [group, setGroup] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Build query parameters
        const params = new URLSearchParams()
        params.append('limit', '6')
        params.append('page', '1')
        if (debouncedSearch) params.append('search', debouncedSearch)
        if (group) params.append('group', group)
        
        const response = await fetch(`/api/courses?${params.toString()}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch courses: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (data.success) {
          setCourses(data.data)
        } else {
          throw new Error(data.error || 'Failed to fetch courses')
        }
      } catch (err) {
        console.error('Error fetching courses:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [debouncedSearch, group])

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  // Color schemes for different course types
  const courseTypeColors = {
    free: {
      badge: 'bg-green-100 text-green-800 border-green-200',
      price: 'text-green-600',
      button: 'bg-green-600 hover:bg-green-700 text-white',
      icon: 'text-green-500',
      tag: 'ফ্রি'
    },
    discounted: {
      badge: 'bg-red-100 text-red-800 border-red-200',
      price: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700 text-white',
      icon: 'text-red-500',
      tag: 'ডিসকাউন্ট'
    },
    premium: {
      badge: 'bg-purple-100 text-purple-800 border-purple-200',
      price: 'text-purple-600',
      button: 'bg-purple-600 hover:bg-purple-700 text-white',
      icon: 'text-purple-500',
      tag: 'প্রিমিয়াম'
    },
    popular: {
      badge: 'bg-orange-100 text-orange-800 border-orange-200',
      price: 'text-orange-600',
      button: 'bg-orange-600 hover:bg-orange-700 text-white',
      icon: 'text-orange-500',
      tag: 'জনপ্রিয়'
    },
    new: {
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
      price: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      icon: 'text-blue-500',
      tag: 'নতুন'
    }
  }

  // Group colors
  const groupColors = {
    'বিজ্ঞান': 'bg-blue-50 text-blue-700 border-blue-200',
    'মানবিক': 'bg-green-50 text-green-700 border-green-200',
    'ব্যবসায় শিক্ষা': 'bg-purple-50 text-purple-700 border-purple-200',
    'default': 'bg-gray-50 text-gray-700 border-gray-200'
  }

  // Get default image based on group
  const getDefaultImage = (group, index) => {
    const images = [
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // Science
      'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80', // Math
      'https://images.unsplash.com/photo-1628863353691-0071c8c1874c?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80', // Chemistry
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.1.0&auto=format&fit=crop&w=500&q=80', // Primary
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // Medical
      'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' // Engineering
    ]
    return images[index % images.length]
  }

  // Get course type based on price and rating
  const getCourseType = (course) => {
    if (course.price === 0 || course.price === '0') return 'free'
    
    // Check if it's discounted (if original_price exists and is greater than price)
    if (course.original_price && course.original_price > course.price) return 'discounted'
    
    // Check if it's popular (high rating or many students)
    if (course.rating >= 4.5 || (course.students && course.students > 1000)) return 'popular'
    
    // Check if it's new (created within last 30 days)
    if (course.created_at) {
      const createdAt = new Date(course.created_at)
      const now = new Date()
      const diffDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24))
      if (diffDays < 30) return 'new'
    }
    
    return 'premium'
  }

  // Get random features for course (simulate from API data)
  const getCourseFeatures = (courseType) => {
    const featuresMap = {
      free: ['বেসিক কনসেপ্ট', 'ডেমো ক্লাস', 'কমিউনিটি সাপোর্ট'],
      discounted: ['লাইভ ক্লাস', 'মডেল টেস্ট', 'অনলাইন সাপোর্ট'],
      popular: ['এডভান্সড লেকচার', 'প্রাকটিস টেস্ট', 'এক্সপার্ট গাইডেন্স'],
      new: ['ইন্টারেক্টিভ ক্লাস', 'লেটেস্ট সিলেবাস', 'ফান লার্নিং'],
      premium: ['লাইভ ক্লাস', 'এসাইনমেন্ট', 'সার্টিফিকেট', '১-১ সাপোর্ট']
    }
    return featuresMap[courseType] || featuresMap.premium
  }

  // Get random subjects for course
  const getCourseSubjects = (group) => {
    const subjectsMap = {
      'বিজ্ঞান': ['গণিত', 'পদার্থবিজ্ঞান', 'রসায়ন', 'বায়োলজি'],
      'মানবিক': ['বাংলা', 'ইংরেজি', 'ইতিহাস', 'ভূগোল'],
      'ব্যবসায় শিক্ষা': ['হিসাববিজ্ঞান', 'ব্যবসায় সংগঠন', 'অর্থনীতি'],
      'default': ['গণিত', 'ইংরেজি', 'বাংলা']
    }
    return subjectsMap[group] || subjectsMap.default
  }

  // Get level from class
  const getLevelFromClass = (className) => {
    if (!className) return 'সাধারণ'
    if (className.includes('৯') || className.includes('১০')) return 'মাধ্যমিক'
    if (className.includes('১১') || className.includes('১২')) return 'উচ্চমাধ্যমিক'
    if (className.includes('প্রাথমিক') || className.includes('৫')) return 'প্রাথমিক'
    return 'সাধারণ'
  }

  // Calculate discount percentage
  const getDiscountPercentage = (course) => {
    if (!course.original_price || !course.price) return 0
    const original = parseFloat(course.original_price)
    const current = parseFloat(course.price)
    if (original > current) {
      return Math.round(((original - current) / original) * 100)
    }
    return 0
  }

  // Handle filter clear
  const clearFilters = () => {
    setSearch('')
    setGroup('')
  }

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
      <div className="relative h-48 bg-gradient-to-r from-gray-200 to-gray-300"></div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="h-6 bg-gray-200 rounded w-24"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="h-7 bg-gray-200 rounded w-24"></div>
          <div className="h-10 bg-gray-200 rounded-xl w-28"></div>
        </div>
      </div>
    </div>
  )

  // Error component
  const ErrorComponent = ({ message }) => (
    <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-red-100">
      <div className="text-red-500 text-5xl mb-4">⚠️</div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">কোর্স লোড করতে সমস্যা হয়েছে</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-[#35556e] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#2a4358] transition-colors duration-200 inline-flex items-center gap-2"
      >
        <span>আবার চেষ্টা করুন</span>
        <FaTimes className="rotate-45" />
      </button>
    </div>
  )

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="text-6xl mb-6">🎓</div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3">কোনো কোর্স পাওয়া যায়নি</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {search || group ? 
          'আপনার অনুসন্ধানের সাথে মিলিয়ে কোনো কোর্স পাওয়া যায়নি।' : 
          'বর্তমানে কোনো কোর্স উপলব্ধ নেই।'
        }
      </p>
      {(search || group) && (
        <button
          onClick={clearFilters}
          className="bg-[#35556e] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#2a4358] transition-colors duration-200 inline-flex items-center gap-2"
        >
          <FaFilter />
          <span>ফিল্টার সরান</span>
        </button>
      )}
    </div>
  )

  return (
    <div className={`${tiroBangla.className} min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-12 px-4 md:px-8`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <FaFire className="text-orange-500" />
            শিক্ষার্থীদের জন্য বিশেষ কোর্স
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            একাডেমিক কোর্স
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            স্কুল, কলেজ ও বিশ্ববিদ্যালয় ভর্তি পরীক্ষার জন্য বিশেষায়িত কোর্সসমূহ। 
            অভিজ্ঞ শিক্ষকদের মাধ্যমে গঠিত সিলেবাস অনুসরণ করুন।
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="কোর্স, বিষয় বা ইনস্ট্রাক্টর খুঁজুন..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#35556e] focus:border-transparent bg-white shadow-sm"
              />
            </div>

            {/* Group Filter */}
            <div className="flex gap-2">
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#35556e] focus:border-transparent bg-white shadow-sm min-w-[140px]"
              >
                <option value="">সকল গ্রুপ</option>
                <option value="বিজ্ঞান">বিজ্ঞান</option>
                <option value="মানবিক">মানবিক</option>
                <option value="ব্যবসায় শিক্ষা">ব্যবসায় শিক্ষা</option>
              </select>

              {/* Clear Filters Button */}
              {(search || group) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <FaTimes />
                  <span className="hidden sm:inline">ফিল্টার সরান</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {[
            { name: 'সকল কোর্স', value: '' },
            { name: 'এসএসসি প্রস্তুতি', value: 'ssc' },
            { name: 'এইচএসসি ভর্তি', value: 'hsc' },
            { name: 'বিশ্ববিদ্যালয় ভর্তি', value: 'university' },
            { name: 'মেডিকেল', value: 'medical' },
            { name: 'ইঞ্জিনিয়ারিং', value: 'engineering' },
            { name: 'প্রাথমিক', value: 'primary' }
          ].map((category) => (
            <button
              key={category.value}
              onClick={() => {
                if (category.value === '') {
                  setSearch('')
                  setGroup('')
                } else {
                  setSearch(category.name)
                }
              }}
              className={`px-4 py-2 rounded-full border transition-colors duration-200 font-medium ${
                search === category.name ? 
                'bg-[#35556e] text-white border-[#35556e]' : 
                'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[...Array(6)].map((_, index) => (
              <LoadingSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && <ErrorComponent message={error} />}

        {/* Courses Grid */}
        {!loading && !error && courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {courses.map((course, index) => {
              const courseType = getCourseType(course)
              const colors = courseTypeColors[courseType]
              const groupColor = groupColors[course.group] || groupColors.default
              const courseImage = getDefaultImage(course.group, index)
              const courseSubjects = getCourseSubjects(course.group)
              const courseFeatures = getCourseFeatures(courseType)
              const courseLevel = getLevelFromClass(course.class)
              const discountPercentage = getDiscountPercentage(course)

              return (
                <div 
                  key={course._id}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
                >
                  {/* Course Image & Badge */}
                  <div className="relative flex-shrink-0">
                    <div className="w-full h-48 relative overflow-hidden">
                      <Image
                        src={courseImage}
                        alt={course.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                      
                      {/* Course Type Badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-sm ${colors.badge}`}>
                          {colors.tag}
                        </span>
                      </div>
                      
                      {/* Bookmark Button */}
                      <div className="absolute top-4 right-4">
                        <button className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors">
                          <FaRegBookmark />
                        </button>
                      </div>
                      
                      {/* Discount Badge */}
                      {discountPercentage > 0 && (
                        <div className="absolute bottom-4 right-4 bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                          {discountPercentage}% OFF
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Category and Class */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${groupColor}`}>
                        {course.group || 'সাধারণ'}
                      </span>
                      {course.class && (
                        <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-200">
                          ক্লাস {course.class}
                        </span>
                      )}
                    </div>

                    {/* Title and Rating */}
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-800 line-clamp-2 leading-tight mb-2">
                        {course.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaChalkboardTeacher className="text-gray-400 text-sm" />
                          <span className="text-sm text-gray-600">{course.instructor_name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500">
                          <FaStar className="text-sm" />
                          <span className="text-sm font-medium">{course.rating || '৪.৫'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Subjects */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {courseSubjects.slice(0, 3).map((subject, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-500">
                      {courseFeatures.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <FaCertificate className="text-green-500 text-xs" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                      <div className="flex items-center gap-1">
                        <FaUsers className="text-gray-400" />
                        <span>{course.students?.toLocaleString('bn-BD') || '০'} জন</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaClock className="text-gray-400" />
                        <span>{course.duration || '১০ঘণ্টা'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaPlayCircle className="text-gray-400" />
                        <span>{course.total_videos || '১২'}টি</span>
                      </div>
                    </div>

                    {/* Price & Action Button */}
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-gray-800">
                          {course.price === 0 || course.price === '0' ? 
                            'ফ্রি' : 
                            `৳${parseInt(course.price).toLocaleString('bn-BD')}`
                          }
                        </span>
                        {course.original_price && course.original_price > course.price && (
                          <span className="text-sm text-gray-500 line-through">
                            ৳{parseInt(course.original_price).toLocaleString('bn-BD')}
                          </span>
                        )}
                      </div>
                      <Link 
                        href={`/courses/${course._id}`}
                        className="bg-[#35556e] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#2a4358] transition-colors duration-200 flex items-center gap-2"
                      >
                        <span>বিস্তারিত</span>
                        <FaGraduationCap />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && courses.length === 0 && <EmptyState />}

        {/* View More Button */}
        <div className="text-center">
          <Link href="/courses">
            <button 
              className="mx-auto inline-flex items-center gap-2 bg-[#35556e] text-white px-8 py-3.5 rounded-full font-semibold hover:bg-[#2a4358] transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <span>আরও কোর্স দেখুন</span>
              <FaBook />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FeaturedCourses