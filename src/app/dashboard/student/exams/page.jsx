"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { 
  FiSearch, FiFilter, FiCalendar, FiClock, FiBook, 
  FiBarChart2, FiUsers, FiCheckCircle, FiPlay,
  FiChevronRight, FiInfo, FiXCircle,
  FiRefreshCw, FiUser, FiEye, FiHash, FiAward,
  FiTrendingUp, FiLock, FiUnlock
} from "react-icons/fi";
import { MdOutlineQuiz, MdOutlineScore, MdAccessTime } from "react-icons/md";

export default function StudentExamsPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    subject: "all",
    status: "all"
  });

  useEffect(() => {
    fetchAllExams();
  }, []);

  const fetchAllExams = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/tests/mcq`);
      const data = await res.json();

      if (data.success) {
        setExams(data.exams || []);
        toast.success(`Loaded ${data.exams?.length || 0} exams`);
      } else {
        toast.error("Failed to fetch exams");
        setExams([]);
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
      toast.error("Error loading exams");
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredExams = () => {
    return exams
      .filter(exam => {
        if (filters.search && !exam.examTitle.toLowerCase().includes(filters.search.toLowerCase())) {
          return false;
        }
        if (filters.subject !== "all" && exam.subject !== filters.subject) {
          return false;
        }
        if (filters.status === "active" && exam.isActive !== true) {
          return false;
        }
        if (filters.status === "inactive" && exam.isActive !== false) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (a.isActive === b.isActive) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return a.isActive ? -1 : 1;
      });
  };

  const subjects = ["all", ...new Set(exams.map(exam => exam.subject).filter(Boolean))];
  const filteredExams = getFilteredExams();

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Compact Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                <MdOutlineQuiz className="text-blue-600" />
                Available Exams
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {exams.length} total exams • {subjects.length - 1} subjects
              </p>
            </div>
            <button
              onClick={fetchAllExams}
              className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-sm shadow-sm"
            >
              <FiRefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Compact Filters */}
        <div className="bg-white rounded-lg border shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search exams..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="relative w-40">
                <FiBook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                <select
                  value={filters.subject}
                  onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="all">All Subjects</option>
                  {subjects.filter(s => s !== "all").map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              
              <div className="relative w-40">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Active Filter Tags */}
          {(filters.search || filters.subject !== "all" || filters.status !== "all") && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
              <span className="text-xs text-gray-500">Filters:</span>
              {filters.search && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  Search: {filters.search}
                </span>
              )}
              {filters.subject !== "all" && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  {filters.subject}
                </span>
              )}
              {filters.status !== "all" && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                  {filters.status}
                </span>
              )}
              <button
                onClick={() => setFilters({ search: "", subject: "all", status: "all" })}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        {filteredExams.length > 0 && (
          <div className="text-sm text-gray-600 mb-4">
            Showing <span className="font-semibold">{filteredExams.length}</span> exams
            {filters.search && ` for "${filters.search}"`}
          </div>
        )}

        {/* Exams Grid - More Compact */}
        {filteredExams.length === 0 ? (
          <EmptyState hasExams={exams.length > 0} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredExams.map((exam) => (
              <CompactExamCard
                key={exam._id}
                exam={exam}
              />
            ))}
          </div>
        )}

        {/* Quick Stats Footer */}
        {filteredExams.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Active: {exams.filter(e => e.isActive === true).length}
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                Inactive: {exams.filter(e => e.isActive === false).length}
              </span>
              <span className="flex items-center gap-1">
                <FiHash className="w-3 h-3" />
                Questions: {exams.reduce((sum, exam) => sum + (exam.questions?.length || 0), 0)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ========== COMPACT EXAM CARD ==========

function CompactExamCard({ exam }) {
  const isActive = exam.isActive !== false;
  const questionCount = exam.questions?.length || 0;
  const duration = exam.duration || 0;
  const totalMarks = exam.totalMarks || 0;
  const passingMarks = exam.passingMarks || 0;
  const passPercentage = totalMarks ? Math.round((passingMarks / totalMarks) * 100) : 0;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays/7)}w ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full">
      {/* Status Badge - Top Right */}
      <div className="absolute top-3 right-3 z-10">
        {isActive ? (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
            <FiCheckCircle className="w-3 h-3" />
            Active
          </span>
        ) : (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center gap-1">
            <FiLock className="w-3 h-3" />
            Inactive
          </span>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        {/* Subject & Date */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {exam.subject || "General"}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(exam.createdAt)}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-800 text-base line-clamp-2 mb-2 h-10">
          {exam.examTitle}
        </h3>

        {/* Instructor */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <FiUser className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{exam.instructorName || "Unknown Instructor"}</span>
        </div>

        {/* Quick Stats - Compact Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <MdOutlineQuiz className="w-4 h-4 text-gray-400" />
            <div>
              <div className="font-semibold">{questionCount}</div>
              <div className="text-xs text-gray-500">Questions</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <FiClock className="w-4 h-4 text-gray-400" />
            <div>
              <div className="font-semibold">{duration}m</div>
              <div className="text-xs text-gray-500">Duration</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <FiAward className="w-4 h-4 text-gray-400" />
            <div>
              <div className="font-semibold">{totalMarks}</div>
              <div className="text-xs text-gray-500">Total Marks</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <FiTrendingUp className="w-4 h-4 text-gray-400" />
            <div>
              <div className="font-semibold">{passPercentage}%</div>
              <div className="text-xs text-gray-500">Pass %</div>
            </div>
          </div>
        </div>

        {/* Difficulty & Additional Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          {exam.difficulty && (
            <span className={`px-2 py-1 rounded ${
              exam.difficulty.toLowerCase() === 'easy' ? 'bg-green-100 text-green-700' :
              exam.difficulty.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {exam.difficulty}
            </span>
          )}
          
          {exam.attempts > 0 && (
            <span className="flex items-center gap-1">
              <FiUsers className="w-3 h-3" />
              {exam.attempts} attempts
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto space-y-2">
          {isActive ? (
            <>
              <Link
                href={`/dashboard/student/exams/take/${exam._id}`}
                className="block w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition flex items-center justify-center gap-2"
              >
                <FiPlay className="w-4 h-4" />
                Start Exam
                <FiChevronRight className="w-3 h-3" />
              </Link>
              
              <Link
                href={`/dashboard/student/exams/${exam._id}`}
                className="block w-full px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition flex items-center justify-center gap-2"
              >
                <FiInfo className="w-3 h-3" />
                View Details
              </Link>
            </>
          ) : (
            <div className="space-y-2">
              <div className="text-center text-xs text-gray-500 px-3 py-2 bg-gray-50 rounded-lg">
                This exam is currently unavailable
              </div>
              <Link
                href={`/dashboard/student/exams/${exam._id}`}
                className="block w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition flex items-center justify-center gap-2 border border-gray-300"
              >
                <FiEye className="w-3 h-3" />
                Preview Details
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ========== LOADING SKELETON ==========

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="h-10 bg-gray-300 rounded w-24"></div>
          </div>
          
          {/* Filters */}
          <div className="h-16 bg-gray-200 rounded-lg mb-6"></div>
          
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-xl border p-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="h-5 bg-gray-200 rounded w-20"></div>
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map(j => (
                      <div key={j} className="h-12 bg-gray-100 rounded"></div>
                    ))}
                  </div>
                  <div className="h-10 bg-gray-300 rounded mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== EMPTY STATE ==========

function EmptyState({ hasExams }) {
  return (
    <div className="bg-white rounded-xl border-2 border-dashed p-8 text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <FiSearch className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        {hasExams ? "No matching exams found" : "No exams available"}
      </h3>
      <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
        {hasExams
          ? "Try adjusting your search criteria or filters to find what you're looking for."
          : "Check back later or contact your instructor for available exams."}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
      >
        <FiRefreshCw className="w-4 h-4" />
        Refresh
      </button>
    </div>
  );
}