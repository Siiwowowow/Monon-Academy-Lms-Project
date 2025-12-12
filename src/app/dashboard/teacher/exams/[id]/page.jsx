"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { 
  FiArrowLeft, FiEdit2, FiTrash2, FiCopy, FiDownload,
  FiEye, FiClock, FiBook, FiUsers, FiBarChart2,
  FiCheckCircle, FiXCircle, FiUser, FiCalendar, FiInfo,
  FiSettings, FiChevronRight, FiMail, FiBriefcase,
  FiShare2
} from "react-icons/fi";

export default function SingleExamView() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id;
  
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch exam data
  useEffect(() => {
    if (examId) {
      fetchExamData();
    }
  }, [examId]);

  const fetchExamData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/tests/mcq/${examId}`);
      const data = await res.json();

      if (data.success) {
        setExam(data.exam);
      } else {
        toast.error(data.message || "Failed to load exam");
        router.push("/dashboard/teacher/exams");
      }
    } catch (error) {
      console.error("Error fetching exam:", error);
      toast.error("Error loading exam");
      router.push("/dashboard/teacher/exams");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/tests/mcq/${examId}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        toast.success("Exam deleted successfully");
        router.push("/dashboard/teacher/exams");
      } else {
        toast.error(data.message || "Failed to delete exam");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Something went wrong!");
    }
  };

  // Duplicate exam
  const handleDuplicate = async () => {
    try {
      const toastId = toast.loading("Duplicating exam...");
      
      const duplicateData = {
        ...exam,
        examTitle: `${exam.examTitle} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _id: undefined,
        attempts: 0,
        averageScore: 0,
        passRate: 0
      };

      const res = await fetch("/api/tests/mcq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duplicateData),
      });

      const data = await res.json();
      toast.dismiss(toastId);

      if (data.success) {
        toast.success("Exam duplicated successfully");
        router.push(`/dashboard/teacher/edit-exam/${data.examId || data.data?._id}`);
      } else {
        toast.error(data.message || "Failed to duplicate exam");
      }
    } catch (error) {
      console.error("Duplicate error:", error);
      toast.error("Error duplicating exam");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  };

  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Calculate time per question
  const calculateTimePerQuestion = () => {
    if (!exam?.questions?.length || !exam?.duration) return 0;
    return Math.round(exam.duration / exam.questions.length);
  };

  // Calculate total marks from questions
  const calculateTotalMarks = () => {
    if (!exam?.questions) return 0;
    return exam.questions.reduce((sum, q) => sum + (parseInt(q.marks) || 1), 0);
  };

  // Get exam status
  const getExamStatus = () => {
    if (exam?.isActive === false) {
      return { label: "Inactive", color: "gray", icon: <FiXCircle /> };
    }
    return { label: "Active", color: "green", icon: <FiCheckCircle /> };
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!exam) {
    return <NotFoundState />;
  }

  const examStatus = getExamStatus();
  const totalMarks = calculateTotalMarks();
  const timePerQuestion = calculateTimePerQuestion();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <HeaderSection 
          exam={exam} 
          examStatus={examStatus}
          onDuplicate={handleDuplicate}
          onDelete={() => setShowDeleteConfirm(true)}
        />
        
        {/* Stats Overview */}
        <StatsOverview 
          exam={exam}
          totalMarks={totalMarks}
          timePerQuestion={timePerQuestion}
        />
        
        {/* Navigation Tabs */}
        <TabNavigation 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          questionsCount={exam.questions?.length || 0}
        />
        
        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          {activeTab === "details" && (
            <DetailsTab 
              exam={exam}
              formatDate={formatDate}
              formatTime={formatTime}
              timePerQuestion={timePerQuestion}
            />
          )}

          {activeTab === "questions" && (
            <QuestionsTab exam={exam} />
          )}

          {activeTab === "analytics" && (
            <AnalyticsTab exam={exam} />
          )}
        </div>
        
        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <DeleteModal 
            exam={exam}
            onClose={() => setShowDeleteConfirm(false)}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}

// ========== Component Functions ==========

function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading exam details...</p>
      </div>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Exam Not Found</h2>
        <p className="text-gray-600 mb-6">The exam you're looking for doesn't exist or has been deleted.</p>
        <Link
          href="/dashboard/teacher/exams"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Exams
        </Link>
      </div>
    </div>
  );
}

