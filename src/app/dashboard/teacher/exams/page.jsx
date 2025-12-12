"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import { 
  FiPlus, FiSearch, FiDownload, FiRefreshCw, FiEye, 
  FiEdit2, FiTrash2, FiClock, FiBook, FiBarChart2, 
  FiUsers, FiCheckCircle, FiMail, FiUser 
} from "react-icons/fi";
import { MdOutlineQuiz, MdOutlineScore, MdAccessTime } from "react-icons/md";

export default function TeacherExamsPage() {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    subject: "all",
    sortBy: "newest"
  });
  const [deletingId, setDeletingId] = useState(null);

  // Fetch exams for the logged-in teacher only
  useEffect(() => {
    if (user?.email) {
      fetchTeacherExams();
    } else {
      toast.error("Please login to view your exams");
      setLoading(false);
    }
  }, [user]);

  const fetchTeacherExams = async () => {
    try {
      setLoading(true);
      // Pass teacher's email to filter their exams only
      const res = await fetch(`/api/tests/mcq?email=${user.email}`);
      const data = await res.json();

      if (data.success) {
        // Double check that we're only getting this teacher's exams
        const teacherExams = data.exams.filter(exam => 
          exam.instructorEmail === user.email
        );
        setExams(teacherExams);
        
        if (teacherExams.length === 0) {
          toast.info("You haven't created any exams yet. Create your first exam!");
        }
      } else {
        toast.error("Failed to fetch your exams");
        setExams([]);
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
      toast.error("Error loading your exams");
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete exam (only for this teacher's exams)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/tests/mcq/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        toast.success("Exam deleted successfully");
        setExams(prev => prev.filter(exam => exam._id !== id));
      } else {
        toast.error(data.message || "Failed to delete exam");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Something went wrong!");
    } finally {
      setDeletingId(null);
    }
  };

  // Get unique subjects for filter (from this teacher's exams only)
  const subjects = ["all", ...new Set(exams.map(exam => exam.subject).filter(Boolean))];

  // Calculate stats for this teacher only
  const calculateStats = () => ({
    totalExams: exams.length,
    totalQuestions: exams.reduce((sum, exam) => sum + (exam.questions?.length || 0), 0),
    totalMarks: exams.reduce((sum, exam) => sum + (parseInt(exam.totalMarks) || 0), 0),
    activeExams: exams.filter(exam => exam.isActive !== false).length
  });

  // Filter and sort exams (only this teacher's exams)
  const getFilteredExams = () => {
    return exams
      .filter(exam => {
        // Verify it's the teacher's exam (extra safety check)
        if (exam.instructorEmail !== user?.email) {
          return false;
        }
        
        if (filters.search && !exam.examTitle.toLowerCase().includes(filters.search.toLowerCase())) {
          return false;
        }
        if (filters.subject !== "all" && exam.subject !== filters.subject) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case "newest":
            return new Date(b.createdAt) - new Date(a.createdAt);
          case "oldest":
            return new Date(a.createdAt) - new Date(b.createdAt);
          case "title":
            return a.examTitle.localeCompare(b.examTitle);
          case "duration":
            return parseInt(b.duration) - parseInt(a.duration);
          default:
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
      });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  // Stats calculation
  const stats = calculateStats();
  const filteredExams = getFilteredExams();

  // Loading state
  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiUser className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    My Exams Dashboard
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <FiMail className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-600 text-sm">{user?.email}</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 ml-14">Create, manage, and track your multiple choice exams</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchTeacherExams}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
              >
                <FiRefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <Link
                href="/dashboard/teacher/create-exam_mcq"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                Create New Exam
              </Link>
            </div>
          </div>

          {/* Teacher's Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon={<MdOutlineQuiz className="w-6 h-6 text-blue-600" />}
              title="My Exams"
              value={stats.totalExams}
              color="blue"
              subtitle="Created by you"
            />
            <StatCard
              icon={<FiBarChart2 className="w-6 h-6 text-green-600" />}
              title="My Questions"
              value={stats.totalQuestions}
              color="green"
              subtitle="Total questions"
            />
            <StatCard
              icon={<MdOutlineScore className="w-6 h-6 text-purple-600" />}
              title="Total Marks"
              value={stats.totalMarks}
              color="purple"
              subtitle="Across all exams"
            />
            <StatCard
              icon={<FiUsers className="w-6 h-6 text-orange-600" />}
              title="Active Exams"
              value={stats.activeExams}
              color="orange"
              subtitle="Currently active"
            />
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-5 rounded-xl shadow-sm border mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <SearchInput 
              value={filters.search}
              onChange={(value) => setFilters(prev => ({ ...prev, search: value }))}
              placeholder="Search your exams by title..."
            />
            <SelectFilter
              label="Subject"
              value={filters.subject}
              options={subjects}
              onChange={(value) => setFilters(prev => ({ ...prev, subject: value }))}
            />
            <SelectFilter
              label="Sort By"
              value={filters.sortBy}
              options={[
                { value: "newest", label: "Newest First" },
                { value: "oldest", label: "Oldest First" },
                { value: "title", label: "Title A-Z" },
                { value: "duration", label: "Longest Duration" },
                { value: "marks", label: "Highest Marks" }
              ]}
              onChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
            />
          </div>
        </div>

        {/* Exams List */}
        {filteredExams.length === 0 ? (
          <EmptyState 
            hasExams={exams.length > 0} 
            teacherName={user?.name || "Teacher"} 
          />
        ) : (
          <>
            {/* Results Summary */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div className="text-gray-700">
                  <span className="font-semibold">{filteredExams.length}</span> of{" "}
                  <span className="font-semibold">{exams.length}</span> exams created by you
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiUser className="w-4 h-4" />
                  <span>Showing only your exams</span>
                </div>
              </div>
            </div>

            {/* Exams Grid - Only this teacher's exams */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredExams.map((exam) => (
                <ExamCard
                  key={exam._id}
                  exam={exam}
                  onDelete={handleDelete}
                  deletingId={deletingId}
                  formatDate={formatDate}
                  currentUserEmail={user?.email}
                />
              ))}
            </div>

            {/* Summary Footer */}
            <div className="mt-8 pt-6 border-t">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-gray-600">
                  Showing <span className="font-semibold">{filteredExams.length}</span> of your{" "}
                  <span className="font-semibold">{exams.length}</span> exams
                </div>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                    <FiDownload className="w-4 h-4" />
                    Export My Exams
                  </button>
                  <Link
                    href="/dashboard/teacher/create-exam_mcq"
                    className="flex items-center gap-2 text-green-600 hover:text-green-700"
                  >
                    <FiPlus className="w-4 h-4" />
                    Add Another Exam
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ========== Helper Components ==========

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-12 bg-gray-300 rounded"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color, subtitle }) {
  const colorClasses = {
    blue: "bg-blue-100",
    green: "bg-green-100",
    purple: "bg-purple-100",
    orange: "bg-orange-100"
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border">
      <div className="flex items-center gap-4">
        <div className={`p-3 ${colorClasses[color]} rounded-lg`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="flex-1">
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>
    </div>
  );
}

function SelectFilter({ label, value, options, onChange }) {
  const isArray = Array.isArray(options) && options.length > 0 && typeof options[0] === 'string';
  
  return (
    <div className="flex-1">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      >
        <option value="all">All {label}s</option>
        {isArray
          ? options.filter(opt => opt !== "all").map(option => (
              <option key={option} value={option}>{option}</option>
            ))
          : options.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))
        }
      </select>
    </div>
  );
}

function EmptyState({ hasExams, teacherName }) {
  return (
    <div className="bg-white rounded-xl border-2 border-dashed p-12 text-center">
      <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
        <FiUser className="w-10 h-10 text-blue-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        {hasExams ? "No matching exams found" : `Welcome, ${teacherName}!`}
      </h3>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        {hasExams
          ? "Try adjusting your search or filter criteria to find what you're looking for."
          : "You haven't created any exams yet. Start by creating your first multiple choice exam for your students."}
      </p>
      <Link
        href="/dashboard/teacher/create-exam_mcq"
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
      >
        <FiPlus className="w-5 h-5" />
        Create Your First Exam
      </Link>
    </div>
  );
}

function ExamCard({ exam, onDelete, deletingId, formatDate, currentUserEmail }) {
  // Double check this exam belongs to the current teacher
  const isMyExam = exam.instructorEmail === currentUserEmail;
  
  if (!isMyExam) {
    return null; // Don't show other teachers' exams
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 overflow-hidden group">
      {/* Exam Header with Teacher Badge */}
      <div className="p-5 border-b">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
              {exam.examTitle}
            </h3>
            
            {/* Badges - Highlight this is YOUR exam */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                <FiBook className="w-3 h-3" />
                {exam.subject || "No Subject"}
              </span>
              {exam.isActive !== false && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  <FiCheckCircle className="w-3 h-3" />
                  Active
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                <FiUser className="w-3 h-3" />
                Your Exam
              </span>
            </div>
          </div>
        </div>
        
        {/* Instructor Info */}
        <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
          <FiUser className="w-3 h-3" />
          <span>Created by: <span className="font-medium">{exam.instructorName || "You"}</span></span>
          <span className="mx-2">•</span>
          <FiMail className="w-3 h-3" />
          <span className="truncate">{exam.instructorEmail}</span>
        </div>
        
        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mt-2">
          {exam.instructions || "No instructions provided"}
        </p>
      </div>

      {/* Exam Stats */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatItem
            icon={<MdOutlineScore className="w-4 h-4 text-blue-600" />}
            label="Marks"
            value={exam.totalMarks || 0}
          />
          <StatItem
            icon={<MdOutlineQuiz className="w-4 h-4 text-green-600" />}
            label="Questions"
            value={exam.questions?.length || 0}
          />
          <StatItem
            icon={<MdAccessTime className="w-4 h-4 text-orange-600" />}
            label="Duration"
            value={`${exam.duration || 0} min`}
          />
          <StatItem
            icon={<FiClock className="w-4 h-4 text-purple-600" />}
            label="Passing"
            value={exam.passingMarks || 0}
          />
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Created: {formatDate(exam.createdAt)}</span>
          {exam.attempts > 0 && (
            <span className="flex items-center gap-1">
              <FiUsers className="w-3 h-3" />
              {exam.attempts} attempts
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons - Only show for your exams */}
      <div className="px-5 pb-5">
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/teacher/exams/${exam._id}`}
            className="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <FiEye className="w-4 h-4" />
            View Details
          </Link>
          <Link
            href={`/dashboard/teacher/edit-exam/${exam._id}`}
            className="flex-1 px-4 py-2 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
          >
            <FiEdit2 className="w-4 h-4" />
            Edit
          </Link>
          <button
            onClick={() => onDelete(exam._id)}
            disabled={deletingId === exam._id}
            className="flex-1 px-4 py-2 bg-red-600 text-white text-center rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiTrash2 className="w-4 h-4" />
            {deletingId === exam._id ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <div className="p-2 bg-gray-50 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}