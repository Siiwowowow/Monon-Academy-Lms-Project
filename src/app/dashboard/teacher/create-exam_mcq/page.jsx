//src/app/dashboard/teacher/create-exam_mcq/page.jsx
'use client';
import React, { useState } from 'react';
import useAuth from "@/hooks/useAuth";
import useRole from "@/hooks/useRole";
import { toast } from "react-hot-toast";

export default function MCQExamForm() {
  const [formData, setFormData] = useState({
    examTitle: '',
    subject: '',
    duration: 60,
    totalMarks: 100,
    passingMarks: 40,
    instructions: '',
    questions: [
      {
        id: 1,
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        marks: 1
      }
    ]
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { user } = useAuth();
  const { role } = useRole();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setFormData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };

  const addQuestion = () => {
    const newQuestion = {
      id: formData.questions.length + 1,
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      marks: 1
    };
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    setCurrentQuestion(formData.questions.length);
  };

  const removeQuestion = (index) => {
    if (formData.questions.length > 1) {
      const updatedQuestions = formData.questions.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        questions: updatedQuestions
      }));
      if (currentQuestion >= updatedQuestions.length) {
        setCurrentQuestion(updatedQuestions.length - 1);
      }
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // 🟩 Instructor Info Auto Add
  const finalData = {
    ...formData,
    instructorName: user?.name || user?.displayName || "Unknown Instructor",
    instructorEmail: user?.email || "",
    instructorRole: role || "instructor",
  };

  try {
    const loadingToast = toast.loading("Creating MCQ Exam...");

    const res = await fetch("/api/tests/mcq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalData),
    });

    const data = await res.json();

    toast.dismiss(loadingToast);

    if (data.success) {
      toast.success("MCQ Exam Created Successfully! 🎉");

      // reset form
      setFormData({
        examTitle: "",
        subject: "",
        duration: 60,
        totalMarks: 100,
        passingMarks: 40,
        instructions: "",
        questions: [
          {
            id: 1,
            questionText: "",
            options: ["", "", "", ""],
            correctAnswer: 0,
            marks: 1,
          },
        ],
      });
      setCurrentQuestion(0);
    } else {
      toast.error(data.message || "Failed to create exam!");
    }
  } catch (error) {
    console.error("Submit Error:", error);
    toast.error("Something went wrong!");
  }
};

  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'English',
    'History',
    'Geography'
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create MCQ Exam</h1>
          <p className="text-gray-600">Create and configure your multiple choice question exam</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {/* Exam Basic Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b">Exam Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Title *
                </label>
                <input
                  type="text"
                  name="examTitle"
                  value={formData.examTitle}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter exam title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Marks *
                </label>
                <input
                  type="number"
                  name="totalMarks"
                  value={formData.totalMarks}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passing Marks *
                </label>
                <input
                  type="number"
                  name="passingMarks"
                  value={formData.passingMarks}
                  onChange={handleInputChange}
                  required
                  max={formData.totalMarks}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructions
              </label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Enter exam instructions for students..."
              />
            </div>
          </div>

          {/* Questions Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Questions</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <span>+ Add Question</span>
              </button>
            </div>

            {/* Question Navigation */}
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.questions.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentQuestion(index)}
                  className={`px-3 py-1 rounded-lg transition ${
                    currentQuestion === index
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Q{index + 1}
                </button>
              ))}
            </div>

            {/* Current Question Editor */}
            {formData.questions.map((q, qIndex) => qIndex === currentQuestion && (
              <div key={q.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-700">
                    Question {qIndex + 1}
                  </h3>
                  {formData.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                    >
                      Remove Question
                    </button>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Text *
                  </label>
                  <textarea
                    value={q.questionText}
                    onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                    required
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Enter your question here..."
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Options *
                  </label>
                  {q.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-3 mb-2">
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={q.correctAnswer === oIndex}
                        onChange={() => handleQuestionChange(qIndex, 'correctAnswer', oIndex)}
                        className="h-4 w-4"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        required
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marks *
                    </label>
                    <input
                      type="number"
                      value={q.marks}
                      onChange={(e) => handleQuestionChange(qIndex, 'marks', parseInt(e.target.value))}
                      required
                      min="1"
                      className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg">
                    Correct Answer: Option {String.fromCharCode(65 + q.correctAnswer)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Exam Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Questions</p>
                <p className="text-lg font-semibold">{formData.questions.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Marks</p>
                <p className="text-lg font-semibold">
                  {formData.questions.reduce((sum, q) => sum + q.marks, 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-lg font-semibold">{formData.duration} min</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Subject</p>
                <p className="text-lg font-semibold">{formData.subject || 'Not set'}</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  examTitle: '',
                  subject: '',
                  duration: 60,
                  totalMarks: 100,
                  passingMarks: 40,
                  instructions: '',
                  questions: [{
                    id: 1,
                    questionText: '',
                    options: ['', '', '', ''],
                    correctAnswer: 0,
                    marks: 1
                  }]
                });
                setCurrentQuestion(0);
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
            >
              Create Exam
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}