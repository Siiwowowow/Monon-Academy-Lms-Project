"use client";

import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Clock,
  User,
  CheckCircle,
  Star,
  Users,
  PlayCircle,
  Download,
  Share2,
  Heart,
  BarChart3,
  Award,
  Target,
} from "lucide-react";
import EnrollModalClient from "./EnrollModalClient";
import useAxiosSecure from "@/hooks/useAxiosSecure";

export default function CourseDetails({ params }) {
  const { id } = params;
  const axiosSecure = useAxiosSecure();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch course details
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading course details...
      </div>
    );
  }

  // Error state
  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold">
        {error || "Course not found"}
      </div>
    );
  }

  // Mock stats (you can replace these with dynamic data if needed)
  const stats = {
    rating: 4.8,
    students: 1250,
    projects: 15,
    certificate: true,
  };

  const features = [
    { icon: PlayCircle, text: "Video Lessons", count: course.total_lessons },
    { icon: Download, text: "Downloadable Resources", count: "20+" },
    { icon: Award, text: "Certificate", count: "Yes" },
    { icon: Users, text: "Community Access", count: "Lifetime" },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 blur-3xl -z-10" />
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-bounce"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-bounce delay-1000"></div>

      <div className="max-w-6xl mx-auto">
        {/* Main Course Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/30 mb-8">
          {/* Thumbnail */}
          <div className="relative w-full h-72 md:h-96 group">
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Price */}
            <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
              <span>৳ {course.price}</span>
              {course.original_price && (
                <span className="text-xs line-through opacity-70">৳ {course.original_price}</span>
              )}
            </div>

            {/* Rating */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{stats.rating}</span>
              <span className="text-gray-500">({stats.students})</span>
            </div>

            {/* Title */}
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                {course.title}
              </h1>
              <p className="text-white/90 text-sm md:text-base drop-shadow-lg">
                {course.short_description}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    <Target className="w-4 h-4" />
                    <span>Popular</span>
                  </div>
                  <div className="flex items-center gap-1 text-orange-600">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-orange-500" />
                    ))}
                    <span className="text-sm ml-1 text-gray-600">({stats.rating})</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <EnrollModalClient course={course} />
                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300 hover:shadow-md">
                  <Heart className="w-4 h-4" />
                  Wishlist
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300 hover:shadow-md">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all duration-300 hover:shadow-md">
                  <PlayCircle className="w-4 h-4" />
                  Preview
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{feature.text}</p>
                      <p className="font-semibold text-gray-900">{feature.count}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Instructor / Duration / Lessons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <InfoCard
                color="blue"
                icon={User}
                title="Instructor"
                value={course.instructor_name}
                subtitle="Expert Mentor"
              />
              <InfoCard
                color="purple"
                icon={Clock}
                title="Duration"
                value={course.video_duration}
                subtitle="Self-paced"
              />
              <InfoCard
                color="pink"
                icon={BookOpen}
                title="Lessons"
                value={course.total_lessons}
                subtitle="Hands-on Projects"
              />
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 mb-8 shadow-sm border border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <Stat label="Happy Students" value={`${stats.students}+`} />
                <Stat label="Course Rating" value={stats.rating} />
                <Stat label="Real Projects" value={stats.projects} />
                <Stat label="Certificate" value={stats.certificate ? "Yes" : "No"} />
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Course Overview</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                {course.full_description}
              </p>

              <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-200">
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <Download className="w-4 h-4" />
                  Download Syllabus
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <Users className="w-4 h-4" />
                  Join Community
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white shadow-2xl">
          <h3 className="text-2xl font-bold mb-4">Ready to Start Your Learning Journey?</h3>
          <p className="text-blue-100 mb-6 text-lg">
            Join {stats.students}+ students who have already transformed their skills
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <EnrollModalClient course={course} />
            <button className="px-6 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300">
              Schedule a Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function InfoCard({ color, icon: Icon, title, value, subtitle }) {
  const colorMap = {
    blue: "from-blue-50 to-blue-100 border-blue-200 bg-blue-500 text-blue-600",
    purple: "from-purple-50 to-purple-100 border-purple-200 bg-purple-500 text-purple-600",
    pink: "from-pink-50 to-pink-100 border-pink-200 bg-pink-500 text-pink-600",
  };
  return (
    <div
      className={`bg-gradient-to-br ${colorMap[color].split(" ")[0]} ${colorMap[color].split(" ")[1]} rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border ${colorMap[color].split(" ")[2]}`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 ${colorMap[color].split(" ")[3]} rounded-xl`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className={`text-sm ${colorMap[color].split(" ")[4]} font-medium`}>{title}</p>
          <p className="text-lg font-bold text-gray-900">{value || "N/A"}</p>
          <p className={`text-sm ${colorMap[color].split(" ")[4]}`}>{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}
