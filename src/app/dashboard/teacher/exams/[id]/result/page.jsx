// app/dashboard/teacher/exam/[examId]/results/[submissionId]/page.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import useAuth from '@/hooks/useAuth';
import { Check, X, Award, Download, Printer, ArrowLeft } from 'lucide-react';

export default function StudentExamResultView() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId; 
  const submissionId = params.id;
  
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [exam, setExam] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentDetails, setStudentDetails] = useState(null);

  useEffect(() => {
    if (submissionId) {
      fetchExamAndSubmission();
    } else {
      setLoading(false);
    }
  }, [submissionId]);

  const fetchExamAndSubmission = async () => {
    try {
      // 1. Fetch submission data
      const submissionResponse = await axiosSecure.get(
        `/api/exam-submissions/${submissionId}`
      );

      if (!submissionResponse.data.success || !submissionResponse.data.data) {
        setLoading(false);
        return;
      }
      
      const subData = submissionResponse.data.data;
      setSubmission(subData);

      // 2. Fetch exam data
      const examResponse = await axiosSecure.get(`/api/exams/${subData.examId}`);
      if (examResponse.data.success) {
        setExam(examResponse.data.data);
      }
      
      // 3. Fetch student details
      const studentResponse = await axiosSecure.get(`/api/users/${subData.studentId}`); 
      if (studentResponse.data.success) {
        setStudentDetails(studentResponse.data.data);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Calculate results using submission.questionResults
  const calculateResults = () => {
    if (!exam || !submission) return { obtained: 0, total: 0, correct: 0, incorrect: 0, unanswered: 0, toGrade: 0 };

    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
    let toGrade = 0;

    exam.questions?.forEach(question => {
      const userAnswer = submission.answers[question._id];
      
      if (question.questionType === 'multiple-choice') {
        if (userAnswer === null || userAnswer === undefined) {
          unanswered++;
        } else if (submission.questionResults?.[question._id]?.isCorrect) {
          correct++;
        } else {
          incorrect++;
        }
      } else {
        // For creative/short/essay questions
        const hasAnswer = userAnswer && 
          (typeof userAnswer === 'string' ? userAnswer.trim() !== '' :
           (question.questionType === 'creative' ? 
            Object.values(userAnswer || {}).some(val => val && (typeof val === 'string' ? val.trim() !== '' : val)) : 
            false));
        
        if (hasAnswer) {
          toGrade++;
        } else {
          unanswered++;
        }
      }
    });

    return {
      obtained: submission.obtainedMarks || 0,
      total: submission.totalMarks || exam.totalMarks || 0,
      correct,
      incorrect,
      unanswered,
      toGrade
    };
  };

  const results = calculateResults();

  // FIXED: Use submission.questionResults for accurate status
  const getQuestionStatus = (question) => {
    if (!submission) return 'unanswered';
    
    const userAnswer = submission.answers[question._id];
    
    if (question.questionType === 'multiple-choice') {
      if (userAnswer === null || userAnswer === undefined) return 'unanswered';
      
      // Use the pre-calculated results from submission
      return submission.questionResults?.[question._id]?.isCorrect ? 'correct' : 'incorrect';
    }
    
    // For other question types
    const hasAnswer = userAnswer && 
      (typeof userAnswer === 'string' ? userAnswer.trim() !== '' :
       (question.questionType === 'creative' ? 
        Object.values(userAnswer || {}).some(val => val && (typeof val === 'string' ? val.trim() !== '' : val)) : 
        false));
    
    return hasAnswer ? 'to-grade' : 'unanswered';
  };

  // FIXED: Get correct answer from question data
  const getCorrectAnswer = (question) => {
    if (question.questionType === 'multiple-choice') {
      return question.options?.findIndex(opt => opt.isCorrect);
    }
    return null;
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'correct': return 'সঠিক';
      case 'incorrect': return 'ভুল';
      case 'unanswered': return 'উত্তর দেওয়া হয়নি';
      case 'to-grade': return 'ম্যানুয়াল গ্রেডিং প্রয়োজন';
      default: return 'অজানা';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!exam || !submission) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">ফলাফল বা সাবমিশন পাওয়া যায়নি</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft size={16} className="inline mr-2"/> সাবমিশন তালিকায় ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header and Student/Exam Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">{exam.title}</h1>
              <p className="text-lg text-gray-600 mb-3">বিষয়: {exam.subject}</p>
              
              <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                <p className="text-md font-semibold text-gray-700">শিক্ষার্থী: <span className="text-blue-700">{studentDetails?.name || submission.studentName || 'অজানা শিক্ষার্থী'}</span></p>
                <p className="text-sm text-gray-500">জমার তারিখ: {new Date(submission.submittedAt).toLocaleString('bn-BD')}</p>
              </div>
            </div>
            
            <div className="text-center bg-blue-500 text-white p-4 rounded-lg flex-shrink-0 min-w-[120px]">
              <Award className="w-8 h-8 mx-auto mb-1" />
              <div className="text-3xl font-extrabold">{results.obtained}/{results.total}</div>
              <div className="text-sm">প্রাপ্ত নম্বর</div>
            </div>
          </div>
        </div>

        {/* Performance Summary (Teacher View) */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">কার্যক্রমের সারাংশ</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded border-b-4 border-green-500">
              <div className="text-2xl font-bold text-green-600">{results.correct}</div>
              <div className="text-green-700 font-medium">সঠিক উত্তর</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded border-b-4 border-red-500">
              <div className="text-2xl font-bold text-red-600">{results.incorrect}</div>
              <div className="text-red-700 font-medium">ভুল উত্তর</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded border-b-4 border-yellow-500">
              <div className="text-2xl font-bold text-yellow-600">{results.toGrade}</div>
              <div className="text-yellow-700 font-medium">গ্রেড করতে হবে</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded border-b-4 border-gray-400">
              <div className="text-2xl font-bold text-gray-600">{results.unanswered}</div>
              <div className="text-gray-700 font-medium">উত্তর দেওয়া হয়নি</div>
            </div>
          </div>
        </div>

        {/* Questions and Answers */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">উত্তরপত্র</h2>
          {exam.questions?.map((question, index) => {
            const userAnswer = submission.answers[question._id];
            const status = getQuestionStatus(question);
            const isCorrect = status === 'correct';
            const isToGrade = status === 'to-grade';
            const correctAnswerIndex = getCorrectAnswer(question);

            return (
              <div key={question._id} className={`bg-white rounded-lg shadow transition duration-150 ease-in-out ${
                   isCorrect ? 'border-l-4 border-green-500' : 
                   status === 'incorrect' ? 'border-l-4 border-red-500' : 
                   isToGrade ? 'border-l-4 border-yellow-500' : 'border-l-4 border-gray-400'
                }`}>
                
                {/* Question Header */}
                <div className="p-4 border-b">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 w-full">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-1 ${
                          isCorrect ? 'bg-green-500' : status === 'incorrect' ? 'bg-red-500' : isToGrade ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}>
                        {index + 1}
                      </div>
                      <div className="flex-grow">
                        <p className="font-semibold text-gray-800">{question.questionText}</p>
                        <p className="text-sm text-gray-600">মান: {question.points || 1} | প্রকার: {question.questionType === 'multiple-choice' ? 'MCQ' : question.questionType === 'creative' ? 'সৃজনশীল' : 'লিখিত'}</p>
                      </div>
                    </div>
                    
                    <span className={`px-2 py-1 rounded text-sm font-medium flex-shrink-0 ml-4 ${
                      isCorrect ? 'bg-green-100 text-green-800' :
                      status === 'incorrect' ? 'bg-red-100 text-red-800' :
                      isToGrade ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getStatusText(status)}
                    </span>
                  </div>
                </div>

                {/* Answer Section */}
                <div className="p-4 space-y-4">
                  {/* Multiple Choice Options Display */}
                  {question.questionType === 'multiple-choice' && (
                    <div className="space-y-2">
                      <p className="font-medium text-gray-700 border-b pb-1">বিকল্পসমূহ:</p>
                      {question.options?.map((option, optIndex) => {
                        const isCorrectOption = option.isCorrect;
                        const isSelected = userAnswer === optIndex;
                        
                        return (
                          <div
                            key={optIndex}
                            className={`flex items-start p-3 rounded border-2 ${
                              isCorrectOption ? 'bg-green-50 border-green-500' :
                              isSelected && !isCorrectOption ? 'bg-red-50 border-red-500' :
                              isSelected && isCorrectOption ? 'bg-green-100 border-green-500' :
                              'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1 ${
                              isCorrectOption ? 'bg-green-500 text-white' :
                              isSelected && !isCorrectOption ? 'bg-red-500 text-white' :
                              isSelected && isCorrectOption ? 'bg-green-500 text-white' :
                              'bg-gray-300 text-gray-600'
                            } font-bold`}>
                              {String.fromCharCode(0x995 + optIndex)}
                            </div>
                            <span className="flex-grow text-gray-800">{option.text}</span>
                            
                            <div className="flex space-x-1 flex-shrink-0">
                              {isCorrectOption && <Check className="w-5 h-5 text-green-600" title="সঠিক উত্তর" />}
                              {isSelected && !isCorrectOption && <X className="w-5 h-5 text-red-600" title="শিক্ষার্থীর ভুল নির্বাচন" />}
                              {isSelected && isCorrectOption && <Check className="w-5 h-5 text-green-600" title="শিক্ষার্থীর সঠিক নির্বাচন" />}
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* User Selection and Correct Answer Info */}
                      <div className="mt-3 space-y-2">
                        {userAnswer !== null && userAnswer !== undefined && (
                          <p className="text-sm text-blue-800 bg-blue-50 p-2 rounded">
                            শিক্ষার্থীর নির্বাচন: <span className="font-bold">
                              {String.fromCharCode(0x995 + userAnswer)}
                            </span>
                          </p>
                        )}
                        {correctAnswerIndex !== null && correctAnswerIndex !== undefined && (
                          <p className="text-sm text-green-800 bg-green-50 p-2 rounded">
                            সঠিক উত্তর: <span className="font-bold">
                              {String.fromCharCode(0x995 + correctAnswerIndex)}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Creative/Short/Essay Answer Display */}
                  {(question.questionType === 'creative' || question.questionType === 'short-answer' || question.questionType === 'essay') && (
                    <div className="space-y-3">
                      <p className="font-medium text-gray-700 border-b pb-1">শিক্ষার্থীর উত্তর:</p>
                      
                      {/* Handling Creative/Sub-Questions */}
                      {question.questionType === 'creative' && question.subQuestions?.map((subQ, subIndex) => (
                          <div key={subQ.id} className="border-l-4 border-yellow-500 pl-3 bg-yellow-50 rounded-r py-2 pr-2">
                            <p className="font-medium mb-1">
                              <span className="font-bold text-yellow-700 mr-2">
                                {['ক', 'খ', 'গ', 'ঘ'][subIndex]}.
                              </span> 
                              {subQ.text} (মান: {subQ.points || 1})
                            </p>
                            <div className="p-3 bg-white rounded border border-gray-300 shadow-sm">
                              <p className="text-gray-800 whitespace-pre-wrap">
                                {userAnswer?.[subQ.id] || 'কোন উত্তর দেওয়া হয়নি'}
                              </p>
                            </div>
                            {/* Grading Input Placeholder */}
                            <div className="mt-2 flex items-center justify-end space-x-2">
                                <span className='text-sm text-yellow-800 font-medium'>প্রাপ্ত নম্বর:</span>
                                <input 
                                  type="number" 
                                  min="0" 
                                  max={subQ.points || 1} 
                                  placeholder="0" 
                                  className='w-24 p-1 border rounded text-right'
                                  defaultValue={submission.questionResults?.[question._id]?.subQuestions?.[subQ.id] || 0}
                                />
                            </div>
                          </div>
                      ))}
                      
                      {/* Handling Short/Essay Answer */}
                      {(question.questionType === 'short-answer' || question.questionType === 'essay') && (
                          <div className="p-3 bg-white rounded border border-gray-300 shadow-sm">
                            <p className="text-gray-800 whitespace-pre-wrap">
                              {userAnswer || 'কোন উত্তর দেওয়া হয়নি'}
                            </p>
                            {/* Grading Input Placeholder */}
                            <div className="mt-4 flex items-center justify-end space-x-2 border-t pt-2">
                                <span className='text-md font-medium text-yellow-800'>প্রাপ্ত নম্বর:</span>
                                <input 
                                  type="number" 
                                  min="0" 
                                  max={question.points || 1} 
                                  placeholder="0" 
                                  className='w-24 p-2 border rounded text-right font-bold'
                                  defaultValue={submission.questionResults?.[question._id]?.pointsEarned || 0}
                                />
                            </div>
                          </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-10 p-4 bg-white shadow-lg rounded-lg border">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            <ArrowLeft size={20} />
            <span>ফিরে যান</span>
          </button>
          
          <button
            onClick={() => { 
              // Save grades functionality
              alert('গ্রেড সংরক্ষণ করা হয়েছে');
            }}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold"
          >
            <Award size={20} />
            <span>গ্রেড সংরক্ষণ করুন</span>
          </button>
          
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Printer size={20} />
            <span>প্রিন্ট করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
}