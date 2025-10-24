"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useAuth from "@/hooks/useAuth";
import { toast } from "react-hot-toast";
import { 
  FaClock, 
  FaBook, 
  FaGraduationCap, 
  FaPaperPlane, 
  FaArrowRight,
  FaListOl
} from "react-icons/fa";
import ExamResult from "../ExamResult/ExamResult";

export default function TakeExamPage() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { id } = useParams();

  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  // Fetch exam by ID
  const { data: exam, isLoading, isError } = useQuery({
    queryKey: ["exam", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/exams/${id}`);
      return res.data.exam;
    },
    onError: () => toast.error("Failed to load exam"),
  });

  // Initialize timer when exam loads
  useEffect(() => {
    if (exam?.duration) {
      setTimeLeft(exam.duration * 60); // Convert minutes to seconds
    }
  }, [exam]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Calculate progress
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = exam?.questions?.length || 0;
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle option selection
  const handleAnswerChange = (qIndex, option) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  // Auto submit when time is up
  const handleAutoSubmit = async () => {
    toast.error("⏰ Time's up! Submitting your exam...");
    
    try {
      const res = await axiosSecure.post(`/api/exams/${id}/submit`, {
        studentEmail: user?.email,
        answers,
      });

      if (res.data.success) {
        toast.success(`Auto-submitted! You scored ${res.data.score} out of ${res.data.total}`);
        setSubmittedAnswers(answers);
        setScore(res.data.score);
        setTotal(res.data.total);
        setShowResult(true);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error auto-submitting exam");
    }
  };

  // Manual submit
  const handleSubmit = async () => {
    try {
      const res = await axiosSecure.post(`/api/exams/${id}/submit`, {
        studentEmail: user?.email,
        answers,
      });

      if (res.data.success) {
        toast.success(`🎉 You scored ${res.data.score} out of ${res.data.total}`);
        setSubmittedAnswers(answers);
        setScore(res.data.score);
        setTotal(res.data.total);
        setShowResult(true);
      } else {
        toast.error("Failed to submit exam");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error submitting exam");
    }
  };

  // Handle retake exam
  const handleRetake = () => {
    setShowResult(false);
    setAnswers({});
    setSubmittedAnswers({});
    setTimeLeft(exam?.duration * 60 || 0);
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading exam...</p>
      </div>
    </div>
  );

  if (isError || !exam) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center border border-red-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Exam Not Found</h2>
        <p className="text-gray-600">The exam you're looking for doesn't exist or has been removed.</p>
      </div>
    </div>
  );

  if (showResult) {
    return (
      <ExamResult
        questions={exam.questions}
        studentAnswers={submittedAnswers}
        score={score}
        total={total}
        examTitle={exam.title}
        onRetake={handleRetake}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Exam Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-blue-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{exam.title}</h1>
              <p className="text-gray-600 text-sm mb-3">{exam.description}</p>
              
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center space-x-2 text-gray-700 text-sm">
                  <FaBook className="text-blue-500 text-xs" />
                  <span><strong>Subject:</strong> {exam.subject || "General"}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700 text-sm">
                  <FaGraduationCap className="text-green-500 text-xs" />
                  <span><strong>Level:</strong> {exam.educationLevel || "SSC"}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700 text-sm">
                  <FaClock className="text-orange-500 text-xs" />
                  <span><strong>Time Left:</strong> {formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>
            
            {/* Progress Card */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 min-w-40">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <FaListOl className="text-blue-600 text-sm" />
                  <div className="text-xl font-bold text-blue-600">{answeredCount}/{totalQuestions}</div>
                </div>
                <div className="text-xs text-blue-700 mb-2">Questions Answered</div>
                <div className="w-full bg-blue-200 rounded-full h-1.5 mb-1">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-blue-600">{Math.round(progress)}% Complete</div>
              </div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (answeredCount === totalQuestions) {
              handleSubmit();
            } else {
              toast.error(`Please answer all ${totalQuestions} questions before submitting.`);
            }
          }}
          className="space-y-4"
        >
          {exam.questions.map((q, qIndex) => (
            <QuestionCard
              key={qIndex}
              question={q}
              questionNumber={qIndex + 1}
              selectedAnswer={answers[qIndex]}
              onAnswerChange={(option) => handleAnswerChange(qIndex, option)}
            />
          ))}

          {/* Submit Button */}
          <div className="bg-white rounded-xl shadow-lg p-4 border border-green-200 sticky bottom-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-center sm:text-left">
                <p className="text-gray-700 text-sm font-medium">
                  {answeredCount === totalQuestions ? (
                    <span className="text-green-600">✅ All questions answered! Ready to submit.</span>
                  ) : (
                    <span className="text-orange-600">
                      ⚠️ {totalQuestions - answeredCount} question(s) remaining
                    </span>
                  )}
                </p>
              </div>
              <button
                type="submit"
                disabled={answeredCount !== totalQuestions}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm"
              >
                <FaPaperPlane className="text-xs" />
                <span>Submit Exam</span>
                <FaArrowRight className="text-xs" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// Separate Question Card Component
const QuestionCard = ({ question, questionNumber, selectedAnswer, onAnswerChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Question Header */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-xs">{questionNumber}</span>
          </div>
          <h3 className="text-base font-semibold text-gray-900">Question {questionNumber}</h3>
        </div>
        <p className="text-gray-800 text-sm font-medium">{question.questionText}</p>
      </div>

      {/* Options */}
      <div className="p-4 space-y-2">
        {question.options.map((opt, oIndex) => (
          <label 
            key={oIndex} 
            className={`flex items-center space-x-3 p-3 rounded border cursor-pointer transition-all duration-200 hover:border-blue-300 ${
              selectedAnswer === opt 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name={`question-${questionNumber}`}
              value={opt}
              checked={selectedAnswer === opt}
              onChange={() => onAnswerChange(opt)}
              className="hidden"
            />
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
              selectedAnswer === opt 
                ? 'border-blue-500 bg-blue-500' 
                : 'border-gray-400'
            }`}>
              {selectedAnswer === opt && (
                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
              )}
            </div>
            <span className="flex-1 text-gray-700 text-sm">{opt}</span>
            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-600 text-xs font-medium">
                {String.fromCharCode(65 + oIndex)}
              </span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};