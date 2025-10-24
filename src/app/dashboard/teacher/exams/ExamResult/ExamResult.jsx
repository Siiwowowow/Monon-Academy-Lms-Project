"use client";
import React from "react";
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaChartBar,
  FaArrowLeft,
  FaHome
} from "react-icons/fa";
import Link from "next/link";

const ExamResult = ({ questions, studentAnswers, score, total, examTitle, onRetake }) => {
  // Calculate correct count
  const correctCount = questions.filter((q, index) => {
    const studentAnswer = studentAnswers[index];
    const correctOptionIndex = q.correctAnswer?.charCodeAt(0) - 65;
    const correctOptionText = q.options[correctOptionIndex];
    return studentAnswer === correctOptionText;
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center border border-blue-200">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <FaChartBar className="text-white text-3xl" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Exam Completed!</h1>
          <p className="text-gray-600 mb-6">{examTitle}</p>
          
          {/* Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-2xl font-bold text-green-600">{score}/{total}</div>
              <div className="text-sm text-green-700">Total Score</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{correctCount}</div>
              <div className="text-sm text-blue-700">Correct Answers</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">{questions.length - correctCount}</div>
              <div className="text-sm text-orange-700">Incorrect Answers</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <button
              onClick={onRetake}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <FaArrowLeft />
              Retake Exam
            </button>
            <Link href="/dashboard/student">
              <button className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center justify-center gap-2">
                <FaHome />
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>

        {/* Questions Review */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Detailed Review</h2>
          {questions.map((q, index) => {
            const studentAnswer = studentAnswers[index];
            const correctOptionIndex = q.correctAnswer?.charCodeAt(0) - 65;
            const correctOptionText = q.options[correctOptionIndex];
            const isCorrect = studentAnswer === correctOptionText;

            return (
              <QuestionReviewCard
                key={index}
                question={q}
                questionNumber={index + 1}
                studentAnswer={studentAnswer}
                correctAnswer={correctOptionText}
                isCorrect={isCorrect}
                marks={q.marks || 1}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Separate Question Review Card Component
const QuestionReviewCard = ({ question, questionNumber, studentAnswer, correctAnswer, isCorrect, marks }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Question Header */}
      <div className={`p-4 border-l-4 ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
              {isCorrect ? (
                <FaCheckCircle className="text-white text-sm" />
              ) : (
                <FaTimesCircle className="text-white text-sm" />
              )}
            </div>
            <div>
              <span className="text-lg font-semibold text-gray-900">Question {questionNumber}</span>
              <div className="text-sm text-gray-600 mt-1">
                Marks: <span className={`font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? `+${marks}` : '0'}
                </span>
              </div>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isCorrect ? 'Correct' : 'Incorrect'}
          </span>
        </div>
      </div>

      {/* Question Content */}
      <div className="p-6">
        <p className="text-gray-800 text-lg mb-6 font-medium">{question.questionText}</p>
        
        {/* Options */}
        <div className="space-y-3">
          {question.options.map((opt, oIndex) => {
            const isSelected = studentAnswer === opt;
            const isRightAnswer = correctAnswer === opt;
            
            return (
              <div
                key={oIndex}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  isSelected && isCorrect
                    ? 'bg-green-100 border-green-500'
                    : isSelected && !isCorrect
                    ? 'bg-red-100 border-red-500'
                    : isRightAnswer
                    ? 'bg-green-50 border-green-300'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                      isSelected && isCorrect
                        ? 'bg-green-500 border-green-500 text-white'
                        : isSelected && !isCorrect
                        ? 'bg-red-500 border-red-500 text-white'
                        : isRightAnswer
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'bg-white border-gray-300 text-gray-600'
                    }`}>
                      {String.fromCharCode(65 + oIndex)}
                    </div>
                    <span className="text-gray-700">{opt}</span>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-1">
                    {isSelected && (
                      <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">Your Answer</span>
                    )}
                    {isRightAnswer && !isSelected && (
                      <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">Correct Answer</span>
                    )}
                    {isSelected && isRightAnswer && (
                      <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">Correct!</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExamResult;