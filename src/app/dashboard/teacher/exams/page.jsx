"use client";
import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useAuth from "@/hooks/useAuth";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FaBook, 
  FaQuestionCircle, 
  FaClock, 
  FaCalendar,
  FaArrowRight,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaEdit,
  FaTrash,
  FaEye,
  FaPlus
} from "react-icons/fa";

export default function ExamCard() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const router = useRouter();

  // Fetch exams for current logged-in teacher
  const { 
    data: exams, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ["exams", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/exams?teacherEmail=${user?.email}`);
      return res.data.exams;
    },
    enabled: !!user?.email,
    onError: () => toast.error("Failed to load exams"),
  });

  // Delete exam mutation
  const deleteExamMutation = useMutation({
    mutationFn: async (examId) => {
      const res = await axiosSecure.delete(`/api/exams/${examId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Exam deleted successfully!");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete exam: ${error.response?.data?.message || error.message}`);
    },
  });

  const handleDeleteExam = (examId, examTitle) => {
    if (window.confirm(`Are you sure you want to delete "${examTitle}"? This action cannot be undone.`)) {
      deleteExamMutation.mutate(examId);
    }
  };

  const handleEditExam = (examId) => {
    router.push(`/dashboard/teacher/edit-exam/${examId}`);
  };

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
        <p className="text-gray-500 mb-4">Create your first exam to get started</p>
        <Link href="/dashboard/teacher/create-exam">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto">
            <FaPlus className="text-sm" />
            Create First Exam
          </button>
        </Link>
      </div>
    </div>
  );

  // Function to assign gradient based on subject
  const getSubjectGradient = (subject) => {
    switch (subject) {
      case "Bangla":
      case "Bangla 1st Paper":
      case "Bangla 2nd Paper":
        return "from-red-500 to-pink-500";
      case "English":
      case "English 1st Paper":
      case "English 2nd Paper":
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
      case "Computer Science":
        return "from-purple-500 to-pink-500";
      case "Electrical Engineering":
        return "from-orange-500 to-red-500";
      case "Business Administration":
        return "from-blue-500 to-indigo-500";
      case "Economics":
        return "from-green-500 to-blue-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  // Function to get subject icon
  const getSubjectIcon = (subject) => {
    switch (subject) {
      case "Bangla":
      case "Bangla 1st Paper":
      case "Bangla 2nd Paper":
        return "📚";
      case "English":
      case "English 1st Paper":
      case "English 2nd Paper":
        return "🔤";
      case "Mathematics":
        return "📐";
      case "ICT":
      case "Computer Science":
        return "💻";
      case "Science":
        return "🔬";
      case "Physics":
        return "⚛️";
      case "Chemistry":
        return "🧪";
      case "Biology":
        return "🧬";
      case "Electrical Engineering":
        return "⚡";
      case "Business Administration":
        return "💼";
      case "Economics":
        return "📈";
      default:
        return "📖";
    }
  };

  // Calculate total marks for an exam
  const calculateTotalMarks = (exam) => {
    if (exam.totalMarks) return exam.totalMarks;
    if (exam.questions && exam.questions.length > 0) {
      return exam.questions.reduce((total, question) => total + (question.marks || 1), 0);
    }
    return 0;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Exams</h1>
          <p className="text-gray-600">Manage your created exams</p>
        </div>
        <Link href="/dashboard/teacher/create-exam">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <FaPlus className="text-sm" />
            Create New Exam
          </button>
        </Link>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                  <span>{calculateTotalMarks(exam)} marks</span>
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

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getSubjectGradient(exam.subject)}`}></div>
                  <span className="text-sm font-medium text-gray-700">{exam.subject || "General"}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* View Button */}
                  <Link href={`/dashboard/teacher/exams/${exam._id}`}>
                    <button 
                      className="flex items-center space-x-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
                      title="View Exam"
                    >
                      <FaEye className="text-xs" />
                    </button>
                  </Link>

                  {/* Edit Button */}
                  <button
                    onClick={() => handleEditExam(exam._id)}
                    className="flex items-center space-x-1 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
                    title="Edit Exam"
                  >
                    <FaEdit className="text-xs" />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteExam(exam._id, exam.title)}
                    disabled={deleteExamMutation.isLoading}
                    className="flex items-center space-x-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium disabled:opacity-50"
                    title="Delete Exam"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-2xl transition-all duration-300 pointer-events-none"></div>
          </div>
        ))}
      </div>

      {/* Stats */}
      
    </div>
  );
}