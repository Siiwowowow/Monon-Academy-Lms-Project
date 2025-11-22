"use client";

import React, { useEffect, useState } from "react";
import { Star, PlayCircle, Clock, User, BookOpen, ArrowLeft, Video, CheckCircle } from "lucide-react";
import Link from "next/link";
import PaymentModal from "../PaymentModal";

export default function CourseDetails({ params }) {
  const { id } = params;
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("Course ID not found");
      setLoading(false);
      return;
    }

    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/courses/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Course not found");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const courseData = await response.json();
        setCourse(courseData);
      } catch (err) {
        console.error("❌ Failed to fetch course:", err);
        setError(err.message || "Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // Payment handlers
  const handleEnrollClick = () => {
    if (course.price === 0) {
      handleFreeEnrollment();
    } else {
      setShowPaymentModal(true);
    }
  };

  const handleFreeEnrollment = async () => {
    setProcessingPayment(true);
    try {
      const response = await fetch('/api/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: id,
          price: 0,
          paymentMethod: 'free'
        })
      });

      if (response.ok) {
        window.location.href = `/courses/${id}/learn`;
      } else {
        throw new Error('Enrollment failed');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('Enrollment failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handlePaymentMethodSelect = async (method) => {
    setProcessingPayment(true);
    try {
      if (method === 'stripe') {
        await handleStripePayment();
      } else if (method === 'sslcommerz') {
        await handleSSLCommerzPayment();
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessingPayment(false);
      setShowPaymentModal(false);
    }
  };

  const handleStripePayment = async () => {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: id,
          courseTitle: course.title,
          price: course.price,
          currency: 'bdt'
        })
      });

      const data = await response.json();

      if (data.clientSecret) {
        window.location.href = `/payment/stripe?client_secret=${data.clientSecret}&course_id=${id}`;
      }
    } catch (error) {
      throw error;
    }
  };

  const handleSSLCommerzPayment = async () => {
    try {
      const response = await fetch('/api/sslcommerz-init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: id,
          courseTitle: course.title,
          price: course.price,
          currency: 'BDT'
        })
      });

      const data = await response.json();

      if (data.GatewayPageURL) {
        window.location.href = data.GatewayPageURL;
      }
    } catch (error) {
      throw error;
    }
  };

  // Loading Component
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse">
          <Link href="/courses">
            <div className="h-6 bg-gray-300 rounded w-32 mb-6"></div>
          </Link>
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="h-80 bg-gray-300"></div>
            <div className="p-8">
              <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
              <div className="h-12 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Error Component
  const ErrorState = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="text-center max-w-md mx-4">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {error || "Course not found"}
        </h2>
        <p className="text-gray-600 mb-6">
          We couldn't find the course you're looking for. Please check the URL or browse our available courses.
        </p>
        <Link href="/courses">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
            Browse All Courses
          </button>
        </Link>
      </div>
    </div>
  );

  if (loading) return <LoadingSkeleton />;
  if (error || !course) return <ErrorState />;

  // Calculate total duration and lessons
  const totalDuration = course.curriculum?.reduce((total, chapter) => {
    return total + chapter.lessons.reduce((chapTotal, lesson) => {
      if (!lesson.video_duration) return chapTotal;
      
      const timeParts = lesson.video_duration.split(':');
      if (timeParts.length === 3) {
        // HH:MM:SS format
        const [hours, minutes, seconds] = timeParts.map(Number);
        return chapTotal + (hours * 3600 + minutes * 60 + seconds);
      } else if (timeParts.length === 2) {
        // MM:SS format
        const [minutes, seconds] = timeParts.map(Number);
        return chapTotal + (minutes * 60 + seconds);
      }
      return chapTotal;
    }, 0);
  }, 0) || 0;

  const totalLessons = course.curriculum?.reduce((total, chapter) => 
    total + (chapter.lessons?.length || 0), 0
  ) || 0;

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} ঘন্টা ${minutes} মিনিট`;
    }
    return `${minutes} মিনিট`;
  };

  // Tab Components
  const OverviewTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">কোর্স বিবরণ</h3>
        <p className="text-gray-700 leading-relaxed text-lg">
          {course.full_description || course.short_description || "কোন বিবরণ পাওয়া যায়নি।"}
        </p>
      </div>

      {course.curriculum && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">এই কোর্স থেকে যা শিখবেন</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {course.curriculum.map((chapter, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700">{chapter.chapter_title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const CurriculumTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">কোর্স কারিকুলাম</h3>
      <div className="space-y-4">
        {course.curriculum?.map((chapter, chapterIndex) => (
          <div key={chapterIndex} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h4 className="font-semibold text-gray-900">
                {chapter.chapter_number}. {chapter.chapter_title}
              </h4>
            </div>
            <div className="divide-y divide-gray-100">
              {chapter.lessons?.map((lesson, lessonIndex) => (
                <div key={lessonIndex} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Video className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">{lesson.lesson_title}</h5>
                        <p className="text-sm text-gray-500">{lesson.video_duration || "সময় উল্লেখ নেই"}</p>
                      </div>
                    </div>
                    <PlayCircle className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const InstructorTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">ইনস্ট্রাক্টর সম্পর্কে</h3>
      <div className="flex items-start gap-6">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {course.instructor_name?.charAt(0) || "I"}
        </div>
        <div className="flex-1">
          <h4 className="text-2xl font-bold text-gray-900 mb-2">{course.instructor_name || "ইনস্ট্রাক্টর"}</h4>
          <p className="text-gray-600 mb-4">
            অভিজ্ঞ শিক্ষক যিনি {course.subject || "এই বিষয়"} এ বিশেষজ্ঞ। সহজ ও বোধগম্য উপায়ে জটিল বিষয়গুলো শিক্ষার্থীদের কাছে উপস্থাপন করেন।
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>রেটিং: {course.rating || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>কোর্স: ১০+</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link href="/courses">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              সকল কোর্সে ফিরে যান
            </button>
          </Link>

          {/* Main Course Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 mb-8">
            {/* Thumbnail Section */}
            <div className="relative w-full h-80">
              <img
                src={course.thumbnail_url || "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop"}
                alt={course.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              {/* Price Badge */}
              <div className={`absolute top-4 left-4 ${
                course.price === 0 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600'
              } text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg`}>
                {course.price === 0 ? 'ফ্রি' : `৳ ${course.price}`}
              </div>

              {/* Rating Badge */}
              {course.rating && (
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{course.rating}</span>
                </div>
              )}

              {/* Course Info Overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {course.group || "গ্রুপ"}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {course.class || "ক্লাস"}
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {course.subject || "বিষয়"}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                  {course.title || "কোর্সের শিরোনাম"}
                </h1>
                <p className="text-white/90 text-lg drop-shadow">
                  {course.short_description || "কোর্সের সংক্ষিপ্ত বিবরণ"}
                </p>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8">
              {/* Course Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-gray-600 text-sm">ইনস্ট্রাক্টর</p>
                    <p className="text-gray-900 font-semibold">{course.instructor_name || "N/A"}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-gray-600 text-sm">মোট সময়</p>
                    <p className="text-gray-900 font-semibold">{formatDuration(totalDuration)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Video className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-gray-600 text-sm">ভিডিও লেসন</p>
                    <p className="text-gray-900 font-semibold">{totalLessons}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <BookOpen className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-gray-600 text-sm">ভাষা</p>
                    <p className="text-gray-900 font-semibold">{course.language || "বাংলা"}</p>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  {[
                    { id: "overview", label: "ওভারভিউ" },
                    { id: "curriculum", label: "কারিকুলাম" },
                    { id: "instructor", label: "ইনস্ট্রাক্টর" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="mb-8">
                {activeTab === "overview" && <OverviewTab />}
                {activeTab === "curriculum" && <CurriculumTab />}
                {activeTab === "instructor" && <InstructorTab />}
              </div>

              {/* Enroll Button */}
              <div className="mt-8">
                <button 
                  onClick={handleEnrollClick}
                  disabled={processingPayment}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PlayCircle className="w-6 h-6" />
                  {processingPayment ? 'প্রসেসিং...' : 
                    course.price === 0 ? 'ফ্রি কোর্সে এনরোল করুন' : `এনরোল করুন - ৳ ${course.price}`
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        course={course}
        onPaymentMethodSelect={handlePaymentMethodSelect}
        processingPayment={processingPayment}
      />
    </>
  );
}