function HeaderSection({ exam, examStatus, onDuplicate, onDelete }) {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/teacher/exams"
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{exam.examTitle}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge icon={<FiBook />} color="blue" text={exam.subject || "No Subject"} />
              <Badge 
                icon={examStatus.icon} 
                color={examStatus.color} 
                text={examStatus.label} 
              />
              {exam.category && (
                <Badge text={exam.category} color="purple" />
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onDuplicate}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
          >
            <FiCopy className="w-4 h-4" />
            Duplicate
          </button>
          <Link
            href={`/dashboard/teacher/edit-exam/${exam._id}`}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
          >
            <FiEdit2 className="w-4 h-4" />
            Edit Exam
          </Link>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
          >
            <FiTrash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function StatsOverview({ exam, totalMarks, timePerQuestion }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <StatCard
        icon={<FiBook />}
        label="Total Marks"
        value={totalMarks}
        color="blue"
      />
      <StatCard
        icon={<FiBarChart2 />}
        label="Questions"
        value={exam.questions?.length || 0}
        color="green"
      />
      <StatCard
        icon={<FiClock />}
        label="Duration"
        value={`${exam.duration || 0} min`}
        color="orange"
        subtext={`${timePerQuestion} min per question`}
      />
      <StatCard
        icon={<FiUsers />}
        label="Passing Marks"
        value={exam.passingMarks || 0}
        color="purple"
        subtext={`${Math.round((exam.passingMarks / totalMarks) * 100)}% required`}
      />
    </div>
  );
}

function TabNavigation({ activeTab, setActiveTab, questionsCount }) {
  const tabs = [
    { id: "details", label: "Exam Details", icon: <FiInfo /> },
    { id: "questions", label: `Questions (${questionsCount})`, icon: <FiBarChart2 /> },
    { id: "analytics", label: "Analytics", icon: <FiSettings /> }
  ];

  return (
    <div className="mb-6">
      <div className="flex border-b overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm md:text-base whitespace-nowrap transition ${activeTab === tab.id ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-800"}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function DetailsTab({ exam, formatDate, formatTime, timePerQuestion }) {
  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Section title="Exam Description">
        <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
          {exam.instructions || "No instructions provided for this exam."}
        </p>
      </Section>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Exam Information */}
        <Section title="Exam Information">
          <InfoRow label="Subject" value={exam.subject || "Not specified"} />
          <InfoRow label="Category" value={exam.category || "General"} />
          <InfoRow label="Difficulty" value={exam.difficulty || "Medium"} />
          <InfoRow label="Created Date" value={formatDate(exam.createdAt)} />
          <InfoRow label="Created Time" value={formatTime(exam.createdAt)} />
          <InfoRow label="Last Updated" value={formatDate(exam.updatedAt || exam.createdAt)} />
        </Section>

        {/* Settings */}
        <Section title="Exam Settings">
          <InfoRow label="Time per Question" value={`${timePerQuestion} minutes`} />
          <InfoRow label="Attempts Allowed" value={exam.maxAttempts || "Unlimited"} />
          <InfoRow label="Shuffle Questions" value={exam.shuffleQuestions ? "Yes" : "No"} />
          <InfoRow label="Show Results" value={exam.showResults ? "Immediately" : "After completion"} />
          <InfoRow label="Negative Marking" value={exam.negativeMarking ? "Yes" : "No"} />
          <InfoRow label="Question Types" value="Multiple Choice Only" />
        </Section>
      </div>

      {/* Instructor Information */}
      {exam.instructorName && (
        <Section title="Created By">
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FiUser className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h4 className="font-semibold text-gray-800">{exam.instructorName}</h4>
                <Badge 
                  icon={<FiBriefcase />} 
                  color="blue" 
                  text={exam.instructorRole || "Instructor"} 
                  size="sm"
                />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <FiMail className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-600">{exam.instructorEmail}</p>
              </div>
            </div>
          </div>
        </Section>
      )}
    </div>
  );
}

