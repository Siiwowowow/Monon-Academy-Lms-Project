"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { 
  FaBook, 
  FaQuestionCircle, 
  FaClock, 
  FaCalendar,
  FaArrowRight,
  FaGraduationCap,
  FaChalkboardTeacher
} from "react-icons/fa";

export default function ExamCard() {
  const axiosSecure = useAxiosSecure();

  // Fetch exams
  const { data: exams, isLoading, isError } = useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/exams");
      return res.data.exams;
    },
    onError: () => toast.error("Failed to load exams"),
  });

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (isError) return (
    <div className="text-center py-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <p className="text-red-600 font-medium">Error loading exams</p>
        <p className="text-red-500 text-sm mt-1">Please try again later</p>
      </div>
    </div>
  );
  
  if (!exams || exams.length === 0) return (
    <div className="text-center py-12">
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 max-w-md mx-auto">
        <FaBook className="text-4xl text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No exams found</h3>
        <p className="text-gray-500">Create your first exam to get started</p>
      </div>
    </div>
  );

  // Function to assign gradient based on subject
  const getSubjectGradient = (subject) => {
    switch (subject) {
      case "Bangla":
        return "from-red-500 to-pink-500";
      case "English":
        return "from-blue-500 to-cyan-500";
      case "Mathematics":
        return "from-green-500 to-emerald-500";
      case "ICT":
        return "from-yellow-500 to-orange-500";
      case "Science":
        return "from-purple-500 to-indigo-500";
      case "General Knowledge":
        return "from-pink-500 to-rose-500";
      case "Physics":
        return "from-indigo-500 to-blue-500";
      case "Chemistry":
        return "from-teal-500 to-green-500";
      case "Biology":
        return "from-lime-500 to-green-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  // Function to get subject icon
  const getSubjectIcon = (subject) => {
    switch (subject) {
      case "Bangla":
        return "📚";
      case "English":
        return "🔤";
      case "Mathematics":
        return "📐";
      case "ICT":
        return "💻";
      case "Science":
        return "🔬";
      case "Physics":
        return "⚛️";
      case "Chemistry":
        return "🧪";
      case "Biology":
        return "🧬";
      default:
        return "📖";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
      {exams.map((exam) => (
        <div 
          key={exam._id} 
          className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-100"
        >
          {/* Gradient Accent */}
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getSubjectGradient(exam.subject)}`}></div>
          
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${getSubjectGradient(exam.subject)} text-white shadow-md`}>
                  <span className="text-lg">{getSubjectIcon(exam.subject)}</span>
                </div>
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-opacity-10 bg-gradient-to-r ${getSubjectGradient(exam.subject)} text-gray-700`}>
                    <FaGraduationCap className="mr-1 text-xs" />
                    {exam.educationLevel || "SSC"}
                  </span>
                </div>
              </div>
              
              {/* Question Count Badge */}
              <div className="flex items-center space-x-1 bg-gray-50 rounded-full px-3 py-1">
                <FaQuestionCircle className="text-gray-400 text-xs" />
                <span className="text-sm font-semibold text-gray-700">{exam.questions?.length || 0}</span>
              </div>
            </div>

            {/* Exam Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {exam.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
              {exam.description || "No description provided"}
            </p>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FaClock className="text-blue-500" />
                <span>{exam.duration || 60} min</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FaBook className="text-green-500" />
                <span>{exam.totalMarks || exam.questions?.length || 0} marks</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FaChalkboardTeacher className="text-purple-500" />
                <span>{exam.examType || "Model Test"}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FaCalendar className="text-orange-500" />
                <span>{new Date(exam.createdAt).toLocaleDateString('en-BD')}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getSubjectGradient(exam.subject)}`}></div>
                <span className="text-sm font-medium text-gray-700">{exam.subject || "General"}</span>
              </div>
              
              <Link href={`/dashboard/teacher/exams/${exam._id}`}>
                <button className="flex items-center space-x-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg transition-all duration-200 group-hover:bg-blue-600 group-hover:text-white font-medium text-sm">
                  <span>View Details</span>
                  <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>

          {/* Hover Effect */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-2xl transition-all duration-300 pointer-events-none"></div>
        </div>
      ))}
    </div>
  );
}