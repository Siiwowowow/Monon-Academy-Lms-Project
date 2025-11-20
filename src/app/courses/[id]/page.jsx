"use client";

import React, { useEffect, useState } from "react";
import { Star, PlayCircle, Clock, User, BookOpen } from "lucide-react";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import Link from "next/link";

export default function CourseDetails({ params }) {
  const { id } = params;
  const axiosSecure = useAxiosSecure();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchCourse = async () => {
      try {
        const res = await axiosSecure.get(`/api/courses/${id}`);
        setCourse(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch course:", err);
        setError("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, axiosSecure]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
        Loading course details...
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || "Course not found"}
          </h2>
          <Link href="/courses">
            <button className="btn btn-primary mt-4">
              Browse All Courses
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Course Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 mb-6">
          {/* Thumbnail */}
          <div className="relative w-full h-80">
            <img
              src={course.thumbnail_url || "/api/placeholder/400/300"}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            {/* Price */}
            <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              ৳ {course.price || "Free"}
            </div>

            {/* Rating */}
            {course.rating && (
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{course.rating}</span>
              </div>
            )}

            {/* Overlay Title */}
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                {course.title}
              </h1>
              <p className="text-white/90 text-lg drop-shadow">
                {course.short_description}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Course Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-gray-600 text-sm">Instructor</p>
                  <p className="text-gray-900 font-semibold">{course.instructor_name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-gray-600 text-sm">Duration</p>
                  <p className="text-gray-900 font-semibold">{course.video_duration}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-gray-600 text-sm">Lessons</p>
                  <p className="text-gray-900 font-semibold">{course.total_lessons}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {course.description && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Course Description</h3>
                <p className="text-gray-700 leading-relaxed">{course.description}</p>
              </div>
            )}

            {/* What You'll Learn */}
            {course.learning_outcomes && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">What You'll Learn</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {course.learning_outcomes.map((outcome, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700">
                      <PlayCircle className="w-4 h-4 text-green-500" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Enroll Button */}
            <div className="mt-8">
              <Link href={`/courses/${id}/learn`}>
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                  <PlayCircle className="w-5 h-5" />
                  Enroll Now - ৳ {course.price || "Free"}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}