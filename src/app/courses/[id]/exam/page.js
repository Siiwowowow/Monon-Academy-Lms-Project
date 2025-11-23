"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Home, 
  Eye, 
  EyeOff,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Award,
  BarChart3,
  Target,
  ArrowRight
} from 'lucide-react';
import useAxiosSecure from '@/hooks/useAxiosSecure';

export default function ExamPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const axiosSecure = useAxiosSecure();

  const lessonTitle = decodeURIComponent(searchParams.get('lesson') || '');
  const courseId = params.id;

  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [completedExams, setCompletedExams] = useState([]);
  
  // Exam state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const [questionResults, setQuestionResults] = useState([]);
  const [activeTab, setActiveTab] = useState('results'); // 'results' or 'review'

  useEffect(() => {
    const fetchCourseAndExam = async () => {
      try {
        const res = await axiosSecure.get(`/api/courses/${courseId}`);
        setCourse(res.data);
        
        // Extract all lessons in sequence for navigation
        const lessonsSequence = [];
        res.data?.curriculum?.forEach(chapter => {
          chapter.lessons?.forEach(lesson => {
            lessonsSequence.push({
              ...lesson,
              chapterTitle: chapter.chapter_title
            });
          });
        });
        setAllLessons(lessonsSequence);

        // Find the current lesson and its exam
        let foundLesson = null;
        let foundExam = null;

        for (const chapter of res.data.curriculum || []) {
          for (const lesson of chapter.lessons || []) {
            if (lesson.lesson_title === lessonTitle) {
              foundLesson = lesson;
              if (lesson.exam?.has_exam) {
                foundExam = lesson.exam;
              }
              break;
            }
          }
          if (foundLesson) break;
        }

        if (!foundLesson) {
          setError('Lesson not found');
          return;
        }

        if (!foundExam) {
          setError('No exam found for this lesson');
          return;
        }

        setCurrentLesson(foundLesson);
        setExam(foundExam);
        setTimeLeft(foundExam.duration * 60);

        // Load completed exams
        const savedExamProgress = localStorage.getItem(`exam-progress-${courseId}`);
        if (savedExamProgress) {
          setCompletedExams(JSON.parse(savedExamProgress));
        }
      } catch (err) {
        console.error('Error loading exam:', err);
        setError('Failed to load exam');
      } finally {
        setLoading(false);
      }
    };

    if (courseId && lessonTitle) {
      fetchCourseAndExam();
    }
  }, [courseId, lessonTitle, axiosSecure]);

  // Get current lesson index in the sequence
  const getCurrentLessonIndex = useCallback(() => {
    return allLessons.findIndex(lesson => 
      lesson.lesson_title === currentLesson?.lesson_title
    );
  }, [currentLesson, allLessons]);

  // Get next lesson in sequence
  const getNextLesson = useCallback(() => {
    const currentIndex = getCurrentLessonIndex();
    if (currentIndex === -1 || currentIndex >= allLessons.length - 1) {
      return null;
    }
    return allLessons[currentIndex + 1];
  }, [getCurrentLessonIndex, allLessons]);

  // Get previous lesson in sequence
  const getPreviousLesson = useCallback(() => {
    const currentIndex = getCurrentLessonIndex();
    if (currentIndex <= 0) {
      return null;
    }
    return allLessons[currentIndex - 1];
  }, [getCurrentLessonIndex, allLessons]);

  // Handle next button click - goes to next lesson in LearnPage
  const handleNextButtonClick = useCallback(() => {
    const nextLesson = getNextLesson();
    if (nextLesson) {
      // Always navigate to LearnPage for the next lesson
      router.push(`/courses/${courseId}/learn`);
    } else {
      // If no next lesson, go back to learn page
      router.push(`/courses/${courseId}/learn`);
    }
  }, [getNextLesson, courseId, router]);

  // Handle previous button click - goes to previous lesson in LearnPage
  const handlePreviousButtonClick = useCallback(() => {
    const previousLesson = getPreviousLesson();
    if (previousLesson) {
      // Always navigate to LearnPage for the previous lesson
      router.push(`/courses/${courseId}/learn`);
    }
  }, [getPreviousLesson, courseId, router]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (examStarted && timeLeft > 0 && !examFinished) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            handleFinishExam();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [examStarted, timeLeft, examFinished]);

  const startExam = () => {
    setExamStarted(true);
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateResults = () => {
    const results = exam.questions.map((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correct_answer;
      const correctOption = question.options.find(opt => opt.id === question.correct_answer);
      
      return {
        question: question.question_text,
        options: question.options,
        userAnswer,
        correctAnswer: question.correct_answer,
        correctOptionText: correctOption?.text,
        isCorrect,
        marks: isCorrect ? (question.marks || 1) : 0
      };
    });

    setQuestionResults(results);
    return results;
  };

  const handleFinishExam = () => {
    setExamFinished(true);
    setExamStarted(false);
    
    const results = calculateResults();
    let calculatedScore = 0;
    results.forEach(result => {
      calculatedScore += result.marks;
    });
    
    setScore(calculatedScore);
    
    // Mark exam as completed
    const savedExamProgress = localStorage.getItem(`exam-progress-${courseId}`);
    let updatedCompletedExams = savedExamProgress ? JSON.parse(savedExamProgress) : [];
    if (!updatedCompletedExams.includes(lessonTitle)) {
      updatedCompletedExams.push(lessonTitle);
      localStorage.setItem(`exam-progress-${courseId}`, JSON.stringify(updatedCompletedExams));
      setCompletedExams(updatedCompletedExams);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleBack = () => {
    if (examStarted && !examFinished) {
      const confirmLeave = window.confirm(
        'Are you sure you want to leave? Your progress will be lost.'
      );
      if (!confirmLeave) return;
    }
    router.back();
  };

  const handleGoToCourse = () => {
    router.push(`/courses/${courseId}`);
  };

  const handleGoToLearn = () => {
    router.push(`/courses/${courseId}/learn`);
  };

  // Get adjacent lessons for display
  const previousLesson = getPreviousLesson();
  const nextLesson = getNextLesson();

  // Loading Component
  const LoadingComponent = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="animate-spin h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"></div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Exam</h3>
        <p className="text-gray-600">Preparing your assessment...</p>
      </div>
    </div>
  );

  // Error Component
  const ErrorComponent = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Exam Not Found</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={handleBack}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-200"
          >
            Go Back
          </button>
          <button
            onClick={handleGoToCourse}
            className="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Course
          </button>
        </div>
      </div>
    </div>
  );

  // No Exam Component
  const NoExamComponent = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
        <BookOpen className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">No Exam Available</h1>
        <p className="text-gray-600 mb-6">This lesson does not have an exam.</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={handleBack}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-200"
          >
            Go Back
          </button>
          <button
            onClick={handleGoToCourse}
            className="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Course
          </button>
        </div>
      </div>
    </div>
  );

  // Results Overview Component
  const ResultsOverview = ({ totalMarks, percentage, passed, correctAnswers }) => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl text-center">
        <div className="text-2xl font-bold mb-1">{score}/{totalMarks}</div>
        <div className="text-blue-100 text-sm">Score</div>
        <Award className="w-8 h-8 mx-auto mt-2 opacity-80" />
      </div>
      
      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl text-center">
        <div className="text-2xl font-bold mb-1">{Math.round(percentage)}%</div>
        <div className="text-green-100 text-sm">Percentage</div>
        <BarChart3 className="w-8 h-8 mx-auto mt-2 opacity-80" />
      </div>
      
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl text-center">
        <div className="text-2xl font-bold mb-1">{correctAnswers}/{exam.questions.length}</div>
        <div className="text-purple-100 text-sm">Correct</div>
        <CheckCircle className="w-8 h-8 mx-auto mt-2 opacity-80" />
      </div>
      
      <div className={`p-6 rounded-2xl text-center ${
        passed 
          ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white' 
          : 'bg-gradient-to-br from-red-500 to-red-600 text-white'
      }`}>
        <div className="text-2xl font-bold mb-1">{passed ? 'Passed' : 'Failed'}</div>
        <div className={passed ? 'text-emerald-100' : 'text-red-100'}>Result</div>
        <Target className="w-8 h-8 mx-auto mt-2 opacity-80" />
      </div>
    </div>
  );

  // Answer Review Component
  const AnswerReview = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Answer Review</h3>
        <button
          onClick={() => setShowAnswers(!showAnswers)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 shadow-lg"
        >
          {showAnswers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{showAnswers ? 'Hide Answers' : 'Show Answers'}</span>
        </button>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {questionResults.map((result, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div className="flex items-start space-x-3 flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                  result.isCorrect ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-pink-600'
                }`}>
                  {index + 1}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 leading-relaxed">{result.question}</h4>
              </div>
              <div className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                result.isCorrect 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {result.isCorrect ? 'Correct' : 'Incorrect'}
              </div>
            </div>

            <div className="space-y-3">
              {result.options.map((option) => {
                const isUserAnswer = option.id === result.userAnswer;
                const isCorrectAnswer = option.id === result.correctAnswer;
                
                let optionClass = "p-4 rounded-xl border-2 transition-all duration-200 ";
                
                if (showAnswers) {
                  if (isCorrectAnswer) {
                    optionClass += "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 text-green-800 shadow-sm";
                  } else if (isUserAnswer && !isCorrectAnswer) {
                    optionClass += "bg-gradient-to-r from-red-50 to-pink-50 border-red-300 text-red-800 shadow-sm";
                  } else {
                    optionClass += "bg-gray-50 border-gray-200 text-gray-600";
                  }
                } else {
                  if (isUserAnswer) {
                    optionClass += result.isCorrect 
                      ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 text-green-800 shadow-sm" 
                      : "bg-gradient-to-r from-red-50 to-pink-50 border-red-300 text-red-800 shadow-sm";
                  } else {
                    optionClass += "bg-gray-50 border-gray-200 text-gray-600";
                  }
                }

                return (
                  <div key={option.id} className={optionClass}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm sm:text-base">{option.text}</span>
                      <div className="flex items-center space-x-2">
                        {showAnswers && isCorrectAnswer && (
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        )}
                        {isUserAnswer && !isCorrectAnswer && (
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                        {isUserAnswer && (
                          <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-lg">Your Answer</span>
                        )}
                        {showAnswers && isCorrectAnswer && !isUserAnswer && (
                          <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-lg">Correct Answer</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {!result.isCorrect && (
              <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl">
                <p className="text-yellow-800 text-sm font-medium">
                  <span className="font-bold">Correct Answer:</span> {result.correctOptionText}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Exam Summary Component
  const ExamSummary = ({ totalMarks, correctAnswers }) => (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Exam Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-200">
          <span className="text-gray-600 font-medium">Total Questions</span>
          <span className="font-bold text-gray-900">{exam.questions.length}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-200">
          <span className="text-gray-600 font-medium">Correct Answers</span>
          <span className="font-bold text-green-600">{correctAnswers}/{exam.questions.length}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-200">
          <span className="text-gray-600 font-medium">Passing Marks</span>
          <span className="font-bold text-gray-900">{exam.passing_marks}/{totalMarks}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-200">
          <span className="text-gray-600 font-medium">Time Duration</span>
          <span className="font-bold text-gray-900">{exam.duration} minutes</span>
        </div>
      </div>
    </div>
  );

  // Navigation Buttons Component
  const NavigationButtons = ({ passed }) => (
    <div className="flex flex-col sm:flex-row gap-4 mt-8">
      <button
        onClick={handleGoToLearn}
        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Current Lesson</span>
      </button>
      
      <button
        onClick={() => {
          setExamFinished(false);
          setExamStarted(false);
          setCurrentQuestionIndex(0);
          setAnswers({});
          setTimeLeft(exam.duration * 60);
          setScore(0);
          setShowAnswers(false);
          setQuestionResults([]);
          setActiveTab('results');
        }}
        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 shadow-lg"
      >
        Retake Exam
      </button>
      
      <button
        onClick={handleNextButtonClick}
        disabled={!nextLesson}
        className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
          nextLesson 
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90' 
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        <span>Next Lesson</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );

  // Tab Navigation Component
  const TabNavigation = () => (
    <div className="flex border-b border-gray-200 mb-8">
      <button
        onClick={() => setActiveTab('results')}
        className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-200 ${
          activeTab === 'results'
            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Results Overview
      </button>
      <button
        onClick={() => setActiveTab('review')}
        className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-200 ${
          activeTab === 'review'
            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Answer Review
      </button>
    </div>
  );

  if (loading) return <LoadingComponent />;
  if (error) return <ErrorComponent />;
  if (!exam) return <NoExamComponent />;

  if (examFinished) {
    const totalMarks = exam.questions.reduce((total, q) => total + (q.marks || 1), 0);
    const percentage = (score / totalMarks) * 100;
    const passed = percentage >= (exam.passing_marks / totalMarks) * 100;
    const correctAnswers = questionResults.filter(r => r.isCorrect).length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 font-semibold transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">Exam Results</h1>
            <div className="w-20"></div> {/* Spacer for alignment */}
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 mb-8">
            {/* Results Header */}
            <div className="text-center mb-8">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
                passed ? 'bg-gradient-to-r from-green-100 to-emerald-100' : 'bg-gradient-to-r from-red-100 to-pink-100'
              }`}>
                {passed ? (
                  <CheckCircle className="w-12 h-12 text-green-500" />
                ) : (
                  <XCircle className="w-12 h-12 text-red-500" />
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {passed ? 'Congratulations! 🎉' : 'Keep Practicing! 💪'}
              </h1>
              <p className="text-gray-600 text-lg">
                {passed ? 'You have successfully passed the exam!' : 'Review the material and try again.'}
              </p>
            </div>

            {/* Results Overview */}
            <ResultsOverview 
              totalMarks={totalMarks}
              percentage={percentage}
              passed={passed}
              correctAnswers={correctAnswers}
            />

            {/* Tab Navigation */}
            <TabNavigation />

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === 'results' ? (
                <>
                  <ExamSummary 
                    totalMarks={totalMarks}
                    correctAnswers={correctAnswers}
                  />
                  <NavigationButtons passed={passed} />
                </>
              ) : (
                <AnswerReview />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 font-semibold transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>

          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{exam.title}</h1>
              <p className="text-gray-600 text-lg">{exam.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                <div className="flex items-center mb-3">
                  <Clock className="w-6 h-6 text-blue-500 mr-3" />
                  <span className="font-semibold text-blue-700">Duration</span>
                </div>
                <p className="text-blue-600 text-xl font-bold">{exam.duration} minutes</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
                <div className="font-semibold text-green-700 mb-3">Total Marks</div>
                <p className="text-green-600 text-xl font-bold">{exam.total_marks} marks</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
                <div className="font-semibold text-orange-700 mb-3">Passing Marks</div>
                <p className="text-orange-600 text-xl font-bold">{exam.passing_marks} marks</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
                <div className="font-semibold text-purple-700 mb-3">Questions</div>
                <p className="text-purple-600 text-xl font-bold">{exam.questions.length} questions</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6 mb-6">
              <h3 className="font-semibold text-yellow-800 mb-3 text-lg">Instructions:</h3>
              <ul className="text-yellow-700 space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>You have {exam.duration} minutes to complete the exam</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Read each question carefully before answering</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>You cannot go back once the exam is submitted</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Make sure you have stable internet connection</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>After completion, you can review all answers with explanations</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleBack}
                className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-4 px-6 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 shadow-lg"
              >
                Go Back
              </button>
              <button
                onClick={startExam}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:opacity-90 transition-all duration-200 shadow-lg"
              >
                Start Exam
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Exam Component
  const currentQuestion = exam?.questions?.[currentQuestionIndex];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors mb-3"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go Back</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{exam.title}</h1>
              <p className="text-gray-600">Question {currentQuestionIndex + 1} of {exam.questions.length}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </div>
              <button
                onClick={handleFinishExam}
                className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 shadow-lg"
              >
                Submit Exam
              </button>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 leading-relaxed">
              {currentQuestion.question_text}
            </h2>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    answers[currentQuestionIndex] === option.id
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-md'
                      : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    value={option.id}
                    checked={answers[currentQuestionIndex] === option.id}
                    onChange={() => handleAnswerSelect(currentQuestionIndex, option.id)}
                    className="w-5 h-5 text-blue-500 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-4 text-gray-700 font-medium text-sm sm:text-base">
                    {option.text}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                currentQuestionIndex === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:opacity-90 shadow-lg'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center justify-center gap-2 flex-wrap">
              {exam.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200 shadow ${
                    index === currentQuestionIndex
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white transform scale-110'
                      : answers[index]
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={currentQuestionIndex === exam.questions.length - 1 ? handleFinishExam : handleNextQuestion}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 shadow-lg"
            >
              <span>{currentQuestionIndex === exam.questions.length - 1 ? 'Finish Exam' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Answered: {Object.keys(answers).length}/{exam.questions.length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Time Left: {formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}