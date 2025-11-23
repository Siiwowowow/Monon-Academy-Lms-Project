"use client";
import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useAuth from "@/hooks/useAuth";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { Tiro_Bangla } from "next/font/google";
import { 
  FaBook, 
  FaGraduationCap, 
  FaListAlt, 
  FaClock, 
  FaQuestionCircle,
  FaImage,
  FaPlus,
  FaTrash,
  FaSave,
  FaArrowLeft,
  FaEye
} from "react-icons/fa";

const tiroBangla = Tiro_Bangla({
  weight: ["400"],
  subsets: ["bengali"],
});

export default function EditExam() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const examId = params.id;

  const bangladeshiSubjects = {
    "SSC": ["Bangla 1st Paper", "Bangla 2nd Paper", "English 1st Paper", "English 2nd Paper", "Mathematics", "Physics", "Chemistry", "Biology", "ICT"],
    "HSC": ["Bangla 1st Paper", "Bangla 2nd Paper", "English 1st Paper", "English 2nd Paper", "Mathematics", "Physics", "Chemistry", "Biology", "ICT"],
    "University": ["Computer Science", "Electrical Engineering", "Business Administration", "Economics"]
  };

  const [examData, setExamData] = useState({
    title: "",
    educationLevel: "SSC",
    board: "Dhaka",
    subject: "",
    description: "",
    examType: "Model Test",
    duration: 60,
    totalMarks: 100,
    passingMarks: 33,
    createdBy: user?.displayName || "Teacher"
  });

  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch exam data
  const { data: exam, error, refetch } = useQuery({
    queryKey: ["exam", examId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/exams/${examId}`);
      return res.data.exam;
    },
    enabled: !!examId,
  });

  useEffect(() => {
    if (exam) {
      // Check if the exam belongs to the current user
      if (exam.teacherEmail !== user?.email) {
        toast.error("You are not authorized to edit this exam");
        router.push("/dashboard/teacher/exams");
        return;
      }

      setExamData({
        title: exam.title || "",
        educationLevel: exam.educationLevel || "SSC",
        board: exam.board || "Dhaka",
        subject: exam.subject || "",
        description: exam.description || "",
        examType: exam.examType || "Model Test",
        duration: exam.duration || 60,
        totalMarks: exam.totalMarks || 100,
        passingMarks: exam.passingMarks || 33,
        createdBy: exam.createdBy || user?.displayName || "Teacher"
      });
      
      // Initialize questions with existing data
      setQuestions(exam.questions?.map(q => ({
        questionText: q.questionText || "",
        options: q.options || ["", "", "", ""],
        correctAnswer: q.correctAnswer || "",
        marks: q.marks || 1,
        questionImage: null, // For new image upload
        imagePreview: q.questionImage || null, // For existing image preview
        existingImage: q.questionImage // Keep track of existing image URL
      })) || []);
      setIsLoading(false);
    }
  }, [exam, user, router]);

  // Handle question image upload
  const handleQuestionImageUpload = (qIndex, file) => {
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error("শুধুমাত্র JPG, PNG, GIF বা WebP ইমেজ আপলোড করুন");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("ইমেজের সাইজ 5MB এর কম হতে হবে");
        return;
      }

      const updated = [...questions];
      updated[qIndex].questionImage = file;
      
      const previewUrl = URL.createObjectURL(file);
      updated[qIndex].imagePreview = previewUrl;
      
      setQuestions(updated);
      toast.success("ইমেজ সফলভাবে আপলোড হয়েছে!");
    }
  };

  // Remove question image
  const handleRemoveQuestionImage = (qIndex) => {
    const updated = [...questions];
    
    if (updated[qIndex].imagePreview) {
      URL.revokeObjectURL(updated[qIndex].imagePreview);
    }
    
    updated[qIndex].questionImage = null;
    updated[qIndex].imagePreview = null;
    updated[qIndex].existingImage = null;
    setQuestions(updated);
    toast.success("ইমেজ সরানো হয়েছে");
  };

  // Update exam mutation
  const updateExamMutation = useMutation({
    mutationFn: async (examData) => {
      const formData = new FormData();
      
      const examDataForJSON = {
        ...examData.examData,
        questions: examData.questions.map(q => ({
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
          marks: q.marks,
          questionImage: q.existingImage // Keep existing image if no new upload
        }))
      };
      
      formData.append('examData', JSON.stringify(examDataForJSON));

      // Append new images
      examData.questions.forEach((question, index) => {
        if (question.questionImage) {
          formData.append(`questionImage_${index}`, question.questionImage);
        }
      });

      const res = await axiosSecure.put(`/api/exams/${examId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("পরীক্ষা সফলভাবে আপডেট হয়েছে!");
      
      // Clean up image preview URLs
      questions.forEach(q => {
        if (q.imagePreview && q.questionImage) {
          URL.revokeObjectURL(q.imagePreview);
        }
      });

      router.push("/dashboard/teacher/exams");
    },
    onError: (error) => {
      console.error('Exam update error:', error);
      toast.error(`পরীক্ষা আপডেট করতে সমস্যা: ${error.response?.data?.message || error.message}`);
    },
  });

  const handleExamDataChange = (field, value) => {
    setExamData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { 
        questionText: "", 
        options: ["", "", "", ""], 
        correctAnswer: "",
        marks: 1,
        questionImage: null,
        imagePreview: null,
        existingImage: null
      },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length > 1) {
      if (questions[index].imagePreview) {
        URL.revokeObjectURL(questions[index].imagePreview);
      }
      
      const updated = questions.filter((_, i) => i !== index);
      setQuestions(updated);
      toast.success("প্রশ্ন মুছে ফেলা হয়েছে");
    } else {
      toast.error("অন্তত একটি প্রশ্ন থাকতে হবে");
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const calculateTotalMarks = () => {
    return questions.reduce((total, question) => total + parseInt(question.marks || 0), 0);
  };

  const validateForm = () => {
    if (!examData.title.trim()) {
      toast.error("পরীক্ষার নাম দিন");
      return false;
    }

    if (!examData.subject) {
      toast.error("বিষয় নির্বাচন করুন");
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      
      if (!q.questionText.trim()) {
        toast.error(`প্রশ্ন ${i + 1} এর টেক্সট দিন`);
        return false;
      }

      if (q.options.some(opt => !opt.trim())) {
        toast.error(`প্রশ্ন ${i + 1} এর সবগুলো অপশন পূরণ করুন`);
        return false;
      }

      if (!q.correctAnswer) {
        toast.error(`প্রশ্ন ${i + 1} এর সঠিক উত্তর নির্বাচন করুন`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const finalExamData = { 
      ...examData, 
      questions,
      totalMarks: calculateTotalMarks(),
      updatedAt: new Date()
    };

    updateExamMutation.mutate({
      examData: finalExamData,
      questions: questions
    });
  };

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <p className="text-red-600 font-medium">Error loading exam</p>
        <p className="text-red-500 text-sm mt-1">Please try again later</p>
        <button 
          onClick={() => router.push("/dashboard/teacher/exams")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to My Exams
        </button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-6 ${tiroBangla.className}`}>
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="bg-white rounded-xl shadow-md p-6 mb-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push("/dashboard/teacher/exams")}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <FaArrowLeft />
                <span>Back to Exams</span>
              </button>
              <h1 className="text-2xl font-bold text-blue-800">
                পরীক্ষা এডিট করুন
              </h1>
              <div className="w-28"></div> {/* Spacer for balance */}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              আপনার পরীক্ষার তথ্য এবং প্রশ্ন আপডেট করুন
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Exam Basic Information */}
          <div className="bg-white rounded-xl shadow-md border border-blue-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <FaBook className="text-lg" />
                পরীক্ষার সাধারণ তথ্য
              </h2>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Exam Title */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-800 flex items-center gap-2">
                  <FaBook className="text-blue-600 text-xs" />
                  পরীক্ষার নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="যেমন: এসএসসি ইংরেজি ১ম পত্র মডেল টেস্ট"
                  value={examData.title}
                  onChange={(e) => handleExamDataChange("title", e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200"
                  required
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {/* Education Level */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-800 flex items-center gap-2">
                    <FaGraduationCap className="text-green-600 text-xs" />
                    শিক্ষা স্তর <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={examData.educationLevel}
                    onChange={(e) => handleExamDataChange("educationLevel", e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-200 transition-all duration-200"
                    required
                  >
                    <option value="SSC">SSC/দশম শ্রেণী</option>
                    <option value="HSC">HSC/দ্বাদশ শ্রেণী</option>
                    <option value="University">University/বিশ্ববিদ্যালয়</option>
                  </select>
                </div>

                {/* Subject */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-800 flex items-center gap-2">
                    <FaListAlt className="text-purple-600 text-xs" />
                    বিষয় <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={examData.subject}
                    onChange={(e) => handleExamDataChange("subject", e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-200 transition-all duration-200"
                    required
                  >
                    <option value="">বিষয় নির্বাচন করুন</option>
                    {bangladeshiSubjects[examData.educationLevel]?.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                {/* Exam Type */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-800 flex items-center gap-2">
                    <FaListAlt className="text-orange-600 text-xs" />
                    পরীক্ষার ধরন
                  </label>
                  <select
                    value={examData.examType}
                    onChange={(e) => handleExamDataChange("examType", e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200"
                  >
                    <option value="Model Test">মডেল টেস্ট</option>
                    <option value="Chapter Test">অধ্যায়ভিত্তিক টেস্ট</option>
                    <option value="Final Exam">বার্ষিক পরীক্ষা</option>
                  </select>
                </div>

                {/* Duration */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-800 flex items-center gap-2">
                    <FaClock className="text-red-600 text-xs" />
                    সময় (মিনিট) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={examData.duration}
                    onChange={(e) => handleExamDataChange("duration", parseInt(e.target.value))}
                    className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-200 transition-all duration-200"
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-800">
                  পরীক্ষার বিবরণ
                </label>
                <textarea
                  placeholder="পরীক্ষার বিস্তারিত বিবরণ লিখুন..."
                  value={examData.description}
                  onChange={(e) => handleExamDataChange("description", e.target.value)}
                  rows="3"
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="bg-white rounded-xl shadow-md border border-green-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FaQuestionCircle className="text-lg" />
                  প্রশ্নসমূহ 
                  <span className="text-xs font-normal ml-2">
                    (মোট প্রশ্ন: {questions.length}, মোট নম্বর: {calculateTotalMarks()})
                  </span>
                </h2>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="border border-green-200 rounded-lg p-4 bg-green-50">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-base font-semibold text-green-800 flex items-center gap-2">
                      <FaQuestionCircle className="text-green-600 text-sm" />
                      প্রশ্ন {qIndex + 1}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIndex)}
                        className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs hover:bg-red-200 transition-colors duration-200 flex items-center gap-1"
                      >
                        <FaTrash className="text-xs" />
                        মুছুন
                      </button>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="space-y-1 mb-3">
                    <label className="block text-sm font-medium text-gray-800">
                      প্রশ্ন লিখুন <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="প্রশ্নটি লিখুন..."
                      value={q.questionText}
                      onChange={(e) => handleQuestionChange(qIndex, "questionText", e.target.value)}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-200 transition-all duration-200 min-h-[60px]"
                      required
                    />
                  </div>

                  {/* Question Image Upload */}
                  <div className="space-y-1 mb-3">
                    <label className="block text-sm font-medium text-gray-800 flex items-center gap-2">
                      <FaImage className="text-blue-600 text-xs" />
                      প্রশ্নের ইমেজ (ঐচ্ছিক)
                    </label>
                    <div className="border border-dashed border-gray-300 rounded-lg p-3 bg-white">
                      {q.imagePreview ? (
                        <div className="text-center">
                          <img 
                            src={q.imagePreview} 
                            alt="Question preview" 
                            className="max-h-32 mx-auto rounded mb-2 shadow-sm"
                          />
                          <div className="flex gap-2 justify-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveQuestionImage(qIndex)}
                              className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors duration-200 flex items-center gap-1"
                            >
                              <FaTrash className="text-xs" />
                              ইমেজ সরান
                            </button>
                            {q.existingImage && !q.questionImage && (
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                Existing Image
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleQuestionImageUpload(qIndex, e.target.files[0])}
                            className="hidden"
                            id={`question-image-${qIndex}`}
                          />
                          <label
                            htmlFor={`question-image-${qIndex}`}
                            className="cursor-pointer bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors duration-200 inline-flex items-center gap-1"
                          >
                            <FaImage className="text-xs" />
                            ইমেজ সিলেক্ট করুন
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            JPG, PNG, GIF বা WebP (সর্বোচ্চ 5MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 mb-3">
                    <label className="block text-sm font-medium text-gray-800">
                      অপশনসমূহ <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {q.options.map((opt, oIndex) => (
                        <div key={oIndex} className="flex items-center space-x-2 bg-white p-2 rounded border border-gray-200">
                          <span className="text-sm font-bold text-blue-600 w-4 text-center">
                            {String.fromCharCode(65 + oIndex)}.
                          </span>
                          <input
                            type="text"
                            placeholder={`অপশন ${oIndex + 1}`}
                            value={opt}
                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                            className="flex-1 p-1 text-sm border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200"
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Correct Answer and Marks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-800">
                        সঠিক উত্তর <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={q.correctAnswer}
                        onChange={(e) => handleQuestionChange(qIndex, "correctAnswer", e.target.value)}
                        className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-200 transition-all duration-200"
                        required
                      >
                        <option value="">সঠিক উত্তর নির্বাচন করুন</option>
                        {q.options.map((_, oIndex) => (
                          <option key={oIndex} value={String.fromCharCode(65 + oIndex)}>
                            অপশন {String.fromCharCode(65 + oIndex)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-800">
                        নম্বর <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={q.marks}
                        onChange={(e) => handleQuestionChange(qIndex, "marks", parseInt(e.target.value))}
                        className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-200 transition-all duration-200"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Question Button */}
              <button
                type="button"
                onClick={handleAddQuestion}
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center justify-center gap-2 text-sm font-semibold shadow-sm"
              >
                <FaPlus className="text-sm" />
                নতুন প্রশ্ন যোগ করুন
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={() => router.push("/dashboard/teacher/exams")}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200 font-semibold text-sm shadow-md flex items-center gap-2"
            >
              <FaArrowLeft className="text-sm" />
              বাতিল করুন
            </button>
            
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-sm shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={updateExamMutation.isLoading}
            >
              <FaSave className="text-sm" />
              {updateExamMutation.isLoading ? "আপডেট হচ্ছে..." : "পরীক্ষা আপডেট করুন"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}