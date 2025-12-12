"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { 
  FiArrowLeft, FiClock, FiBook, FiCheckCircle, 
  FiAlertCircle, FiUser, FiBarChart2,
  FiChevronLeft, FiChevronRight, FiFlag,
  FiEye, FiAlertTriangle, FiInfo, FiPlay, FiPause,
  FiRefreshCw, FiXCircle, FiAward, FiCornerRightUp,
  FiTarget, FiPercent, FiCheckSquare, FiXSquare,
  FiCalendar, FiDownload, FiShare, FiSettings,
  FiGrid, FiList, FiChevronUp, FiChevronDown
} from "react-icons/fi";
import useAuth from "@/hooks/useAuth";

// ========== MAIN COMPONENT ==========
export default function TakeExamPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const examId = params.id;
  
  const [state, setState] = useState({
    exam: null,
    loading: true,
    currentQuestion: 0,
    answers: {},
    flaggedQuestions: new Set(),
    timeLeft: 0,
    isTimerRunning: true,
    isSubmitting: false,
    showConfirmModal: false,
    showResults: false,
    resultData: null,
    activeTab: "questions",
    isMobileMenuOpen: false
  });

  // Update state helper
  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Fetch exam data
  useEffect(() => {
    if (examId) {
      fetchExamData();
    }
  }, [examId]);

  // Timer effect
  useEffect(() => {
    const { exam, isTimerRunning, timeLeft } = state;
    if (!exam?.duration || !isTimerRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      updateState({ timeLeft: prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      }});
    }, 1000);

    return () => clearInterval(timer);
  }, [state.exam?.duration, state.isTimerRunning, state.timeLeft]);

  const fetchExamData = async () => {
    try {
      updateState({ loading: true });
      const res = await fetch(`/api/tests/mcq/${examId}`);
      const data = await res.json();

      if (data.success && data.exam) {
        const examData = data.exam;
        
        if (examData.isActive === false) {
          toast.error("This exam is currently unavailable");
          router.push("/dashboard/student/exams");
          return;
        }

        // Initialize empty answers object
        const initialAnswers = {};
        examData.questions?.forEach((_, index) => {
          initialAnswers[index] = null;
        });

        // Calculate initial time (handle NaN)
        const duration = parseInt(examData.duration) || 60; // Default 60 minutes
        const durationInSeconds = duration * 60;

        updateState({
          exam: examData,
          timeLeft: durationInSeconds,
          answers: initialAnswers,
          loading: false
        });
        
      } else {
        toast.error("Exam not found");
        router.push("/dashboard/student/exams");
      }
    } catch (error) {
      console.error("Error fetching exam:", error);
      toast.error("Failed to load exam");
      router.push("/dashboard/student/exams");
    }
  };

  // Event Handlers
  const handleAnswerSelect = (questionIndex, optionIndex) => {
    updateState({
      answers: {
        ...state.answers,
        [questionIndex]: optionIndex
      }
    });
  };

  const toggleFlagQuestion = (questionIndex) => {
    const newSet = new Set(state.flaggedQuestions);
    newSet.has(questionIndex) ? newSet.delete(questionIndex) : newSet.add(questionIndex);
    updateState({ flaggedQuestions: newSet });
  };

  const goToQuestion = (index) => {
    updateState({ currentQuestion: index, isMobileMenuOpen: false });
  };

  const goToNextQuestion = () => {
    if (state.currentQuestion < (state.exam.questions?.length - 1)) {
      updateState({ currentQuestion: state.currentQuestion + 1 });
    }
  };

  const goToPreviousQuestion = () => {
    if (state.currentQuestion > 0) {
      updateState({ currentQuestion: state.currentQuestion - 1 });
    }
  };

  // Results Calculation
  const calculateResults = () => {
    const { exam, answers } = state;
    if (!exam?.questions) return null;
    
    let obtainedMarks = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    const questionResults = [];
    
    exam.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      const marks = parseInt(question.marks) || 1;
      
      if (isCorrect) {
        obtainedMarks += marks;
        correctAnswers++;
      } else if (userAnswer !== null) {
        wrongAnswers++;
      }
      
      questionResults.push({
        questionIndex: index,
        questionText: question.questionText,
        options: question.options,
        correctAnswer: question.correctAnswer,
        userAnswer: userAnswer,
        isCorrect: isCorrect,
        marks: marks,
        marksObtained: isCorrect ? marks : 0
      });
    });
    
    const totalMarks = exam.questions.reduce((sum, q) => sum + (parseInt(q.marks) || 1), 0);
    const percentage = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0;
    const passed = obtainedMarks >= (parseInt(exam.passingMarks) || 0);
    const duration = parseInt(exam.duration) || 60;
    const timeSpent = Math.round(((duration * 60) - state.timeLeft) / 60);
    
    return {
      obtainedMarks,
      totalMarks,
      correctAnswers,
      wrongAnswers,
      unanswered: exam.questions.length - (correctAnswers + wrongAnswers),
      percentage,
      passed,
      questionResults,
      timeSpent,
      submittedAt: new Date().toISOString()
    };
  };

  // Submit Exam
  const submitExam = async () => {
    try {
      updateState({ isSubmitting: true });
      
      const results = calculateResults();
      updateState({ resultData: results });
      
      // Prepare submission with user data
      const submissionData = {
        examId: examId,
        studentId: user?._id || "guest",
        studentName: user?.name || "Guest Student",
        studentEmail: user?.email || "guest@example.com",
        answers: state.answers,
        timeSpent: results.timeSpent,
        ...results
      };

      // Save to backend
      const saveResponse = await fetch('/api/exams/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      const saveData = await saveResponse.json();

      if (saveData.success) {
        toast.success("🎉 Exam submitted successfully!");
        updateState({
          resultData: { ...results, resultId: saveData.resultId },
          showResults: true,
          activeTab: "results",
          isSubmitting: false,
          showConfirmModal: false
        });
      } else {
        toast.error("❌ " + (saveData.message || "Failed to save results"));
        updateState({
          resultData: results,
          showResults: true,
          activeTab: "results",
          isSubmitting: false,
          showConfirmModal: false
        });
      }
      
    } catch (error) {
      console.error("Error submitting exam:", error);
      const results = calculateResults();
      toast.error("⚠️ Could not save to server, but showing your performance.");
      updateState({
        resultData: results,
        showResults: true,
        activeTab: "results",
        isSubmitting: false,
        showConfirmModal: false
      });
    }
  };

  // Auto Submit Handler
  const handleAutoSubmit = async () => {
    updateState({ isTimerRunning: false });
    toast.error("⏰ Time's up! Submitting your exam...");
    await submitExam();
  };

  // Format time helper - Fixed NaN issue
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds) || seconds < 0) {
      return "00:00";
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress
  const calculateProgress = () => {
    const answered = Object.values(state.answers).filter(answer => answer !== null).length;
    const total = state.exam?.questions?.length || 0;
    return total > 0 ? Math.round((answered / total) * 100) : 0;
  };

  if (state.loading) {
    return <LoadingScreen />;
  }

  if (!state.exam) {
    return <ExamNotFound />;
  }

  const {
    exam,
    currentQuestion,
    answers,
    flaggedQuestions,
    timeLeft,
    isTimerRunning,
    showConfirmModal,
    showResults,
    resultData,
    activeTab,
    isSubmitting,
    isMobileMenuOpen
  } = state;

  const currentQ = exam.questions?.[currentQuestion];
  const answeredCount = Object.values(answers).filter(answer => answer !== null).length;
  const totalQuestions = exam.questions?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => updateState({ isMobileMenuOpen: false })}
        />
      )}

      {/* Header */}
      <ExamHeader 
        exam={exam}
        showResults={showResults}
        timeLeft={timeLeft}
        formatTime={formatTime}
        isTimerRunning={isTimerRunning}
        onTimerToggle={() => updateState({ isTimerRunning: !isTimerRunning })}
        activeTab={activeTab}
        onTabChange={(tab) => updateState({ activeTab: tab })}
        currentQuestion={currentQuestion}
        totalQuestions={totalQuestions}
        answeredCount={answeredCount}
        onMobileMenuToggle={() => updateState({ isMobileMenuOpen: !isMobileMenuOpen })}
      />

      {/* Mobile Question Navigator */}
      {!showResults && isMobileMenuOpen && (
        <MobileQuestionNavigator
          exam={exam}
          answers={answers}
          flaggedQuestions={flaggedQuestions}
          currentQuestion={currentQuestion}
          onGoToQuestion={goToQuestion}
          onClose={() => updateState({ isMobileMenuOpen: false })}
        />
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 lg:py-6">
        {showResults ? (
          <ResultsView 
            resultData={resultData}
            exam={exam}
            formatTime={formatTime}
            activeTab={activeTab}
            currentQuestion={currentQuestion}
            onQuestionChange={goToQuestion}
          />
        ) : (
          <ExamView 
            exam={exam}
            currentQuestion={currentQuestion}
            currentQ={currentQ}
            answers={answers}
            onAnswerSelect={handleAnswerSelect}
            flaggedQuestions={flaggedQuestions}
            onToggleFlag={toggleFlagQuestion}
            onNextQuestion={goToNextQuestion}
            onPreviousQuestion={goToPreviousQuestion}
            onGoToQuestion={goToQuestion}
            onShowConfirmModal={() => updateState({ showConfirmModal: true })}
            totalQuestions={totalQuestions}
            isMobileMenuOpen={isMobileMenuOpen}
            onMobileMenuToggle={() => updateState({ isMobileMenuOpen: !isMobileMenuOpen })}
          />
        )}
      </div>

      {/* Submission Modal */}
      {showConfirmModal && (
        <SubmissionModal 
          onClose={() => updateState({ showConfirmModal: false })}
          onSubmit={submitExam}
          isSubmitting={isSubmitting}
          answeredCount={answeredCount}
          flaggedCount={flaggedQuestions.size}
          totalQuestions={totalQuestions}
          timeLeft={timeLeft}
          formatTime={formatTime}
        />
      )}

      {/* Time Warning */}
      {!showResults && timeLeft <= 300 && timeLeft > 0 && (
        <TimeWarning />
      )}
    </div>
  );
}

