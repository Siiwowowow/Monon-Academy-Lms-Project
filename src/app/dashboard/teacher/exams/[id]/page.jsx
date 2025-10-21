// app/dashboard/teacher/exam/[id]/page.jsx
'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Clock, 
  BookOpen, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  Pause, 
  RotateCcw,
  Download,
  Printer,
  Flag,
  ChevronLeft,
  ChevronRight,
  Send,
  User,
  Bookmark,
  Eye,
  EyeOff,
  FileText,
  Users,
  Calendar,
  Award,
  X,
  Check,
  Star
} from 'lucide-react';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import useAuth from '@/hooks/useAuth';

// Utility function to format seconds into HH:MM:SS
const formatTime = (seconds) => {
  if (seconds < 0) return '০০:০০:০০';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const pad = (num) => num.toString().padStart(2, '০');
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
};

// 1. MCQ Question Display - FIXED VERSION
const MCQDisplay = React.memo(({ 
  question, 
  index, 
  answer, 
  handleAnswerChange, 
  isSubmitted, 
  isFlagged, 
  onToggleFlag,
  showResults,
  correctAnswer
}) => {
  const options = question?.options?.map((opt, i) => ({ 
    ...opt, 
    key: String.fromCharCode(0x995 + i), // ক, খ, গ, ঘ
    isCorrect: showResults && opt.isCorrect,
    isSelected: answer === i
  })) || [];

  const getOptionStyle = (option, index) => {
    if (!showResults) {
      return answer === index 
        ? 'bg-blue-100 border-blue-500 border-2' 
        : 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
    
    // Show results - FIXED: Better styling for correct/incorrect
    if (option.isCorrect && option.isSelected) {
      return 'bg-green-100 border-green-500 border-2';
    } else if (option.isCorrect) {
      return 'bg-green-50 border-green-300 border-2';
    } else if (option.isSelected && !option.isCorrect) {
      return 'bg-red-100 border-red-500 border-2';
    } else {
      return 'bg-gray-50 border-gray-200';
    }
  };

  if (!question) return null;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-teal-100 relative">
      {/* Question Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <span className="flex items-center justify-center w-8 h-8 bg-teal-500 text-white rounded-full text-sm font-bold">
            {index + 1}
          </span>
          <div>
            <p className="text-lg font-semibold text-gray-800 bengali">
              {question.questionText}
            </p>
            <span className="text-sm text-gray-500">(মান: {question.points || 1})</span>
          </div>
        </div>
        
        {!showResults && (
          <button
            onClick={() => onToggleFlag(question._id || question.id)}
            className={`p-2 rounded-full transition-colors ${
              isFlagged ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
            }`}
            title={isFlagged ? "Remove Flag" : "Flag Question"}
          >
            <Flag size={20} fill={isFlagged ? "currentColor" : "none"} />
          </button>
        )}
      </div>

      {/* Question Image */}
      {question.imageUrl && (
        <div className="my-4 text-center border-2 border-dashed border-gray-200 p-4 rounded-lg bg-gray-50">
          <img
            src={question.imageUrl}
            alt={`Question ${index + 1} illustration`}
            className="max-h-48 mx-auto object-contain rounded"
          />
          <p className="text-xs text-gray-500 mt-2 bengali">প্রশ্নের চিত্র</p>
        </div>
      )}

      {/* Options */}
      <div className="space-y-3 mt-6">
        {options.map((option, optIndex) => (
          <label 
            key={optIndex} 
            className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200 border-2 ${getOptionStyle(option, optIndex)}
              ${!showResults && !isSubmitted ? 'hover:bg-teal-50 hover:border-teal-200' : ''}
              ${showResults ? 'pointer-events-none' : ''}
            `}
          >
            <input
              type="radio"
              name={`mcq-${question._id || question.id}`}
              value={optIndex}
              checked={answer === optIndex}
              onChange={() => handleAnswerChange(optIndex)}
              disabled={isSubmitted || showResults}
              className="form-radio h-5 w-5 text-teal-600 focus:ring-teal-500 border-gray-300 mr-4"
            />
            <span className="font-bold text-teal-700 w-6 bengali">{option.key}.</span>
            <span className="flex-grow text-gray-700 bengali">{option.text}</span>
            
            {/* Result Indicators - FIXED: Better indicators */}
            {showResults && (
              <div className="ml-2">
                {option.isCorrect && option.isSelected && (
                  <Check className="w-5 h-5 text-green-600" title="আপনার সঠিক উত্তর" />
                )}
                {option.isCorrect && !option.isSelected && (
                  <Check className="w-5 h-5 text-green-400" title="সঠিক উত্তর" />
                )}
                {option.isSelected && !option.isCorrect && (
                  <X className="w-5 h-5 text-red-600" title="আপনার ভুল উত্তর" />
                )}
              </div>
            )}
          </label>
        ))}
      </div>

      {/* FIXED: Show correct answer and user selection clearly */}
      {showResults && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <span className="font-medium bengali">আপনার নির্বাচন:</span>
            <span className="font-bold text-blue-700 bengali">
              {answer !== null && answer !== undefined ? String.fromCharCode(0x995 + answer) : 'কোনো উত্তর দেওয়া হয়নি'}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <span className="font-medium bengali">সঠিক উত্তর:</span>
            <span className="font-bold text-green-700 bengali">
              {correctAnswer !== null && correctAnswer !== undefined ? String.fromCharCode(0x995 + correctAnswer) : 'N/A'}
            </span>
          </div>
          {answer === correctAnswer && (
            <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg border border-green-300">
              <span className="font-medium bengali text-green-800">স্ট্যাটাস:</span>
              <span className="font-bold text-green-800 bengali">সঠিক উত্তর ✓</span>
            </div>
          )}
          {answer !== null && answer !== undefined && answer !== correctAnswer && (
            <div className="flex justify-between items-center p-3 bg-red-100 rounded-lg border border-red-300">
              <span className="font-medium bengali text-red-800">স্ট্যাটাস:</span>
              <span className="font-bold text-red-800 bengali">ভুল উত্তর ✗</span>
            </div>
          )}
        </div>
      )}

      {/* Explanation */}
      {showResults && question.explanation && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-800 bengali mb-1">ব্যাখ্যা:</p>
          <p className="text-sm text-blue-700 bengali">{question.explanation}</p>
        </div>
      )}
    </div>
  );
});

// 2. Srijonshil Question Display
const SrijonshilDisplay = React.memo(({ 
  question, 
  index, 
  answer, 
  handleAnswerChange, 
  isSubmitted, 
  isFlagged, 
  onToggleFlag,
  showResults
}) => {
  const subQuestions = question?.subQuestions?.map((sq, i) => ({ 
    ...sq, 
    key: ['ক', 'খ', 'গ', 'ঘ'][i] 
  })) || [];

  // Initialize local answers for Srijonshil if not present
  const localAnswer = answer || subQuestions.reduce((acc, sq) => ({ ...acc, [sq.id]: '' }), {});

  const handleSubQChange = (subQId, value) => {
    const newAnswer = { ...localAnswer, [subQId]: value };
    handleAnswerChange(newAnswer);
  };

  const totalMarks = subQuestions.reduce((sum, sq) => sum + (sq.points || 1), 0);

  if (!question) return null;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border-2 border-indigo-200 relative">
      {/* Question Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <span className="flex items-center justify-center w-8 h-8 bg-indigo-500 text-white rounded-full text-sm font-bold">
            {index + 1}
          </span>
          <div>
            <h3 className="text-xl font-bold text-indigo-700 bengali">
              সৃজনশীল প্রশ্ন
            </h3>
            <span className="text-sm text-gray-500">(মোট নম্বর: {totalMarks})</span>
          </div>
        </div>
        
        {!showResults && (
          <button
            onClick={() => onToggleFlag(question._id || question.id)}
            className={`p-2 rounded-full transition-colors ${
              isFlagged ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
            }`}
            title={isFlagged ? "Remove Flag" : "Flag Question"}
          >
            <Flag size={20} fill={isFlagged ? "currentColor" : "none"} />
          </button>
        )}
      </div>
      
      {/* Uddipak / Stimulus */}
      <div className="mb-6 p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-lg shadow-inner">
        <p className="font-bold text-gray-800 mb-2 bengali">উদ্দীপক:</p>
        <p className="text-gray-700 leading-relaxed bengali">{question.questionText}</p>
      </div>

      {/* Sub-Questions and Answer Area */}
      <div className="space-y-6">
        {subQuestions.map((subQ, subIndex) => (
          <div key={subQ.id} className="border-l-4 border-green-500 pl-4 bg-green-50 rounded-r-lg py-3">
            <div className="flex justify-between items-center mb-3">
              <p className="text-base font-semibold text-gray-800 bengali">
                <span className="font-bold text-green-700 mr-2 bengali">{subQ.key}.</span> 
                {subQ.text}
              </p>
              <span className="text-sm font-medium bg-green-200 text-green-800 px-2 py-1 rounded-full">
                {subQ.points || 1} নম্বর
              </span>
            </div>
            <textarea
              value={localAnswer[subQ.id] || ''}
              onChange={(e) => handleSubQChange(subQ.id, e.target.value)}
              placeholder={`${subQ.key} নং প্রশ্নের উত্তর এখানে লিখুন...`}
              rows={Math.max(3, Math.ceil((subQ.points || 1) * 0.8))}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition bengali text-sm resize-y"
              disabled={isSubmitted || showResults}
              readOnly={showResults}
            />
            <div className="text-xs text-gray-500 mt-1 bengali">
              আনুমানিক শব্দ সংখ্যা: {localAnswer[subQ.id] ? Math.ceil(localAnswer[subQ.id].length / 5) : 0}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// --- Main Exam Component ---
export default function ExamParticipationPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id;
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // State Management
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [showInstructions, setShowInstructions] = useState(true);
  const [examStarted, setExamStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [examResult, setExamResult] = useState(null);
  const [score, setScore] = useState({ obtained: 0, total: 0 });

  const questions = exam?.questions || [];
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = currentQuestion ? userAnswers[currentQuestion._id] : null;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // Fetch exam data
  useEffect(() => {
    fetchExam();
  }, [examId]);

  // Timer effect
  useEffect(() => {
    if (!examStarted || isSubmitted || isTimerPaused || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, isSubmitted, isTimerPaused, timeRemaining]);

  // Update score when answers change or exam loads
  useEffect(() => {
    if (exam) {
      const newScore = calculateScore();
      setScore(newScore);
    }
  }, [userAnswers, exam]);

  const fetchExam = async () => {
    try {
      const response = await axiosSecure.get(`/api/exams/${examId}`);
      if (response.data.success) {
        const examData = response.data.data;
        setExam(examData);
        setTimeRemaining((examData.duration || 60) * 60);
        
        // Initialize answers
        const initialAnswers = {};
        examData.questions?.forEach(q => {
          if (q.questionType === 'multiple-choice') {
            initialAnswers[q._id] = null;
          } else if (q.questionType === 'creative') {
            initialAnswers[q._id] = q.subQuestions?.reduce((acc, sq) => ({...acc, [sq.id]: ''}), {}) || {};
          } else {
            initialAnswers[q._id] = '';
          }
        });
        setUserAnswers(initialAnswers);
      }
    } catch (error) {
      console.error('Error fetching exam:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- Answer Handling ---
  const handleAnswerChange = useCallback((newAnswer) => {
    if (!currentQuestion) return;
    
    setUserAnswers(prevAnswers => ({
      ...prevAnswers,
      [currentQuestion._id]: newAnswer,
    }));
  }, [currentQuestion]);

  // --- Navigation ---
  const navigateToQuestion = useCallback((index) => {
    if (index >= 0 && index < totalQuestions && !isSubmitted && examStarted) {
      setCurrentQuestionIndex(index);
    }
  }, [totalQuestions, isSubmitted, examStarted]);

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      navigateToQuestion(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      navigateToQuestion(currentQuestionIndex - 1);
    }
  };

  // --- Flag Management ---
  const handleToggleFlag = useCallback((questionId) => {
    setFlaggedQuestions(prev => {
      const newFlags = new Set(prev);
      if (newFlags.has(questionId)) {
        newFlags.delete(questionId);
      } else {
        newFlags.add(questionId);
      }
      return newFlags;
    });
  }, []);

  // --- Submission Handlers ---
  const handleAutoSubmit = async () => {
    if (!isSubmitted && exam) {
      await submitExam();
    }
  };

  const handleManualSubmit = () => {
    if (window.confirm('আপনি কি নিশ্চিত যে আপনি পরীক্ষা জমা দিতে চান? একবার জমা দিলে আর পরিবর্তন করা যাবে না।')) {
      submitExam();
    }
  };

  const submitExam = async () => {
    if (!exam) return;
    
    try {
      const submissionData = {
        examId: examId,
        studentId: user?.uid,
        studentName: user?.displayName || user?.email,
        answers: userAnswers,
        timeSpent: (exam.duration || 60) * 60 - timeRemaining,
        submittedAt: new Date().toISOString()
      };

      const response = await axiosSecure.post('/api/exam-submissions', submissionData);
      
      if (response.data.success) {
        setIsSubmitted(true);
        setShowResultModal(true);
        setExamResult(response.data.data);
        
        // Update score with actual calculated score from server
        const serverScore = {
          obtained: response.data.data.obtainedMarks || 0,
          total: response.data.data.totalMarks || exam.totalMarks || 0
        };
        setScore(serverScore);
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
      alert('জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  const handleStartExam = () => {
    setExamStarted(true);
    setShowInstructions(false);
  };

  const handleViewResults = () => {
    setShowResults(true);
    setShowResultModal(false);
  };

  // --- Question Status Calculation ---
  const getQuestionStatus = (question) => {
    if (!question) return 'unanswered';
    
    const answer = userAnswers[question._id];
    
    if (question.questionType === 'multiple-choice') {
      return answer !== null ? 'answered' : 'unanswered';
    } else if (question.questionType === 'creative') {
      const subAnswers = Object.values(answer || {});
      const isPartiallyAnswered = subAnswers.some(text => text && text.trim().length > 0);
      return isPartiallyAnswered ? 'answered' : 'unanswered';
    } else {
      return answer && answer.trim().length > 0 ? 'answered' : 'unanswered';
    }
  };

  // FIXED: Calculate score properly
  const calculateScore = () => {
    if (!exam) return { obtained: 0, total: 0 };
    
    let obtained = 0;
    let total = exam.totalMarks || 0;
    
    questions.forEach(question => {
      if (question.questionType === 'multiple-choice') {
        const userAnswer = userAnswers[question._id];
        const correctOptionIndex = question.options?.findIndex(opt => opt.isCorrect);
        
        if (userAnswer === correctOptionIndex) {
          obtained += question.points || 1;
        }
      }
      // For creative questions, you'd need server-side evaluation
    });
    
    return { obtained, total };
  };

  // Statistics
  const answeredCount = questions.filter(q => getQuestionStatus(q) === 'answered').length;
  const flaggedCount = flaggedQuestions.size;

  // Calculate correct and incorrect counts for results
  const calculateResultStats = () => {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    questions.forEach(question => {
      if (question.questionType === 'multiple-choice') {
        const userAnswer = userAnswers[question._id];
        const correctAnswer = question.options?.findIndex(opt => opt.isCorrect);
        
        if (userAnswer === null || userAnswer === undefined) {
          unanswered++;
        } else if (userAnswer === correctAnswer) {
          correct++;
        } else {
          incorrect++;
        }
      } else {
        // For other question types, just check if answered
        const isAnswered = getQuestionStatus(question) === 'answered';
        if (isAnswered) {
          // These need manual grading, so we don't count as correct/incorrect
          unanswered++; // Count as unanswered for auto-grading purposes
        } else {
          unanswered++;
        }
      }
    });

    return { correct, incorrect, unanswered };
  };

  const resultStats = calculateResultStats();

  // --- UI Components ---
  const renderQuestion = useMemo(() => {
    if (!examStarted || !currentQuestion) return null;

    const props = {
      question: currentQuestion,
      index: currentQuestionIndex,
      answer: currentAnswer,
      handleAnswerChange,
      isSubmitted,
      isFlagged: flaggedQuestions.has(currentQuestion._id),
      onToggleFlag: handleToggleFlag,
      showResults,
      correctAnswer: currentQuestion.options?.findIndex(opt => opt.isCorrect)
    };

    if (currentQuestion.questionType === 'multiple-choice') {
      return <MCQDisplay {...props} />;
    } else if (currentQuestion.questionType === 'creative') {
      return <SrijonshilDisplay {...props} />;
    } else {
      return (
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
          <p className="text-lg font-semibold text-gray-800 bengali mb-4">
            {currentQuestion.questionText}
          </p>
          <textarea
            value={currentAnswer || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="আপনার উত্তর এখানে লিখুন..."
            rows={6}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bengali resize-y"
            disabled={isSubmitted || showResults}
            readOnly={showResults}
          />
        </div>
      );
    }
  }, [currentQuestion, currentQuestionIndex, currentAnswer, handleAnswerChange, isSubmitted, flaggedQuestions, handleToggleFlag, examStarted, showResults]);

  // FIXED: Result Modal with accurate data
  const ResultModal = ({ onClose }) => {
    const answeredCount = questions.filter(q => getQuestionStatus(q) === 'answered').length;
    const unansweredCount = totalQuestions - answeredCount;
    
    // Use examResult data if available, otherwise use local calculation
    const finalScore = examResult ? {
      obtained: examResult.obtainedMarks || 0,
      total: examResult.totalMarks || 0
    } : score;

    const correctCount = examResult ? examResult.correctAnswers : resultStats.correct;
    const incorrectCount = examResult ? examResult.incorrectAnswers : resultStats.incorrect;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
          <div className="text-center mb-6">
            <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-2 bengali">পরীক্ষা সম্পন্ন!</h2>
            <p className="text-gray-600 bengali">আপনার উত্তরগুলি সফলভাবে জমা দেওয়া হয়েছে</p>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-medium bengali">প্রাপ্ত নম্বর</span>
              <span className="font-bold text-blue-800">{finalScore.obtained}/{finalScore.total}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-medium bengali">সঠিক উত্তর</span>
              <span className="font-bold text-green-800">{correctCount} টি</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="font-medium bengali">ভুল উত্তর</span>
              <span className="font-bold text-red-800">{incorrectCount} টি</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="font-medium bengali">চিহ্নিত প্রশ্ন</span>
              <span className="font-bold text-purple-800">{flaggedCount} টি</span>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition duration-200 bengali"
            >
              বন্ধ করুন
            </button>
            <button
              onClick={handleViewResults}
              className="flex-1 py-3 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200 bengali"
            >
              উত্তর দেখুন
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Instructions Modal
  const InstructionsModal = () => {
    if (!exam) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-6">
            <BookOpen className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2 bengali">{exam.title}</h2>
            <p className="text-gray-600 bengali">বিষয়: {exam.subject}</p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded">
            <h3 className="font-bold text-gray-800 mb-3 bengali">পরীক্ষার নির্দেশাবলী:</h3>
            <div className="text-sm text-gray-700 space-y-2 bengali whitespace-pre-line">
              {exam.instructions || 'কোন নির্দেশাবলী প্রদান করা হয়নি।'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="font-medium bengali">মোট সময়:</span>
              <span className="float-right font-bold">{exam.duration || 60} মিনিট</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="font-medium bengali">মোট নম্বর:</span>
              <span className="float-right font-bold">{exam.totalMarks || 0}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="font-medium bengali">মোট প্রশ্ন:</span>
              <span className="float-right font-bold">{totalQuestions} টি</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="font-medium bengali">পাস নম্বর:</span>
              <span className="float-right font-bold">{exam.passingMarks || 0}</span>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleStartExam}
              className="px-8 py-3 bg-green-500 text-white font-bold rounded-lg shadow-lg hover:bg-green-600 transition duration-200 bengali text-lg"
            >
              পরীক্ষা শুরু করুন
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 bengali">পরীক্ষা লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <p className="text-red-600 bengali">পরীক্ষা পাওয়া যায়নি</p>
        </div>
      </div>
    );
  }

  if (showInstructions) {
    return <InstructionsModal />;
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Serif+Bengali:wght@400;500;600;700&display=swap');
          .bengali { font-family: 'Noto Serif Bengali', serif; }
        `}</style>

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 bengali">উত্তর পর্যালোচনা</h1>
                <p className="text-gray-600 bengali">{exam.title} - {exam.subject}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {score.obtained}/{score.total} নম্বর
                </div>
                <div className={`text-sm font-medium ${
                  score.obtained >= (exam.passingMarks || 0) ? 'text-green-600' : 'text-red-600'
                } bengali`}>
                  {score.obtained >= (exam.passingMarks || 0) ? 'পাস' : 'ফেল'}
                </div>
              </div>
            </div>
          </div>

          {/* Questions with Answers */}
          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={question._id}>
                {question.questionType === 'multiple-choice' ? (
                  <MCQDisplay
                    question={question}
                    index={index}
                    answer={userAnswers[question._id]}
                    handleAnswerChange={() => {}}
                    isSubmitted={true}
                    isFlagged={false}
                    onToggleFlag={() => {}}
                    showResults={true}
                    correctAnswer={question.options?.findIndex(opt => opt.isCorrect)}
                  />
                ) : question.questionType === 'creative' ? (
                  <SrijonshilDisplay
                    question={question}
                    index={index}
                    answer={userAnswers[question._id]}
                    handleAnswerChange={() => {}}
                    isSubmitted={true}
                    isFlagged={false}
                    onToggleFlag={() => {}}
                    showResults={true}
                  />
                ) : (
                  <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm font-bold">
                        {index + 1}
                      </span>
                      <p className="text-lg font-semibold text-gray-800 bengali">
                        {question.questionText}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <p className="text-sm text-gray-700 bengali">
                        {userAnswers[question._id] || 'কোন উত্তর দেওয়া হয়নি'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={() => router.push('/dashboard/student')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors bengali"
            >
              ড্যাশবোর্ডে ফিরে যান
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors bengali flex items-center space-x-2"
            >
              <Printer size={18} />
              <span>প্রিন্ট করুন</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Serif+Bengali:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .bengali { font-family: 'Noto Serif Bengali', serif; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 bengali">{exam.title}</h1>
                <p className="text-sm text-blue-600 font-medium bengali">বিষয়: {exam.subject}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Timer Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsTimerPaused(!isTimerPaused)}
                  disabled={isSubmitted}
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50"
                  title={isTimerPaused ? "Resume Timer" : "Pause Timer"}
                >
                  {isTimerPaused ? <Play size={20} /> : <Pause size={20} />}
                </button>
                
                <div className={`text-right p-3 rounded-lg border-2 ${
                  timeRemaining < 300 ? 'bg-red-100 border-red-300 animate-pulse' : 'bg-white border-gray-200'
                }`}>
                  <p className="text-xs font-medium text-gray-700 bengali">সময় বাকি</p>
                  <p className={`text-xl font-extrabold ${timeRemaining < 300 ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatTime(timeRemaining)}
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              {!isSubmitted && (
                <button
                  onClick={handleManualSubmit}
                  disabled={isSubmitted}
                  className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-200 disabled:opacity-50 bengali flex items-center space-x-2"
                >
                  <Send size={18} />
                  <span>জমা দিন</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
        
        {/* Question Area */}
        <div className="lg:w-8/12">
          {isSubmitted ? (
            <div className="p-8 bg-green-50 border-4 border-green-300 rounded-xl text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-700 mb-2 bengali">পরীক্ষা শেষ</h2>
              <p className="text-gray-600 bengali">আপনার উত্তরগুলি সফলভাবে রেকর্ড করা হয়েছে।</p>
              <button
                onClick={handleViewResults}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors bengali"
              >
                ফলাফল দেখুন
              </button>
            </div>
          ) : (
            <>
              {renderQuestion}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6 p-4 bg-white rounded-xl shadow-inner border border-gray-100">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0 || isSubmitted}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition disabled:opacity-50"
                >
                  <ChevronLeft size={18} />
                  <span className="bengali">পূর্ববর্তী</span>
                </button>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="bengali">প্রশ্ন {currentQuestionIndex + 1} / {totalQuestions}</span>
                </div>

                <button
                  onClick={isLastQuestion ? handleManualSubmit : handleNext}
                  disabled={isSubmitted}
                  className={`flex items-center space-x-2 px-6 py-3 text-white font-semibold rounded-lg shadow-md transition disabled:opacity-50 ${
                    isLastQuestion ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  <span className="bengali">{isLastQuestion ? 'জমা দিন' : 'পরবর্তী'}</span>
                  {!isLastQuestion && <ChevronRight size={18} />}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Navigation Panel */}
        <div className="lg:w-4/12">
          <div className="sticky top-24 space-y-4">
            {/* Quick Stats */}
            <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-3 bengali">পরিসংখ্যান</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{answeredCount}</div>
                  <div className="text-green-700 bengali">উত্তর দেওয়া</div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">{totalQuestions - answeredCount}</div>
                  <div className="text-red-700 bengali">বাকি</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">{flaggedCount}</div>
                  <div className="text-purple-700 bengali">চিহ্নিত</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{totalQuestions}</div>
                  <div className="text-blue-700 bengali">মোট</div>
                </div>
              </div>
            </div>

            {/* Question Navigation */}
            <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-3 bengali">প্রশ্ন নেভিগেশন</h3>
              
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, index) => {
                  const status = getQuestionStatus(q);
                  const isFlagged = flaggedQuestions.has(q._id);
                  
                  let bgColor = 'bg-gray-100 border-gray-300';
                  if (index === currentQuestionIndex) {
                    bgColor = 'bg-blue-500 text-white border-blue-600 transform scale-110 shadow-lg';
                  } else if (status === 'answered') {
                    bgColor = 'bg-green-500 text-white border-green-600';
                  }
                  
                  if (isFlagged) {
                    bgColor += ' border-2 border-red-500';
                  }

                  return (
                    <button
                      key={q._id}
                      onClick={() => navigateToQuestion(index)}
                      disabled={isSubmitted}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition duration-150 border ${bgColor} ${
                        isSubmitted ? 'cursor-default' : 'hover:shadow-md hover:scale-105'
                      }`}
                      title={`প্রশ্ন ${index + 1}${isFlagged ? ' (চিহ্নিত)' : ''}`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Result Modal */}
      {showResultModal && <ResultModal onClose={() => setShowResultModal(false)} />}
    </div>
  );
}