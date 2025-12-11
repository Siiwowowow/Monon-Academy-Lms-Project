'use client';
import React, { useState, useEffect } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Correct import for Next.js 15 App Router
import useAuth from '@/hooks/useAuth';

export default function EnrolledCourses() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const router = useRouter();
  const currentUserEmail = user?.email;

  useEffect(() => {
    if (currentUserEmail) {
      fetchEnrolledCourses();
    } else {
      setLoading(false);
    }
  }, [currentUserEmail]);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user-courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail: currentUserEmail }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch enrolled courses');
      }

      const data = await response.json();
      setEnrolledCourses(data.courses || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching enrolled courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleContinueLearning = (courseId) => {
    router.push(`/courses/${courseId}/learn`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-lg">আপনার কোর্স লোড হচ্ছে...</div>
          <div className="mt-4 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-red-600 text-center">ত্রুটি: {error}</div>
          <div className="text-center mt-4">
            <button 
              onClick={fetchEnrolledCourses}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">আমার এনরোল্ড কোর্সসমূহ</h1>
          {/* <p className="text-gray-600 mt-2">
            {user.displayName || user.email}, আপনার শিক্ষা যাত্রা অব্যাহত রাখুন
          </p> */}
        </div>

        {/* Courses Grid */}
        {enrolledCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              আপনি এখনো কোন কোর্সে এনরোল করেননি।
            </div>
            <Link 
              href="/courses"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              কোর্স ব্রাউজ করুন
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <div key={course._id || course.courseId} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                  {/* Course Image */}
                  <div className="relative h-48 bg-gradient-to-br from-green-500 to-blue-600 overflow-hidden">
                    {course.thumbnail_url ? (
                      <Image
                        src={course.thumbnail_url} 
                        alt={course.courseTitle}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-white">
                        <div className="text-center p-4">
                          <div className="text-4xl mb-2">📚</div>
                          <div className="font-semibold text-lg">{course.courseTitle}</div>
                        </div>
                      </div>
                    )}
                    {/* Class & Group Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {course.class || 'এসএসসি'}
                      </span>
                    </div>
                    {/* Premium Badge */}
                    {course.premium && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          প্রিমিয়াম
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    {/* Subject & Group */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        {course.subject || course.courseTitle}
                      </span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                        {course.group || 'সাধারণ'}
                      </span>
                    </div>

                    {/* Course Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
                      {course.courseTitle}
                    </h3>
                    
                    {/* Instructor */}
                    <p className="text-gray-600 mb-3 flex items-center">
                      <span className="mr-2">👨‍🏫</span>
                      ইনস্ট্রাক্টর: {course.courseInstructor || course.instructor_name}
                    </p>

                    {/* Course Details */}
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      {course.paymentDate && (
                        <div className="flex items-center">
                          <span className="mr-2">📅</span>
                          এনরোলমেন্ট: {formatDate(course.paymentDate)}
                        </div>
                      )}
                      {course.amount && (
                        <div className="flex items-center">
                          <span className="mr-2">💰</span>
                          প্রদত্ত অর্থ: ৳{course.amount}
                        </div>
                      )}
                      {course.total_videos && (
                        <div className="flex items-center">
                          <span className="mr-2">🎬</span>
                          ভিডিও: {course.total_videos} টি
                        </div>
                      )}
                      {course.language && (
                        <div className="flex items-center">
                          <span className="mr-2">🌐</span>
                          ভাষা: {course.language}
                        </div>
                      )}
                      {course.rating && (
                        <div className="flex items-center">
                          <span className="mr-2">⭐</span>
                          রেটিং: {course.rating}/5
                        </div>
                      )}
                    </div>

                    {/* Short Description */}
                    {course.short_description && (
                      <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                        {course.short_description}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => handleContinueLearning(course.courseId)}
                        className="flex-1 bg-green-600 text-white text-center py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
                      >
                        <span className="mr-2">▶️</span>
                        শেখা শুরু করুন
                      </button>
                      <Link 
                        href={`/courses/${course.courseId}`}
                        className="bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                        title="কোর্স বিস্তারিত"
                      >
                        ℹ️
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}