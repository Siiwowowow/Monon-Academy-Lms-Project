"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { 
  FiSearch, FiFilter, FiCalendar, FiClock, FiBook, 
  FiBarChart2, FiUsers, FiCheckCircle, FiPlay,
  FiChevronRight, FiInfo, FiXCircle,
  FiRefreshCw, FiUser, FiEye
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

  // Fetch ALL exams
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

  // Filter exams
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

  // Get unique subjects
  const subjects = ["all", ...new Set(exams.map(exam => exam.subject).filter(Boolean))];

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  // Calculate stats
  const stats = {
    totalExams: exams.length,
    activeExams: exams.filter(exam => exam.isActive === true).length,
    inactiveExams: exams.filter(exam => exam.isActive === false).length,
    totalQuestions: exams.reduce((sum, exam) => sum + (exam.questions?.length || 0), 0),
    availableSubjects: subjects.length - 1
  };

  const filteredExams = getFilteredExams();

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <Header 
          onRefresh={fetchAllExams}
          totalExams={exams.length}
        />
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<MdOutlineQuiz className="w-6 h-6 text-blue-600" />}
            title="Total Exams"
            value={stats.totalExams}
            color="blue"
            subtitle="All exams"
          />
          <StatCard
            icon={<FiCheckCircle className="w-6 h-6 text-green-600" />}
            title="Active Exams"
            value={stats.activeExams}
            color="green"
            subtitle="Ready to take"
          />
          <StatCard
            icon={<FiXCircle className="w-6 h-6 text-orange-600" />}
            title="Inactive Exams"
            value={stats.inactiveExams}
            color="orange"
            subtitle="Not available"
          />
          <StatCard
            icon={<FiBarChart2 className="w-6 h-6 text-purple-600" />}
            title="Total Questions"
            value={stats.totalQuestions}
            color="purple"
            subtitle="Across all exams"
          />
        </div>

        {/* Filters */}
        <FilterSection 
          filters={filters}
          setFilters={setFilters}
          subjects={subjects}
        />

        {/* Exams List */}
        {filteredExams.length === 0 ? (
          <EmptyState hasExams={exams.length > 0} />
        ) : (
          <>
            {/* Results Summary */}
            <ResultsSummary 
              filteredExams={filteredExams}
              exams={exams}
              stats={stats}
              filters={filters}
            />

            {/* Exams Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredExams.map((exam) => (
                <StudentExamCard
                  key={exam._id}
                  exam={exam}
                  formatDate={formatDate}
                />
              ))}
            </div>

            {/* Summary Footer */}
            <SummaryFooter 
              filteredExams={filteredExams}
              filters={filters}
            />
          </>
        )}
      </div>
    </div>
  );
}

// ========== Reusable Components ==========

function Header({ onRefresh, totalExams }) {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            All Available Exams
          </h1>
          <p className="text-gray-600 mt-1">
            Browse all exams created by your instructors
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
          >
            <FiRefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <div className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            {totalExams} total exams
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterSection({ filters, setFilters, subjects }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search exams by title, instructor, or subject..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </div>
        
        {/* Subject Filter */}
        <div className="flex-1">
          <div className="relative">
            <FiBook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filters.subject}
              onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
            >
              <option value="all">All Subjects</option>
              {subjects.filter(s => s !== "all").map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Status Filter */}
        <div className="flex-1">
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Filter Summary */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-600">
        <span className="font-medium">Filters:</span>
        {filters.search && (
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            Search: "{filters.search}"
          </span>
        )}
        {filters.subject !== "all" && (
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
            Subject: {filters.subject}
          </span>
        )}
        {filters.status !== "all" && (
          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
            Status: {filters.status}
          </span>
        )}
      </div>
    </div>
  );
}