// ========== SUB-COMPONENTS ==========

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading exam...</p>
        <p className="text-sm text-gray-400 mt-1">Preparing your test environment</p>
      </div>
    </div>
  );
}

function ExamNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 p-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <FiAlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">Exam Not Found</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">The exam you're looking for doesn't exist or is no longer available.</p>
        <Link
          href="/dashboard/student/exams"
          className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Exams
        </Link>
      </div>
    </div>
  );
}

function ExamHeader({ 
  exam, 
  showResults, 
  timeLeft, 
  formatTime, 
  isTimerRunning, 
  onTimerToggle,
  activeTab,
  onTabChange,
  currentQuestion,
  totalQuestions,
  answeredCount,
  onMobileMenuToggle
}) {
  const progress = Math.round(((currentQuestion + 1) / totalQuestions) * 100);
  
  return (
    <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-2 sm:py-3 gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <Link
              href="/dashboard/student/exams"
              className="p-1.5 sm:p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 flex-shrink-0"
            >
              <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </Link>
            
            {/* Mobile Question Navigator Button */}
            {!showResults && (
              <button
                onClick={onMobileMenuToggle}
                className="p-1.5 sm:p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-all duration-200 flex-shrink-0 lg:hidden"
              >
                <FiGrid className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700" />
              </button>
            )}
            
            <div className="min-w-0 flex-1">
              <h1 className="text-sm sm:text-base lg:text-lg font-bold text-gray-800 truncate">
                {showResults ? `${exam.examTitle} - Results` : exam.examTitle}
              </h1>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 truncate">
                <FiUser className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">By {exam.instructorName}</span>
                <span className="mx-0.5 sm:mx-1">•</span>
                <FiBook className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{exam.subject}</span>
              </div>
            </div>
          </div>
          
          {/* Timer - Only show during exam */}
          {!showResults && (
            <div className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl transition-all duration-300 flex-shrink-0 ${timeLeft < 300 ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-blue-50 border border-blue-200 text-blue-700'}`}>
              <FiClock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-base sm:text-lg lg:text-xl font-bold font-mono tracking-tight">
                {formatTime(timeLeft)}
              </span>
              <button
                onClick={onTimerToggle}
                className="p-1 rounded hover:bg-white/50 transition flex-shrink-0"
              >
                {isTimerRunning ? <FiPause className="w-3 h-3 sm:w-4 sm:h-4" /> : <FiPlay className="w-3 h-3 sm:w-4 sm:h-4" />}
              </button>
            </div>
          )}
        </div>

        {/* Progress or Tabs */}
        {showResults ? (
          <div className="flex border-b">
            <TabButton
              active={activeTab === "results"}
              onClick={() => onTabChange("results")}
              icon={<FiBarChart2 className="w-3 h-3 sm:w-4 sm:h-4" />}
              label="Results"
              mobileLabel="Results"
            />
            <TabButton
              active={activeTab === "questions"}
              onClick={() => onTabChange("questions")}
              icon={<FiEye className="w-3 h-3 sm:w-4 sm:h-4" />}
              label="Review Answers"
              mobileLabel="Review"
            />
          </div>
        ) : (
          <div className="pb-2 sm:pb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs sm:text-sm text-gray-700">
                Q <span className="font-bold">{currentQuestion + 1}</span> of <span className="font-bold">{totalQuestions}</span>
              </div>
              <div className="text-xs sm:text-sm font-medium text-gray-800 bg-gray-100 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
                {answeredCount} / {totalQuestions} answered
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] xs:text-xs text-gray-500 mt-1 sm:mt-2">
              <span>Start</span>
              <span className="font-medium">{progress}% Complete</span>
              <span>Finish</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label, mobileLabel }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 font-medium transition-all duration-200 flex-1 sm:flex-none ${active ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50'}`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden text-xs">{mobileLabel}</span>
    </button>
  );
}

function MobileQuestionNavigator({ exam, answers, flaggedQuestions, currentQuestion, onGoToQuestion, onClose }) {
  return (
    <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-2xl z-50 lg:hidden animate-in slide-in-from-left duration-300">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <FiGrid className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Questions</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <FiXCircle className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Question Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-6 gap-2">
            {exam.questions?.map((_, index) => (
              <button
                key={index}
                onClick={() => onGoToQuestion(index)}
                className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 ${currentQuestion === index 
                  ? 'bg-blue-600 text-white ring-2 ring-blue-300 scale-105' 
                  : answers[index] !== null 
                    ? 'bg-green-500 text-white'
                    : flaggedQuestions.has(index)
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title={`Question ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Legend</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <span className="text-gray-600">Current</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-600">Answered</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-gray-600">Flagged</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function ExamView({
  exam,
  currentQuestion,
  currentQ,
  answers,
  onAnswerSelect,
  flaggedQuestions,
  onToggleFlag,
  onNextQuestion,
  onPreviousQuestion,
  onGoToQuestion,
  onShowConfirmModal,
  totalQuestions,
  isMobileMenuOpen,
  onMobileMenuToggle
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
      {/* Question Navigator - Desktop */}
      <div className="hidden lg:block lg:col-span-1">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border p-4 sm:p-5 sticky top-24">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Questions</h3>
            <span className="text-xs sm:text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
              {flaggedQuestions.size} flagged
            </span>
          </div>
          
          {/* Question Grid */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-4 sm:mb-6">
            {exam.questions?.map((_, index) => (
              <QuestionButton
                key={index}
                number={index + 1}
                isCurrent={currentQuestion === index}
                isAnswered={answers[index] !== null}
                isFlagged={flaggedQuestions.has(index)}
                onClick={() => onGoToQuestion(index)}
              />
            ))}
          </div>
          
          {/* Legend */}
          <div className="space-y-2 border-t pt-4">
            <h4 className="text-xs sm:text-sm font-medium text-gray-700">Legend</h4>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-600"></div>
              <span className="text-gray-600">Current</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-600">Answered</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
              <span className="text-gray-600">Flagged</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Question Area */}
      <div className="lg:col-span-3 space-y-4 lg:space-y-6">
        {/* Mobile Question Header */}
        <div className="lg:hidden bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
                {currentQuestion + 1}
              </div>
              <div>
                <h2 className="font-bold text-gray-800">Question {currentQuestion + 1}</h2>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="font-medium">{currentQ?.marks || 1} marks</span>
                  <span>•</span>
                  <span>{exam.subject}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleFlag(currentQuestion)}
                className={`p-2 rounded-lg ${flaggedQuestions.has(currentQuestion)
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700'
                }`}
              >
                <FiFlag className="w-4 h-4" />
              </button>
              <button
                onClick={onMobileMenuToggle}
                className="p-2 rounded-lg bg-blue-100 text-blue-700"
              >
                <FiGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border overflow-hidden">
          {/* Question Header - Desktop */}
          <div className="hidden lg:block px-4 sm:px-6 py-3 sm:py-5 border-b bg-gradient-to-r from-gray-50 to-gray-100/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
                    {currentQuestion + 1}
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">Question {currentQuestion + 1}</h2>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <FiTarget className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="font-medium">{currentQ?.marks || 1} marks</span>
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="flex items-center gap-1">
                    <FiBook className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{exam.subject}</span>
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => onToggleFlag(currentQuestion)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 ${flaggedQuestions.has(currentQuestion)
                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                <FiFlag className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">{flaggedQuestions.has(currentQuestion) ? 'Unflag' : 'Flag'}</span>
              </button>
            </div>
          </div>

          {/* Question Content */}
          <div className="p-3 sm:p-4 lg:p-6">
            {/* Question Text */}
            <div className="mb-4 sm:mb-6 lg:mb-8">
              <p className="text-sm sm:text-base lg:text-lg text-gray-800 leading-relaxed whitespace-pre-wrap bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200">
                {currentQ?.questionText}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2 sm:space-y-3">
              {currentQ?.options?.map((option, optionIndex) => (
                <OptionCard
                  key={optionIndex}
                  option={option}
                  optionIndex={optionIndex}
                  isSelected={answers[currentQuestion] === optionIndex}
                  onSelect={() => onAnswerSelect(currentQuestion, optionIndex)}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-6 sm:mt-8 lg:mt-10 pt-4 sm:pt-6 border-t">
              <button
                onClick={onPreviousQuestion}
                disabled={currentQuestion === 0}
                className="px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <FiChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </button>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={onShowConfirmModal}
                  className="px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg sm:rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <FiCheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Submit Exam</span>
                  <span className="sm:hidden">Submit</span>
                </button>
                
                <button
                  onClick={onNextQuestion}
                  disabled={currentQuestion === totalQuestions - 1}
                  className="px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:hidden">Next</span>
                  <FiChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5">
          <div className="flex items-start gap-2 sm:gap-3 lg:gap-4">
            <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <FiInfo className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm sm:text-base font-semibold text-blue-800 mb-1 sm:mb-2">Exam Guidelines</h4>
              <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <FiCheckSquare className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Select only one answer per question</span>
                </li>
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <FiFlag className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Flag questions to review later</span>
                </li>
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <FiCornerRightUp className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Use the grid to navigate between questions</span>
                </li>
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <FiClock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Submit before the timer runs out</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestionButton({ number, isCurrent, isAnswered, isFlagged, onClick }) {
  let bgClass = "bg-gray-100 hover:bg-gray-200 text-gray-700";
  if (isCurrent) bgClass = "bg-blue-600 text-white ring-1 sm:ring-2 ring-blue-300 scale-105";
  else if (isAnswered) bgClass = "bg-green-500 text-white hover:bg-green-600";
  else if (isFlagged) bgClass = "bg-yellow-500 text-white hover:bg-yellow-600";
  
  return (
    <button
      onClick={onClick}
      className={`aspect-square rounded-lg sm:rounded-xl flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-200 ${bgClass}`}
      title={`Question ${number}`}
    >
      {number}
    </button>
  );
}

function OptionCard({ option, optionIndex, isSelected, onSelect }) {
  return (
    <div
      onClick={onSelect}
      className={`p-2.5 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl border cursor-pointer transition-all duration-200 ${isSelected
        ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-400 ring-1 sm:ring-2 ring-blue-100'
        : 'bg-gray-50 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
      }`}
    >
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
        <div className={`w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg sm:rounded-xl flex items-center justify-center font-bold flex-shrink-0 transition-all duration-200 ${isSelected
          ? 'bg-blue-600 text-white scale-105'
          : 'bg-gray-200 text-gray-700'
        }`}>
          {String.fromCharCode(65 + optionIndex)}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm sm:text-base font-medium ${isSelected ? 'text-blue-900' : 'text-gray-800'} break-words`}>
            {option}
          </p>
        </div>
        {isSelected && (
          <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600 flex-shrink-0 animate-pulse" />
        )}
      </div>
    </div>
  );
}

function ResultsView({ resultData, exam, formatTime, activeTab, currentQuestion, onQuestionChange }) {
  if (!resultData) return null;

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {activeTab === "results" ? (
        <ResultsSummary resultData={resultData} exam={exam} formatTime={formatTime} />
      ) : (
        <ReviewAnswers 
          resultData={resultData}
          currentQuestion={currentQuestion}
          onQuestionChange={onQuestionChange}
        />
      )}
    </div>
  );
}

function ResultsSummary({ resultData, exam, formatTime }) {
  const percentageColor = resultData.percentage >= 70 ? 'text-green-600' : 
                         resultData.percentage >= 50 ? 'text-yellow-600' : 'text-red-600';
  const passingPercentage = Math.round((parseInt(exam.passingMarks || 0) / resultData.totalMarks) * 100);
  
  return (
    <>
      {/* Result Card */}
      <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 transition-all duration-500 shadow-lg sm:shadow-xl ${resultData.passed 
        ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
        : 'bg-gradient-to-br from-rose-500 to-pink-600'
      } text-white`}>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 lg:gap-8">
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
              {resultData.passed ? (
                <FiAward className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
              ) : (
                <FiAlertCircle className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold mb-1 sm:mb-2 lg:mb-3">
                {resultData.passed ? 'Congratulations! 🎉' : 'Keep Going! 💪'}
              </h2>
              <p className="text-sm sm:text-base lg:text-lg opacity-95">
                {resultData.passed 
                  ? `You passed with ${resultData.percentage}% score`
                  : `You scored ${resultData.percentage}% (need ${passingPercentage}% to pass)`
                }
              </p>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 w-full lg:w-auto lg:min-w-[280px]">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 sm:gap-4">
              <div className="text-center">
                <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${percentageColor}`}>{resultData.percentage}%</div>
                <div className="text-xs sm:text-sm opacity-90 mt-1">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">{resultData.obtainedMarks}/{resultData.totalMarks}</div>
                <div className="text-xs sm:text-sm opacity-90 mt-1">Marks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">{resultData.correctAnswers}/{exam.questions?.length}</div>
                <div className="text-xs sm:text-sm opacity-90 mt-1">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">{formatTime(resultData.timeSpent * 60)}</div>
                <div className="text-xs sm:text-sm opacity-90 mt-1">Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <PerformanceCard
          title="Correct Answers"
          value={resultData.correctAnswers}
          total={exam.questions?.length}
          color="green"
          icon={<FiCheckCircle />}
        />
        <PerformanceCard
          title="Wrong Answers"
          value={resultData.wrongAnswers}
          total={exam.questions?.length}
          color="red"
          icon={<FiXCircle />}
        />
        <PerformanceCard
          title="Unanswered"
          value={resultData.unanswered}
          total={exam.questions?.length}
          color="gray"
          icon={<FiAlertTriangle />}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 pt-4 lg:pt-6">
        <Link
          href="/dashboard/student/exams"
          className="flex-1 px-4 py-2.5 sm:px-5 sm:py-3 lg:px-6 lg:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-semibold text-sm sm:text-base"
        >
          <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Back to Exams
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="flex-1 px-4 py-2.5 sm:px-5 sm:py-3 lg:px-6 lg:py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg sm:rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-semibold text-sm sm:text-base"
        >
          <FiRefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
          Retake Exam
        </button>
      </div>
    </>
  );
}

function PerformanceCard({ title, value, total, color, icon }) {
  const colorClasses = {
    green: { bg: 'bg-green-100', text: 'text-green-700', progress: 'bg-green-500' },
    red: { bg: 'bg-red-100', text: 'text-red-700', progress: 'bg-red-500' },
    gray: { bg: 'bg-gray-100', text: 'text-gray-700', progress: 'bg-gray-500' }
  };

  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border p-3 sm:p-4 lg:p-6">
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
        <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${colorClasses[color].bg} rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0`}>
          {React.cloneElement(icon, { className: `w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${colorClasses[color].text}` })}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-gray-800 text-sm sm:text-base">{title}</h3>
          <p className="text-xs sm:text-sm text-gray-500">Out of {total} questions</p>
        </div>
      </div>
      <div className={`text-xl sm:text-2xl lg:text-3xl font-bold ${colorClasses[color].text} mb-2 sm:mb-3`}>{value}</div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2.5 overflow-hidden">
        <div 
          className={`h-full rounded-full ${colorClasses[color].progress} transition-all duration-700`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="text-right text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">{percentage}%</div>
    </div>
  );
}

function ReviewAnswers({ resultData, currentQuestion, onQuestionChange }) {
  const question = resultData.questionResults[currentQuestion];
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
      {/* Question Navigator */}
      <div className="hidden lg:block lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-5 sticky top-24">
          <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4">Review Questions</h3>
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {resultData.questionResults.map((q, index) => (
              <button
                key={index}
                onClick={() => onQuestionChange(index)}
                className={`aspect-square rounded-lg sm:rounded-xl flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-200 ${currentQuestion === index 
                  ? 'bg-blue-600 text-white ring-1 sm:ring-2 ring-blue-300 scale-105' 
                  : q.isCorrect
                    ? 'bg-green-500 text-white'
                    : q.userAnswer === null
                      ? 'bg-gray-200 text-gray-700'
                      : 'bg-red-500 text-white'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Question Navigator */}
      <div className="lg:hidden">
        <div className="bg-white rounded-xl shadow-sm border p-3 sm:p-4 mb-3 sm:mb-4">
          <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Select Question</h3>
          <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2">
            {resultData.questionResults.map((q, index) => (
              <button
                key={index}
                onClick={() => onQuestionChange(index)}
                className={`min-w-[2.5rem] h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 flex-shrink-0 ${currentQuestion === index 
                  ? 'bg-blue-600 text-white ring-2 ring-blue-300' 
                  : q.isCorrect
                    ? 'bg-green-500 text-white'
                    : q.userAnswer === null
                      ? 'bg-gray-200 text-gray-700'
                      : 'bg-red-500 text-white'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Question Review */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border overflow-hidden">
          <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 border-b bg-gradient-to-r from-gray-50 to-gray-100/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <div className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${question.isCorrect ? 'bg-green-500' : question.userAnswer === null ? 'bg-gray-500' : 'bg-red-500'} text-white rounded-lg flex items-center justify-center font-bold text-sm`}>
                    {currentQuestion + 1}
                  </div>
                  <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800">Question {currentQuestion + 1}</h2>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                  <span className={`font-medium ${question.isCorrect ? 'text-green-600' : question.userAnswer === null ? 'text-gray-600' : 'text-red-600'}`}>
                    {question.isCorrect ? 'Correct ✓' : question.userAnswer === null ? 'Unanswered' : 'Incorrect ✗'}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">
                    Marks: <span className="font-medium">{question.marksObtained}/{question.marks}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-4 lg:p-6">
            <p className="text-sm sm:text-base lg:text-lg text-gray-800 leading-relaxed mb-4 sm:mb-6 lg:mb-8 bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200">
              {question.questionText}
            </p>

            <div className="space-y-2 sm:space-y-3">
              {question.options.map((option, optionIndex) => {
                const isCorrectAnswer = optionIndex === question.correctAnswer;
                const isUserAnswer = optionIndex === question.userAnswer;
                
                let bgClass = "bg-gray-50 border-gray-300";
                let textClass = "text-gray-800";
                
                if (isCorrectAnswer) {
                  bgClass = "bg-green-50 border-green-400";
                  textClass = "text-green-800";
                }
                
                if (isUserAnswer && !isCorrectAnswer) {
                  bgClass = "bg-red-50 border-red-400";
                  textClass = "text-red-800";
                }
                
                return (
                  <div key={optionIndex} className={`p-2.5 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl border ${bgClass}`}>
                    <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                      <div className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-lg sm:rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${isCorrectAnswer 
                        ? 'bg-green-500 text-white' 
                        : isUserAnswer && !isCorrectAnswer
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-300 text-gray-700'
                      }`}>
                        {String.fromCharCode(65 + optionIndex)}
                      </div>
                      <p className={`text-sm sm:text-base font-medium ${textClass} flex-1`}>{option}</p>
                      {isCorrectAnswer && (
                        <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between mt-6 sm:mt-8 lg:mt-10 pt-3 sm:pt-4 lg:pt-6 border-t">
              <button
                onClick={() => onQuestionChange(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <FiChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </button>
              
              <span className="text-xs sm:text-sm text-gray-600 self-center">
                {currentQuestion + 1} / {resultData.questionResults.length}
              </span>
              
              <button
                onClick={() => onQuestionChange(Math.min(resultData.questionResults.length - 1, currentQuestion + 1))}
                disabled={currentQuestion === resultData.questionResults.length - 1}
                className="px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
                <FiChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubmissionModal({
  onClose,
  onSubmit,
  isSubmitting,
  answeredCount,
  flaggedCount,
  totalQuestions,
  timeLeft,
  formatTime
}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-md w-full shadow-2xl animate-in slide-in-from-bottom-10 duration-300 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <FiAlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Submit Exam</h3>
            <p className="text-sm sm:text-base text-gray-600">Are you ready to submit?</p>
          </div>
        </div>
        
        <div className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 border border-gray-200">
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base text-gray-700">Answered Questions</span>
                <span className="font-bold text-gray-800">{answeredCount}/{totalQuestions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base text-gray-700">Flagged Questions</span>
                <span className="font-bold text-gray-800">{flaggedCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base text-gray-700">Time Remaining</span>
                <span className="font-bold text-gray-800">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
          
          <p className="text-sm sm:text-base text-gray-600 text-center">
            Once submitted, you cannot change your answers.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-3 sm:px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium disabled:opacity-50 text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex-1 px-3 sm:px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg sm:rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 text-sm sm:text-base"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Submitting...
              </span>
            ) : (
              'Yes, Submit Exam'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function TimeWarning() {
  return (
    <div className="fixed bottom-4 right-4 bg-gradient-to-r from-red-500 to-rose-600 text-white p-3 rounded-lg sm:rounded-xl shadow-2xl animate-bounce z-40 max-w-[90%]">
      <div className="flex items-center gap-2">
        <FiAlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
        <span className="text-xs sm:text-sm font-semibold">⏰ Less than 5 minutes left!</span>
      </div>
    </div>
  );
}