function QuestionsTab({ exam }) {
  if (!exam.questions || exam.questions.length === 0) {
    return (
      <div className="text-center py-12">
        <FiBarChart2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Questions Found</h3>
        <p className="text-gray-500">This exam doesn't contain any questions yet.</p>
      </div>
    );
  }

  const totalMarks = exam.questions.reduce((sum, q) => sum + (parseInt(q.marks) || 1), 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Questions ({exam.questions.length})
        </h3>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-600">Total Marks: <strong>{totalMarks}</strong></span>
          <span className="text-gray-600">Average Marks per Question: <strong>{Math.round(totalMarks / exam.questions.length)}</strong></span>
        </div>
      </div>
      
      {exam.questions.map((question, index) => (
        <QuestionCard key={index} question={question} index={index} />
      ))}
    </div>
  );
}

function QuestionCard({ question, index }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 transition">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-semibold flex-shrink-0">
            {index + 1}
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-800 mb-1">{question.questionText}</h4>
            <div className="flex items-center gap-3">
              <Badge 
                text={`${question.marks || 1} mark${question.marks > 1 ? 's' : ''}`} 
                color="green" 
                size="sm"
              />
              <Badge 
                icon={<FiCheckCircle />}
                text={`Correct: ${String.fromCharCode(65 + question.correctAnswer)}`}
                color="blue"
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Options */}
      <div className="space-y-2">
        {question.options.map((option, optIndex) => (
          <div
            key={optIndex}
            className={`p-3 rounded-lg transition ${optIndex === question.correctAnswer ? 'bg-green-50 border border-green-200' : 'bg-gray-50 hover:bg-gray-100'}`}
          >
            <div className="flex items-center gap-3">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${optIndex === question.correctAnswer ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-700'}`}>
                {String.fromCharCode(65 + optIndex)}
              </span>
              <span className={optIndex === question.correctAnswer ? 'text-green-800 font-medium' : 'text-gray-700'}>
                {option}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsTab({ exam }) {
  return (
    <div className="space-y-6">
      <Section title="Exam Performance Analytics">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AnalyticsCard
            label="Total Attempts"
            value={exam.attempts || 0}
            icon={<FiUsers />}
            color="blue"
          />
          <AnalyticsCard
            label="Average Score"
            value={exam.averageScore ? `${exam.averageScore.toFixed(1)}%` : "0%"}
            icon={<FiBarChart2 />}
            color="green"
          />
          <AnalyticsCard
            label="Pass Rate"
            value={exam.passRate ? `${exam.passRate.toFixed(1)}%` : "0%"}
            icon={<FiCheckCircle />}
            color="purple"
          />
        </div>
      </Section>
      
      <Section title="Recent Activity">
        <div className="text-center py-12">
          <FiBarChart2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-700 mb-2">No Activity Yet</h4>
          <p className="text-gray-500 max-w-md mx-auto">
            Analytics data will be available once students start taking this exam. 
            Share the exam with your students to track their performance.
          </p>
          <div className="mt-6">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto">
              <FiShare2 className="w-4 h-4" />
              Share Exam Link
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
}

function DeleteModal({ exam, onClose, onDelete }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <FiTrash2 className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Delete Exam</h3>
        </div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete "<strong>{exam.examTitle}</strong>"? This action cannot be undone.
          All exam data, including {exam.questions?.length || 0} questions, will be permanently deleted.
        </p>
        <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
          >
            <FiTrash2 className="w-4 h-4" />
            Delete Exam
          </button>
        </div>
      </div>
    </div>
  );
}

// ========== Reusable Helper Components ==========

function Badge({ icon, text, color = "gray", size = "md" }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    orange: "bg-orange-100 text-orange-700",
    purple: "bg-purple-100 text-purple-700",
    red: "bg-red-100 text-red-700",
    gray: "bg-gray-100 text-gray-700"
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-2.5 py-1 text-sm"
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}>
      {icon && React.cloneElement(icon, { className: "w-3 h-3" })}
      {text}
    </span>
  );
}

function StatCard({ icon, label, value, color, subtext }) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-100",
    green: "bg-green-50 border-green-100",
    orange: "bg-orange-50 border-orange-100",
    purple: "bg-purple-50 border-purple-100"
  };

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color]}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color].replace('50', '100')}`}>
          {React.cloneElement(icon, { className: "w-5 h-5" })}
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-xl font-bold text-gray-800">{value}</p>
          {subtext && (
            <p className="text-xs text-gray-500 mt-1">{subtext}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function AnalyticsCard({ label, value, icon, color }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600"
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-5`}>
      <div className="flex items-center gap-3 mb-2">
        {React.cloneElement(icon, { className: "w-5 h-5" })}
        <p className="text-sm font-medium">{label}</p>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}