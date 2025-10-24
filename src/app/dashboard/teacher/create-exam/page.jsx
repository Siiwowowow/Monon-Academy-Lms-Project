"use client";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { toast } from "react-hot-toast";
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
  FaSave
} from "react-icons/fa";

const tiroBangla = Tiro_Bangla({
  weight: ["400"],
  subsets: ["bengali"],
});

export default function CreateExam() {
  const axiosSecure = useAxiosSecure();

  const educationBoards = [
    "Dhaka", "Chittagong", "Rajshahi", "Khulna", "Barishal", 
    "Sylhet", "Rangpur", "Mymensingh", "Dinajpur", "Jessore"
  ];

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
    passingMarks: 33
  });

  const [questions, setQuestions] = useState([
    { 
      questionText: "", 
      options: ["", "", "", ""], 
      correctAnswer: "",
      marks: 1,
      questionImage: null,
      imagePreview: null
    },
  ]);

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
    setQuestions(updated);
    toast.success("ইমেজ সরানো হয়েছে");
  };

  // Mutation for creating exam with image uploads
  const createExamMutation = useMutation({
    mutationFn: async (examData) => {
      const formData = new FormData();
      
      const examDataForJSON = {
        ...examData,
        questions: examData.questions.map(q => ({
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
          marks: q.marks,
        }))
      };
      
      formData.append('examData', JSON.stringify(examDataForJSON));

      examData.questions.forEach((question, index) => {
        if (question.questionImage) {
          formData.append(`questionImage_${index}`, question.questionImage);
        }
      });

      const res = await axiosSecure.post("/api/exams", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("পরীক্ষা সফলভাবে তৈরি হয়েছে!");
      
      questions.forEach(q => {
        if (q.imagePreview) {
          URL.revokeObjectURL(q.imagePreview);
        }
      });

      setExamData({
        title: "",
        educationLevel: "SSC",
        board: "Dhaka",
        subject: "",
        description: "",
        examType: "Model Test",
        duration: 60,
        totalMarks: 100,
        passingMarks: 33
      });
      setQuestions([{ 
        questionText: "", 
        options: ["", "", "", ""], 
        correctAnswer: "",
        marks: 1,
        questionImage: null,
        imagePreview: null
      }]);
    },
    onError: (error) => {
      console.error('Exam creation error:', error);
      toast.error(`পরীক্ষা তৈরি করতে সমস্যা: ${error.response?.data?.message || error.message}`);
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
        imagePreview: null
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
      createdAt: new Date()
    };

    createExamMutation.mutate(finalExamData);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-6 ${tiroBangla.className}`}>
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="bg-white rounded-xl shadow-md p-6 mb-4 border border-blue-200">
            <h1 className="text-2xl font-bold text-blue-800 mb-2">
              নতুন পরীক্ষা তৈরি করুন
            </h1>
            <p className="text-sm text-gray-600">
              বাংলাদেশের শিক্ষার্থীদের জন্য কুইজ ও পরীক্ষা তৈরি করুন
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
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIndex)}
                        className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs hover:bg-red-200 transition-colors duration-200 flex items-center gap-1"
                      >
                        <FaTrash className="text-xs" />
                        মুছুন
                      </button>
                    )}
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
                      প্রশ্নের ইমেজ যোগ করুন (ঐচ্ছিক)
                    </label>
                    <div className="border border-dashed border-gray-300 rounded-lg p-3 bg-white">
                      {q.imagePreview ? (
                        <div className="text-center">
                          <img 
                            src={q.imagePreview} 
                            alt="Question preview" 
                            className="max-h-32 mx-auto rounded mb-2 shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestionImage(qIndex)}
                            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors duration-200 flex items-center gap-1 mx-auto"
                          >
                            <FaTrash className="text-xs" />
                            ইমেজ সরান
                          </button>
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

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-sm shadow-md flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={createExamMutation.isLoading}
            >
              <FaSave className="text-sm" />
              {createExamMutation.isLoading ? "তৈরি হচ্ছে..." : "পরীক্ষা তৈরি করুন"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}