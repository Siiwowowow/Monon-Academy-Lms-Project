"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { 
  FiArrowLeft, FiClock, FiBook, FiCheckCircle, 
  FiAlertCircle, FiUser, FiCalendar, FiBarChart2,
  FiUsers, FiEye, FiPlay, FiInfo, FiChevronRight,
  FiBookOpen, FiTarget, FiPercent, FiAward, FiLock, FiUnlock,
  FiTrendingUp, FiDownload, FiShare2, FiStar
} from "react-icons/fi";
import { MdOutlineQuiz, MdOutlineScore, MdAccessTime } from "react-icons/md";

export default function ExamDetails() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id;
  
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  // Fetch exam details
  useEffect(() => {
    if (examId) {
      fetchExamDetails();
    }
  }, [examId]);

  const fetchExamDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/tests/mcq/${examId}`);
      const data = await res.json();

      if (data.success && data.exam) {
        setExam(data.exam);
      } else {
        toast.error("Exam not found or unavailable");
        router.push("/dashboard/student/exams");
      }
    } catch (error) {
      console.error("Error fetching exam details:", error);
      toast.error("Failed to load exam details");
      router.push("/dashboard/student/exams");
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate pass percentage
  const calculatePassPercentage = () => {
    if (!exam?.totalMarks || !exam?.passingMarks) return 0;
    return Math.round((exam.passingMarks / exam.totalMarks) * 100);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam details...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the exam information</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Exam Not Found</h2>
          <p className="text-gray-600 mb-6">The exam you're looking for doesn't exist or is no longer available.</p>
          <Link
            href="/dashboard/student/exams"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Exams
          </Link>
        </div>
      </div>
    );
  }

  const isActive = exam.isActive !== false;
  const passPercentage = calculatePassPercentage();
  const timePerQuestion = calculateTimePerQuestion();
  const totalMarks = calculateTotalMarks();
  const questionsToShow = showAllQuestions ? exam.questions : exam.questions?.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Link
                  href="/dashboard/student/exams"
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition backdrop-blur-sm"
                >
                  <FiArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{exam.examTitle}</h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-sm">
                      <FiBook className="w-4 h-4" />
                      {exam.subject}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${isActive ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
                      {isActive ? (
                        <>
                          <FiCheckCircle className="w-4 h-4" />
                          Active & Available
                        </>
                      ) : (
                        <>
                          <FiAlertCircle className="w-4 h-4" />
                          Currently Inactive
                        </>
                      )}
                    </span>
                    {exam.difficulty && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 rounded-full text-sm">
                        {exam.difficulty} Level
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Instructor Info */}
              <div className="flex items-center gap-3 mt-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FiUser className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Created by {exam.instructorName}</p>
                  <p className="text-sm opacity-90">{exam.instructorEmail}</p>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{exam.questions?.length || 0}</div>
                  <div className="text-sm opacity-90">Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{exam.duration || 0}</div>
                  <div className="text-sm opacity-90">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{totalMarks}</div>
                  <div className="text-sm opacity-90">Total Marks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{passPercentage}%</div>
                  <div className="text-sm opacity-90">Pass Required</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {isActive ? (
            <Link
              href={`/dashboard/student/exams/take/${examId}`}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-3 font-semibold text-lg shadow-lg"
            >
              <FiPlay className="w-6 h-6" />
              Start Exam Now
              <FiChevronRight className="w-5 h-5" />
            </Link>
          ) : (
            <div className="flex-1 px-6 py-4 bg-gray-500 text-white rounded-xl flex items-center justify-center gap-3 font-semibold text-lg opacity-80">
              <FiLock className="w-6 h-6" />
              Exam Currently Unavailable
            </div>
          )}
          
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
              <FiShare2 className="w-4 h-4" />
              Share
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
              <FiDownload className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 px-6 py-4 font-medium text-sm md:text-base whitespace-nowrap transition ${activeTab === "overview" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-800"}`}
            >
              <FiInfo className="w-4 h-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("questions")}
              className={`flex items-center gap-2 px-6 py-4 font-medium text-sm md:text-base whitespace-nowrap transition ${activeTab === "questions" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-800"}`}
            >
              <MdOutlineQuiz className="w-4 h-4" />
              Questions ({exam.questions?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-2 px-6 py-4 font-medium text-sm md:text-base whitespace-nowrap transition ${activeTab === "analytics" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-800"}`}
            >
              <FiBarChart2 className="w-4 h-4" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab("instructions")}
              className={`flex items-center gap-2 px-6 py-4 font-medium text-sm md:text-base whitespace-nowrap transition ${activeTab === "instructions" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-800"}`}
            >
              <FiBookOpen className="w-4 h-4" />
              Instructions
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "overview" && (
              <OverviewTab 
                exam={exam}
                formatDate={formatDate}
                formatTime={formatTime}
                timePerQuestion={timePerQuestion}
                passPercentage={passPercentage}
                totalMarks={totalMarks}
              />
            )}

            {activeTab === "questions" && (
              <QuestionsTab 
                exam={exam}
                questionsToShow={questionsToShow}
                showAllQuestions={showAllQuestions}
                setShowAllQuestions={setShowAllQuestions}
                totalMarks={totalMarks}
              />
            )}

            {activeTab === "analytics" && (
              <AnalyticsTab exam={exam} />
            )}

            {activeTab === "instructions" && (
              <InstructionsTab exam={exam} />
            )}
          </div>
        </div>

        {/* Quick Tips Card */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <FiTarget className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Exam Preparation Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FiClock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">Allocate {timePerQuestion} minutes per question</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiAward className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">Need {passPercentage}% to pass the exam</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FiStar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">Read all questions carefully before answering</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiTrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">Review difficult questions at the end</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== Tab Components ==========

function OverviewTab({ exam, formatDate, formatTime, timePerQuestion, passPercentage, totalMarks }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Exam Description</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700 whitespace-pre-wrap">
            {exam.instructions || "No specific instructions provided for this exam. Please answer all questions to the best of your ability."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Exam Information */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Exam Information</h4>
          <div className="space-y-3">
            <InfoRow label="Subject" value={exam.subject} />
            <InfoRow label="Category" value={exam.category || "General"} />
            <InfoRow label="Difficulty" value={exam.difficulty || "Medium"} />
            <InfoRow label="Created On" value={`${formatDate(exam.createdAt)} at ${formatTime(exam.createdAt)}`} />
            <InfoRow label="Last Updated" value={formatDate(exam.updatedAt || exam.createdAt)} />
          </div>
        </div>

        {/* Exam Settings */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Exam Settings</h4>
          <div className="space-y-3">
            <InfoRow label="Time per Question" value={`${timePerQuestion} minutes`} />
            <InfoRow label="Total Duration" value={`${exam.duration} minutes`} />
            <InfoRow label="Total Marks" value={totalMarks} />
            <InfoRow label="Passing Marks" value={`${exam.passingMarks || 0} (${passPercentage}%)`} />
            <InfoRow label="Question Type" value="Multiple Choice (MCQ)" />
          </div>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 border">
        <h4 className="font-medium text-gray-700 mb-3">Key Statistics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox 
            label="Total Questions"
            value={exam.questions?.length || 0}
            icon={<MdOutlineQuiz className="w-5 h-5 text-blue-600" />}
          />
          <StatBox 
            label="Time Available"
            value={`${exam.duration} min`}
            icon={<FiClock className="w-5 h-5 text-green-600" />}
          />
          <StatBox 
            label="Pass Percentage"
            value={`${passPercentage}%`}
            icon={<FiPercent className="w-5 h-5 text-purple-600" />}
          />
          <StatBox 
            label="Total Attempts"
            value={exam.attempts || 0}
            icon={<FiUsers className="w-5 h-5 text-orange-600" />}
          />
        </div>
      </div>
    </div>
  );
}

function QuestionsTab({ exam, questionsToShow, showAllQuestions, setShowAllQuestions, totalMarks }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Exam Questions ({exam.questions?.length || 0})
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            Total Marks: {totalMarks}
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-sm text-gray-600">
            Average Marks per Question: {exam.questions?.length ? Math.round(totalMarks / exam.questions.length) : 0}
          </span>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questionsToShow?.map((question, index) => (
          <QuestionPreview 
            key={index}
            question={question}
            index={index}
          />
        ))}
      </div>

      {/* Show More/Less Button */}
      {exam.questions?.length > 3 && (
        <div className="text-center">
          <button
            onClick={() => setShowAllQuestions(!showAllQuestions)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
          >
            {showAllQuestions ? (
              <>
                <FiEye className="w-4 h-4" />
                Show Less Questions
              </>
            ) : (
              <>
                <FiEye className="w-4 h-4" />
                Show All {exam.questions?.length} Questions
              </>
            )}
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Note: For security reasons, correct answers are not shown in preview
          </p>
        </div>
      )}
    </div>
  );
}

function QuestionPreview({ question, index }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-semibold">
            {index + 1}
          </div>
          <div>
            <h4 className="font-medium text-gray-800">Question {index + 1}</h4>
            <p className="text-sm text-gray-600">{question.marks || 1} mark(s)</p>
          </div>
        </div>
      </div>
      
      <p className="text-gray-700 mb-4">{question.questionText}</p>
      
      <div className="space-y-2">
        {question.options.map((option, optIndex) => (
          <div
            key={optIndex}
            className="p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
                {String.fromCharCode(65 + optIndex)}
              </span>
              <span className="text-gray-700">{option}</span>
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
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Exam Performance Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AnalyticsCard
            label="Total Attempts"
            value={exam.attempts || 0}
            icon={<FiUsers className="w-6 h-6 text-blue-600" />}
            color="blue"
          />
          <AnalyticsCard
            label="Average Score"
            value={exam.averageScore ? `${exam.averageScore.toFixed(1)}%` : "N/A"}
            icon={<FiBarChart2 className="w-6 h-6 text-green-600" />}
            color="green"
          />
          <AnalyticsCard
            label="Pass Rate"
            value={exam.passRate ? `${exam.passRate.toFixed(1)}%` : "N/A"}
            icon={<FiPercent className="w-6 h-6 text-purple-600" />}
            color="purple"
          />
        </div>
      </div>
      
      <div className="border-t pt-6">
        <h4 className="font-medium text-gray-700 mb-4">Exam Insights</h4>
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <FiBarChart2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-700 mb-2">No Performance Data Yet</h4>
          <p className="text-gray-500 max-w-md mx-auto">
            Analytics data will be available once students start taking this exam. 
            Be the first to attempt this exam and set a benchmark!
          </p>
          <div className="mt-6">
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
              <FiStar className="w-4 h-4" />
              Opportunity to be a trendsetter
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InstructionsTab({ exam }) {
  const passPercentage = Math.round((exam.passingMarks / exam.totalMarks) * 100);
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Exam Guidelines & Instructions</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="space-y-4">
            <InstructionItem 
              icon={<FiClock className="w-5 h-5 text-blue-600" />}
              title="Time Management"
              description={`You have ${exam.duration} minutes to complete ${exam.questions?.length || 0} questions. That's approximately ${Math.round(exam.duration / exam.questions?.length) || 1} minutes per question.`}
            />
            <InstructionItem 
              icon={<FiCheckCircle className="w-5 h-5 text-green-600" />}
              title="Answer Selection"
              description="Each question has 4 options. Select the one correct answer. You can change your answer anytime before submission."
            />
            <InstructionItem 
              icon={<FiBookOpen className="w-5 h-5 text-purple-600" />}
              title="Exam Navigation"
              description="Use the question navigator to move between questions. Flag questions you want to review later."
            />
            <InstructionItem 
              icon={<FiAward className="w-5 h-5 text-orange-600" />}
              title="Passing Criteria"
              description={`You need to score ${exam.passingMarks || 0} out of ${exam.totalMarks} marks (${passPercentage}%) to pass this exam.`}
            />
            <InstructionItem 
              icon={<FiAlertCircle className="w-5 h-5 text-red-600" />}
              title="Important Notes"
              description="The exam will auto-submit when time expires. Ensure you have a stable internet connection during the exam."
            />
          </div>
        </div>
      </div>

      {/* Do's and Don'ts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
            <FiCheckCircle className="w-5 h-5" />
            Do's
          </h4>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-green-700">
              <span className="mt-1">•</span>
              <span>Read each question carefully before answering</span>
            </li>
            <li className="flex items-start gap-2 text-green-700">
              <span className="mt-1">•</span>
              <span>Manage your time effectively</span>
            </li>
            <li className="flex items-start gap-2 text-green-700">
              <span className="mt-1">•</span>
              <span>Review flagged questions before submission</span>
            </li>
            <li className="flex items-start gap-2 text-green-700">
              <span className="mt-1">•</span>
              <span>Ensure stable internet connection</span>
            </li>
          </ul>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
            <FiAlertCircle className="w-5 h-5" />
            Don'ts
          </h4>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-red-700">
              <span className="mt-1">•</span>
              <span>Don't refresh or close the browser during exam</span>
            </li>
            <li className="flex items-start gap-2 text-red-700">
              <span className="mt-1">•</span>
              <span>Don't use any unauthorized resources</span>
            </li>
            <li className="flex items-start gap-2 text-red-700">
              <span className="mt-1">•</span>
              <span>Don't wait until last minute to submit</span>
            </li>
            <li className="flex items-start gap-2 text-red-700">
              <span className="mt-1">•</span>
              <span>Don't panic if you encounter difficult questions</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ========== Helper Components ==========

function InstructionItem({ icon, title, description }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border">
        {icon}
      </div>
      <div>
        <h5 className="font-semibold text-gray-800 mb-1">{title}</h5>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-800 text-right">{value}</span>
    </div>
  );
}

function StatBox({ label, value, icon }) {
  return (
    <div className="bg-white border rounded-lg p-4 text-center">
      <div className="flex justify-center mb-2">
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-800 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function AnalyticsCard({ label, value, icon, color }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    purple: "bg-purple-50 text-purple-700"
  };

  return (
    <div className={`${colorClasses[color]} rounded-xl p-5`}>
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <p className="font-medium">{label}</p>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}