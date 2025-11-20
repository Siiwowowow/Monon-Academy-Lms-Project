'use client'
import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import { 
  BookOpen, 
  Star, 
  Users, 
  Video, 
  CheckCircle, 
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Bookmark,
  GraduationCap,
  DollarSign,
  Sparkles,
  Award
} from 'lucide-react';
import Link from 'next/link';

// Category styling helper function
const getCategoryStyle = (category) => {
  const styles = {
    'বাংলা': 'bg-green-100 text-green-800',
    'ইংরেজি': 'bg-blue-100 text-blue-800',
    'গণিত': 'bg-purple-100 text-purple-800',
    'বিজ্ঞান': 'bg-red-100 text-red-800',
    'পদার্থবিজ্ঞান': 'bg-orange-100 text-orange-800',
    'ব্যবসায় শিক্ষা': 'bg-indigo-100 text-indigo-800',
    'হিসাববিজ্ঞান': 'bg-teal-100 text-teal-800',
    'মানবিক': 'bg-pink-100 text-pink-800',
    'অর্থনীতি': 'bg-amber-100 text-amber-800',
    'বাধ্যতামূলক': 'bg-blue-100 text-blue-800'
  };
  return styles[category] || 'bg-gray-100 text-gray-800';
};

// Compact Course Card Component
const CourseCard = ({ course }) => {
  const categoryStyle = getCategoryStyle(course.subject || course.category);
  const discountPercentage = course.original_price > course.price 
    ? Math.round((1 - course.price / course.original_price) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
      <div className="relative">
        <img 
          src={course.thumbnail_url} 
          alt={course.title}
          className="w-full h-40 object-cover rounded-t-lg"
        />
        <span className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${categoryStyle}`}>
          {course.subject || course.category}
        </span>
        <span className="absolute top-2 right-2 bg-gray-800 text-white px-2 py-1 rounded text-xs font-medium">
          ক্লাস {course.class}
        </span>
        {discountPercentage > 0 && (
          <span className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            {discountPercentage}% ছাড়
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight text-sm min-h-[40px]">
          {course.title}
        </h3>
        <div className="flex items-center text-gray-600 mb-3">
          <User className="w-3 h-3 mr-1" />
          <span className="text-xs">{course.instructor_name}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center">
            <Video className="w-3 h-3 mr-1" />
            <span>{course.total_videos || 0} ভিডিও</span>
          </div>
          <div className="flex items-center">
            <Users className="w-3 h-3 mr-1" />
            <span>{(course.students_count || 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center">
            <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
            <span>{course.rating || 0}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            {course.price > 0 ? (
              <>
                <span className="font-bold text-gray-900">৳{course.price.toLocaleString()}</span>
                {course.original_price > course.price && (
                  <span className="text-xs text-gray-500 line-through">
                    ৳{course.original_price.toLocaleString()}
                  </span>
                )}
              </>
            ) : (
              <span className="font-bold text-green-600">ফ্রি</span>
            )}
          </div>
          <Link href={`/courses/${course._id}`}>
            <button className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700 transition-colors flex items-center">
              {course.is_enrolled ? 'যান' : 'এনরোল'}
              <CheckCircle className="w-3 h-3 ml-1" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Main Course Page Component
export default function CoursePage() {
  const axiosInstance = useAxiosSecure();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');

  const { data: courses = [], isLoading, isError, error } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/api/courses');
        return res.data;
      } catch (err) {
        console.error(err);
        throw new Error('কোর্স লোড করতে সমস্যা হয়েছে');
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  // Filter courses
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = !searchTerm || 
        course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.subject || course.category)?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesClass = selectedClass === 'all' || course.class == selectedClass;
      const matchesSubject = selectedSubject === 'all' || (course.subject || course.category) === selectedSubject;
      const matchesPrice = selectedPrice === 'all' ||
        (selectedPrice === 'free' && course.price === 0) ||
        (selectedPrice === 'paid' && course.price > 0) ||
        (selectedPrice === 'discount' && course.original_price > course.price);

      return matchesSearch && matchesClass && matchesSubject && matchesPrice;
    });
  }, [courses, searchTerm, selectedClass, selectedSubject, selectedPrice]);

  // Filter options
  const filterOptions = useMemo(() => {
    const classes = [...new Set(courses.map(course => course.class))].sort((a, b) => a - b);
    const subjects = [...new Set(courses.map(course => course.subject || course.category))].sort();
    return {
      classes: ['all', ...classes],
      subjects: ['all', ...subjects],
      prices: [
        { value: 'all', label: 'All Courses', icon: BookOpen },
        { value: 'free', label: 'Free', icon: Award },
        { value: 'paid', label: 'Paid', icon: DollarSign },
        { value: 'discount', label: 'Discount', icon: Sparkles }
      ]
    };
  }, [courses]);

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCourses = filteredCourses.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedClass, selectedSubject, selectedPrice, itemsPerPage]);
  const clearFilters = () => { setSearchTerm(''); setSelectedClass('all'); setSelectedSubject('all'); setSelectedPrice('all'); };
  const hasActiveFilters = searchTerm || selectedClass !== 'all' || selectedSubject !== 'all' || selectedPrice !== 'all';
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">কোর্স লোড হচ্ছে...</p>
      </div>
    </div>
  );

  if (isError) return (
    <div className="min-h-screen flex items-center justify-center text-center text-red-600">
      <p className="text-lg font-semibold">ত্রুটি হয়েছে</p>
      <p className="text-gray-600 mt-2">{error.message}</p>
      <button onClick={() => window.location.reload()} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">আবার চেষ্টা করুন</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">আমাদের সকল কোর্স</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">ক্লাস ৮-১২ এর জন্য সম্পূর্ণ কারিকুলাম ভিত্তিক কোর্সসমূহ</p>
        </div>

        {/* Modern Search + Filters */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-200">
          <div className="relative">
            <input type="text" placeholder="কোর্স, বিষয় বা শিক্ষক খুঁজুন..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}
              className="w-full p-3 pl-11 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none"/>
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"/>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <select value={selectedClass} onChange={(e)=>setSelectedClass(e.target.value)} className="px-3 py-1.5 rounded-full border bg-gray-50 text-sm cursor-pointer">
              <option value="all">All Classes</option>
              {filterOptions.classes.filter(c=>c!=='all').map(cls=><option key={cls} value={cls}>Class {cls}</option>)}
            </select>
            <select value={selectedSubject} onChange={(e)=>setSelectedSubject(e.target.value)} className="px-3 py-1.5 rounded-full border bg-gray-50 text-sm cursor-pointer">
              <option value="all">All Subjects</option>
              {filterOptions.subjects.filter(s=>s!=='all').map(sub=><option key={sub} value={sub}>{sub}</option>)}
            </select>
            <select value={selectedPrice} onChange={(e)=>setSelectedPrice(e.target.value)} className="px-3 py-1.5 rounded-full border bg-gray-50 text-sm cursor-pointer">
              {filterOptions.prices.map(p=><option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
            {hasActiveFilters && <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-100 text-red-600 text-sm"><X className="w-4 h-4"/> Clear</button>}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {currentCourses.map(course => <CourseCard key={course._id} course={course} />)}
        </div>

        {/* No Courses */}
        {filteredCourses.length===0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4"/>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">কোন কোর্স পাওয়া যায়নি</h3>
            <p className="text-gray-600 mb-4">{hasActiveFilters ? 'আপনার ফিল্টারের সাথে মিলছে না। ফিল্টার পরিবর্তন করুন।' : 'বর্তমানে কোন কোর্স উপলব্ধ নেই।'}</p>
            {hasActiveFilters && <button onClick={clearFilters} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">সকল ফিল্টার ক্লিয়ার করুন</button>}
          </div>
        )}

        {/* Pagination */}
        {totalPages>1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-6">
            <div className="text-sm text-gray-600">দেখানো হচ্ছে {startIndex+1}-{Math.min(startIndex+itemsPerPage, filteredCourses.length)} এর মধ্যে {filteredCourses.length} টি</div>
            <div className="flex items-center gap-4">
              <select value={itemsPerPage} onChange={e=>setItemsPerPage(Number(e.target.value))} className="p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500">
                <option value={12}>১২ প্রতি পৃষ্ঠায়</option>
                <option value={24}>২৪ প্রতি পৃষ্ঠায়</option>
                <option value={36}>৩৬ প্রতি পৃষ্ঠায়</option>
              </select>
              <div className="flex items-center gap-2">
                <button onClick={prevPage} disabled={currentPage===1} className="p-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">
                  <ChevronLeft className="w-4 h-4"/>
                </button>
                <span className="text-sm text-gray-600 min-w-[100px] text-center">পৃষ্ঠা {currentPage} এর {totalPages}</span>
                <button onClick={nextPage} disabled={currentPage===totalPages} className="p-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">
                  <ChevronRight className="w-4 h-4"/>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