function ResultsSummary({ filteredExams, exams, stats, filters }) {
  return (
    <div className="mb-6 bg-white p-4 rounded-lg border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-gray-700">
          <span className="font-semibold">{filteredExams.length}</span> of{" "}
          <span className="font-semibold">{exams.length}</span> exams
          {filters.status !== "all" && ` (${filters.status} only)`}
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Active ({stats.activeExams})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span>Inactive ({stats.inactiveExams})</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryFooter({ filteredExams, filters }) {
  return (
    <div className="mt-8 pt-6 border-t">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-gray-600">
          Showing <span className="font-semibold">{filteredExams.length}</span> exams
          {filters.search && ` matching "${filters.search}"`}
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <FiEye className="w-4 h-4" />
            View All Details
          </button>
        </div>
      </div>
    </div>
  );
}

// ========== Consistent Exam Card Component ==========

function StudentExamCard({ exam, formatDate }) {
  const isActive = exam.isActive !== false;
  
  // Calculate values
  const calculatePassPercentage = () => {
    if (!exam.totalMarks || !exam.passingMarks) return 0;
    return Math.round((exam.passingMarks / exam.totalMarks) * 100);
  };

  const timePerQuestion = exam.questions?.length ? 
    Math.round(exam.duration / exam.questions.length) : 0;

  const totalMarks = exam.totalMarks || 0;
  const passingMarks = exam.passingMarks || 0;
  const duration = exam.duration || 0;
  const questionCount = exam.questions?.length || 0;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      
      {/* Status Header - Fixed Height */}
      <div className={`px-4 py-3 ${isActive ? 'bg-green-50 border-b border-green-100' : 'bg-gray-100 border-b border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isActive ? (
              <>
                <FiCheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-sm font-medium text-green-700 truncate">Active & Available</span>
              </>
            ) : (
              <>
                <FiXCircle className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-600 truncate">Currently Inactive</span>
              </>
            )}
          </div>
          <div className="text-xs text-gray-500 whitespace-nowrap">
            {formatDate(exam.createdAt)}
          </div>
        </div>
      </div>

      {/* Main Content - Fixed Structure */}
      <div className="p-5 flex-1 flex flex-col">
        
        {/* Title and Badges */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-2 mb-3 h-12">
            {exam.examTitle}
          </h3>
          
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge 
              icon={<FiBook className="w-3 h-3" />}
              text={exam.subject || "General"}
              color="blue"
            />
            
            {exam.difficulty && (
              <Badge 
                text={exam.difficulty}
                color={getDifficultyColorClass(exam.difficulty)}
              />
            )}
          </div>
          
          {/* Instructor Info */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiUser className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">By: <span className="font-medium">{exam.instructorName || "Not specified"}</span></span>
          </div>
        </div>
        
        {/* Description - Fixed Height */}
        <p className="text-gray-600 text-sm mb-6 line-clamp-3 h-16">
          {exam.instructions || "No description available for this exam."}
        </p>

        {/* Stats Grid - Fixed Layout */}
        <div className="grid grid-cols-2 gap-3 mb-6 flex-shrink-0">
          <StatBox 
            icon={<MdOutlineQuiz className="w-4 h-4 text-blue-600" />}
            label="Questions"
            value={questionCount}
          />
          
          <StatBox 
            icon={<FiClock className="w-4 h-4 text-orange-600" />}
            label="Duration"
            value={`${duration} min`}
          />
          
          <StatBox 
            icon={<MdOutlineScore className="w-4 h-4 text-green-600" />}
            label="Total Marks"
            value={totalMarks}
          />
          
          <StatBox 
            icon={<FiBarChart2 className="w-4 h-4 text-purple-600" />}
            label="Pass %"
            value={`${calculatePassPercentage()}%`}
          />
        </div>

        {/* Additional Info - Fixed Height */}
        <div className="space-y-2 text-sm text-gray-600 border-t pt-4 mt-auto">
          <div className="flex justify-between">
            <span className="truncate mr-2">Time per Question:</span>
            <span className="font-medium whitespace-nowrap">{timePerQuestion} min</span>
          </div>
          <div className="flex justify-between">
            <span className="truncate mr-2">Passing Marks:</span>
            <span className="font-medium whitespace-nowrap">{passingMarks}/{totalMarks}</span>
          </div>
          {exam.attempts > 0 && (
            <div className="flex justify-between">
              <span className="truncate mr-2">Total Attempts:</span>
              <span className="font-medium whitespace-nowrap">{exam.attempts}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons - Fixed Height */}
      <div className="px-5 pb-5 pt-0">
        {isActive ? (
          <>
            <Link
              href={`/dashboard/student/exams/take/${exam._id}`}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-md mb-3"
            >
              <FiPlay className="w-5 h-5" />
              Start Exam Now
              <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href={`/dashboard/student/exams/${exam._id}`}
              className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2 text-sm"
            >
              <FiInfo className="w-4 h-4" />
              View Exam Details
            </Link>
          </>
        ) : (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-gray-500 mb-3">
              <FiXCircle className="w-5 h-5" />
              <span className="font-medium text-sm">This exam is currently unavailable</span>
            </div>
            <Link
              href={`/dashboard/student/exams/${exam._id}`}
              className="w-full px-4 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2 text-sm"
            >
              <FiEye className="w-4 h-4" />
              Preview Exam Details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ========== Small Helper Components ==========

function Badge({ icon, text, color = "gray" }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
    purple: "bg-purple-100 text-purple-700",
    gray: "bg-gray-100 text-gray-700"
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${colorClasses[color]}`}>
      {icon}
      {text}
    </span>
  );
}

function StatBox({ icon, label, value }) {
  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xs text-gray-600">{label}</span>
      </div>
      <div className="text-lg font-bold text-gray-800">{value}</div>
    </div>
  );
}

function StatCard({ icon, title, value, color, subtitle }) {
  const colorClasses = {
    blue: "bg-blue-100",
    green: "bg-green-100",
    orange: "bg-orange-100",
    purple: "bg-purple-100"
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition">
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

function getDifficultyColorClass(difficulty) {
  switch(difficulty?.toLowerCase()) {
    case 'easy': return 'green';
    case 'medium': return 'yellow';
    case 'hard': return 'red';
    default: return 'gray';
  }
}

// ========== Loading and Empty States ==========

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          {/* Header Skeleton */}
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          
          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          
          {/* Filter Skeleton */}
          <div className="h-12 bg-gray-300 rounded"></div>
          
          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[500px] bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ hasExams }) {
  return (
    <div className="bg-white rounded-xl border-2 border-dashed p-12 text-center">
      <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
        <FiBook className="w-10 h-10 text-blue-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        {hasExams ? "No exams match your filters" : "No exams found"}
      </h3>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        {hasExams
          ? "Try adjusting your search or filter criteria to see more results."
          : "There are currently no exams available in the system."}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
      >
        <FiRefreshCw className="w-5 h-5" />
        Reload Page
      </button>
    </div>
  );
}