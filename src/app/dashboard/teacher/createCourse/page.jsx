"use client";

import React, { useState } from "react";
import { 
  FaPlus, 
  FaTrash, 
  FaBook, 
  FaUser, 
  FaDollarSign, 
  FaGraduationCap,
  FaPlayCircle,
  FaClock,
  FaLink,
  FaSave,
  FaLayerGroup,
  FaChalkboardTeacher,
  FaQuestionCircle,
  FaListOl,
  FaCheckCircle
} from "react-icons/fa";
import { MdSubject, MdClass, MdGroup } from "react-icons/md";
import { RiFileTextFill } from "react-icons/ri";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";

export default function CreateCourse() {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [course, setCourse] = useState({
    title: "",
    short_description: "",
    full_description: "",
    instructor_name: user?.displayName || "",
    subject: "",
    class: "",
    group: "",
    price: "",
    language: "বাংলা",
    premium: true,
    curriculum: [
      {
        chapter_title: "অধ্যায় ১: পরিচিতি",
        lessons: [
          {
            lesson_title: "",
            video_duration: "",
            video_url: "",
            // নতুন: লেসনের জন্য এক্সাম
            exam: {
              has_exam: false,
              title: "",
              description: "",
              duration: 10, // মিনিটে
              total_marks: 10,
              passing_marks: 5,
              questions: [
                {
                  question_text: "",
                  question_type: "multiple_choice",
                  options: [
                    { id: "A", text: "" },
                    { id: "B", text: "" },
                    { id: "C", text: "" },
                    { id: "D", text: "" }
                  ],
                  correct_answer: "A",
                  marks: 1
                }
              ]
            }
          }
        ]
      }
    ]
  });

  // Add chapter
  const addChapter = () => {
    setCourse(prev => ({
      ...prev,
      curriculum: [...prev.curriculum, { 
        chapter_title: `অধ্যায় ${prev.curriculum.length + 1}: নতুন অধ্যায়`, 
        lessons: [{ 
          lesson_title: "", 
          video_duration: "", 
          video_url: "",
          exam: {
            has_exam: false,
            title: "",
            description: "",
            duration: 10,
            total_marks: 10,
            passing_marks: 5,
            questions: [
              {
                question_text: "",
                question_type: "multiple_choice",
                options: [
                  { id: "A", text: "" },
                  { id: "B", text: "" },
                  { id: "C", text: "" },
                  { id: "D", text: "" }
                ],
                correct_answer: "A",
                marks: 1
              }
            ]
          }
        }] 
      }]
    }));
  };

  // Remove chapter
  const removeChapter = (index) => {
    if (course.curriculum.length > 1) {
      const newCurriculum = course.curriculum.filter((_, i) => i !== index);
      setCourse({ ...course, curriculum: newCurriculum });
      toast.success("অধ্যায় মুছে ফেলা হয়েছে");
    } else {
      toast.error("অন্তত একটি অধ্যায় থাকতে হবে");
    }
  };

  // Update chapter title
  const updateChapterTitle = (index, value) => {
    const newCurriculum = [...course.curriculum];
    newCurriculum[index].chapter_title = value;
    setCourse({ ...course, curriculum: newCurriculum });
  };

  // Add lesson
  const addLesson = (chapterIndex) => {
    const newCurriculum = [...course.curriculum];
    newCurriculum[chapterIndex].lessons.push({ 
      lesson_title: "", 
      video_duration: "", 
      video_url: "",
      exam: {
        has_exam: false,
        title: "",
        description: "",
        duration: 10,
        total_marks: 10,
        passing_marks: 5,
        questions: [
          {
            question_text: "",
            question_type: "multiple_choice",
            options: [
              { id: "A", text: "" },
              { id: "B", text: "" },
              { id: "C", text: "" },
              { id: "D", text: "" }
            ],
            correct_answer: "A",
            marks: 1
          }
        ]
      }
    });
    setCourse({ ...course, curriculum: newCurriculum });
    toast.success("নতুন লেসন যোগ করা হয়েছে");
  };

  // Remove lesson
  const removeLesson = (chapterIndex, lessonIndex) => {
    const newCurriculum = [...course.curriculum];
    if (newCurriculum[chapterIndex].lessons.length > 1) {
      newCurriculum[chapterIndex].lessons = newCurriculum[chapterIndex].lessons.filter((_, i) => i !== lessonIndex);
      setCourse({ ...course, curriculum: newCurriculum });
      toast.success("লেসন মুছে ফেলা হয়েছে");
    } else {
      toast.error("অন্তত একটি লেসন থাকতে হবে");
    }
  };

  // Update lesson
  const updateLesson = (chapterIndex, lessonIndex, field, value) => {
    const newCurriculum = [...course.curriculum];
    newCurriculum[chapterIndex].lessons[lessonIndex][field] = value;
    setCourse({ ...course, curriculum: newCurriculum });
  };

  // Add exam to a lesson
  const addExamToLesson = (chapterIndex, lessonIndex) => {
    const newCurriculum = [...course.curriculum];
    newCurriculum[chapterIndex].lessons[lessonIndex].exam = {
      has_exam: true,
      title: `${newCurriculum[chapterIndex].lessons[lessonIndex].lesson_title} - কুইজ` || "লেসন এক্সাম",
      description: "এই লেসনের উপর ভিত্তি করে কুইজ",
      duration: 10,
      total_marks: 10,
      passing_marks: 5,
      questions: [
        {
          question_text: "",
          question_type: "multiple_choice",
          options: [
            { id: "A", text: "" },
            { id: "B", text: "" },
            { id: "C", text: "" },
            { id: "D", text: "" }
          ],
          correct_answer: "A",
          marks: 1
        }
      ]
    };
    setCourse({ ...course, curriculum: newCurriculum });
    toast.success("লেসনের জন্য এক্সাম যোগ করা হয়েছে");
  };

  // Remove exam from a lesson
  const removeExamFromLesson = (chapterIndex, lessonIndex) => {
    const newCurriculum = [...course.curriculum];
    newCurriculum[chapterIndex].lessons[lessonIndex].exam.has_exam = false;
    setCourse({ ...course, curriculum: newCurriculum });
    toast.success("এক্সাম সরানো হয়েছে");
  };

  // Add question to exam
  const addQuestionToExam = (chapterIndex, lessonIndex) => {
    const newCurriculum = [...course.curriculum];
    const exam = newCurriculum[chapterIndex].lessons[lessonIndex].exam;
    
    exam.questions.push({
      question_text: "",
      question_type: "multiple_choice",
      options: [
        { id: "A", text: "" },
        { id: "B", text: "" },
        { id: "C", text: "" },
        { id: "D", text: "" }
      ],
      correct_answer: "A",
      marks: 1
    });
    
    exam.total_marks += 1;
    setCourse({ ...course, curriculum: newCurriculum });
    toast.success("নতুন প্রশ্ন যোগ করা হয়েছে");
  };

  // Remove question from exam
  const removeQuestionFromExam = (chapterIndex, lessonIndex, questionIndex) => {
    const newCurriculum = [...course.curriculum];
    const exam = newCurriculum[chapterIndex].lessons[lessonIndex].exam;
    
    if (exam.questions.length > 1) {
      const removedMarks = exam.questions[questionIndex].marks;
      exam.questions = exam.questions.filter((_, i) => i !== questionIndex);
      exam.total_marks -= removedMarks;
      setCourse({ ...course, curriculum: newCurriculum });
      toast.success("প্রশ্ন মুছে ফেলা হয়েছে");
    } else {
      toast.error("অন্তত একটি প্রশ্ন থাকতে হবে");
    }
  };

  // Update exam question
  const updateExamQuestion = (chapterIndex, lessonIndex, questionIndex, field, value) => {
    const newCurriculum = [...course.curriculum];
    const exam = newCurriculum[chapterIndex].lessons[lessonIndex].exam;
    
    if (field === 'correct_answer') {
      exam.questions[questionIndex].correct_answer = value;
    } else if (field.startsWith('option_')) {
      const optionIndex = parseInt(field.split('_')[1]);
      exam.questions[questionIndex].options[optionIndex].text = value;
    } else if (field.startsWith('marks')) {
      exam.questions[questionIndex].marks = parseInt(value);
      // Update total marks
      exam.total_marks = exam.questions.reduce((total, q) => total + q.marks, 0);
    } else {
      exam.questions[questionIndex][field] = value;
    }
    
    setCourse({ ...course, curriculum: newCurriculum });
  };

  // Update exam details
  const updateExamDetails = (chapterIndex, lessonIndex, field, value) => {
    const newCurriculum = [...course.curriculum];
    const exam = newCurriculum[chapterIndex].lessons[lessonIndex].exam;
    
    if (field === 'has_exam') {
      exam.has_exam = value;
    } else {
      exam[field] = value;
    }
    
    setCourse({ ...course, curriculum: newCurriculum });
  };

  // Update option text
  const updateOptionText = (chapterIndex, lessonIndex, questionIndex, optionIndex, value) => {
    const newCurriculum = [...course.curriculum];
    const exam = newCurriculum[chapterIndex].lessons[lessonIndex].exam;
    exam.questions[questionIndex].options[optionIndex].text = value;
    setCourse({ ...course, curriculum: newCurriculum });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return toast.loading("অনুগ্রহ করে অপেক্ষা করুন...");
    if (!user?.email) return toast.error("অননুমোদিত ব্যবহারকারী!");

    // Validation
    if (!course.title.trim()) return toast.error("কোর্সের শিরোনাম দিন");
    if (!course.subject.trim()) return toast.error("বিষয় নির্বাচন করুন");
    if (!course.price) return toast.error("কোর্সের মূল্য নির্ধারণ করুন");

    try {
      const res = await axiosSecure.post("/api/courses", {
        ...course,
        instructor_email: user.email,
        createdAt: new Date(),
        // Calculate total videos
        total_videos: course.curriculum.reduce((total, chapter) => total + chapter.lessons.length, 0)
      });

      toast.success("কোর্স সফলভাবে তৈরি হয়েছে!");
      
      // Reset form
      setCourse({
        title: "",
        short_description: "",
        full_description: "",
        instructor_name: user?.displayName || "",
        subject: "",
        class: "",
        group: "",
        price: "",
        language: "বাংলা",
        premium: true,
        curriculum: [
          {
            chapter_title: "অধ্যায় ১: পরিচিতি",
            lessons: [
              {
                lesson_title: "",
                video_duration: "",
                video_url: "",
                exam: {
                  has_exam: false,
                  title: "",
                  description: "",
                  duration: 10,
                  total_marks: 10,
                  passing_marks: 5,
                  questions: [
                    {
                      question_text: "",
                      question_type: "multiple_choice",
                      options: [
                        { id: "A", text: "" },
                        { id: "B", text: "" },
                        { id: "C", text: "" },
                        { id: "D", text: "" }
                      ],
                      correct_answer: "A",
                      marks: 1
                    }
                  ]
                }
              }
            ]
          }
        ]
      });
    } catch (error) {
      console.log(error);
      toast.error("কোর্স তৈরি করতে সমস্যা হয়েছে!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-200">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
                <FaBook className="text-3xl text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              নতুন কোর্স তৈরি করুন
            </h1>
            <p className="text-gray-600">
              আপনার কোর্সের তথ্য পূরণ করুন এবং শিক্ষার্থীদের জন্য আকর্ষণীয় কন্টেন্ট তৈরি করুন
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <FaBook className="text-xl" />
                কোর্সের সাধারণ তথ্য
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Course Title */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaBook className="text-blue-600" />
                  কোর্স শিরোনাম <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="যেমন: এসএসসি পদার্থবিজ্ঞান - বল ও গতি"
                  value={course.title}
                  onChange={(e) => setCourse({ ...course, title: e.target.value })}
                  required
                />
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <RiFileTextFill className="text-green-600" />
                    সংক্ষিপ্ত বর্ণনা <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 h-32"
                    placeholder="কোর্সের সংক্ষিপ্ত বিবরণ লিখুন..."
                    value={course.short_description}
                    onChange={(e) => setCourse({ ...course, short_description: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <RiFileTextFill className="text-purple-600" />
                    সম্পূর্ণ বর্ণনা
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 h-32"
                    placeholder="কোর্সের বিস্তারিত বিবরণ লিখুন..."
                    value={course.full_description}
                    onChange={(e) => setCourse({ ...course, full_description: e.target.value })}
                  />
                </div>
              </div>

              {/* Instructor Info */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaUser className="text-orange-600" />
                  ইনস্ট্রাক্টরের নাম
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  placeholder="ইনস্ট্রাক্টরের পুরো নাম"
                  value={course.instructor_name}
                  onChange={(e) => setCourse({ ...course, instructor_name: e.target.value })}
                />
              </div>

              {/* Subject, Class, Group Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MdSubject className="text-red-600" />
                    বিষয় <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                    placeholder="যেমন: পদার্থবিজ্ঞান"
                    value={course.subject}
                    onChange={(e) => setCourse({ ...course, subject: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MdClass className="text-green-600" />
                    শ্রেণি
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    placeholder="যেমন: ৯-১০"
                    value={course.class}
                    onChange={(e) => setCourse({ ...course, class: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MdGroup className="text-blue-600" />
                    গ্রুপ
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="যেমন: বিজ্ঞান"
                    value={course.group}
                    onChange={(e) => setCourse({ ...course, group: e.target.value })}
                  />
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaDollarSign className="text-emerald-600" />
                  মূল্য (টাকা) <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  placeholder="যেমন: 1500"
                  type="number"
                  value={course.price}
                  onChange={(e) => setCourse({ ...course, price: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Curriculum Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-green-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                  <FaLayerGroup className="text-xl" />
                  কোর্স কারিকুলাম
                </h2>
                <span className="text-green-200 text-sm">
                  {course.curriculum.length} অধ্যায়, {" "}
                  {course.curriculum.reduce((total, chapter) => total + chapter.lessons.length, 0)} লেসন
                </span>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {course.curriculum.map((chapter, cIndex) => (
                <div key={cIndex} className="border-2 border-green-200 rounded-xl p-6 bg-green-50 hover:bg-green-100 transition-colors duration-200">
                  {/* Chapter Header */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="bg-green-600 p-2 rounded-lg">
                        <FaChalkboardTeacher className="text-white text-lg" />
                      </div>
                      <input
                        className="flex-1 px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-lg font-semibold"
                        value={chapter.chapter_title}
                        onChange={(e) => updateChapterTitle(cIndex, e.target.value)}
                        placeholder="অধ্যায়ের শিরোনাম"
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeChapter(cIndex)}
                      className="ml-4 p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
                      title="অধ্যায় মুছুন"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  {/* Lessons */}
                  <div className="space-y-4">
                    {chapter.lessons.map((lesson, lIndex) => (
                      <div key={lIndex} className="bg-white rounded-lg p-4 border border-blue-200 hover:border-blue-300 transition-colors duration-200">
                        {/* Lesson Basic Info */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center mb-4">
                          {/* Lesson Title */}
                          <div className="lg:col-span-5 space-y-2">
                            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                              <FaPlayCircle className="text-blue-600" />
                              লেসন টাইটেল
                            </label>
                            <input
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="লেসনের শিরোনাম"
                              value={lesson.lesson_title}
                              onChange={(e) => updateLesson(cIndex, lIndex, "lesson_title", e.target.value)}
                            />
                          </div>

                          {/* Duration */}
                          <div className="lg:col-span-3 space-y-2">
                            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                              <FaClock className="text-orange-600" />
                              সময়
                            </label>
                            <input
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                              placeholder="00:00:00"
                              value={lesson.video_duration}
                              onChange={(e) => updateLesson(cIndex, lIndex, "video_duration", e.target.value)}
                            />
                          </div>

                          {/* Video URL */}
                          <div className="lg:col-span-3 space-y-2">
                            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                              <FaLink className="text-purple-600" />
                              ভিডিও লিঙ্ক
                            </label>
                            <input
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              placeholder="https://youtube.com/..."
                              value={lesson.video_url}
                              onChange={(e) => updateLesson(cIndex, lIndex, "video_url", e.target.value)}
                            />
                          </div>

                          {/* Remove Lesson Button */}
                          <div className="lg:col-span-1 flex justify-center">
                            <button 
                              type="button" 
                              onClick={() => removeLesson(cIndex, lIndex)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
                              title="লেসন মুছুন"
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </div>
                        </div>

                        {/* 🔥 NEW: Exam Section for this Lesson */}
                        <div className="border-t border-gray-200 pt-4 mt-4">
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                              <FaQuestionCircle className="text-green-600" />
                              <span className="font-semibold text-gray-700">লেসন এক্সাম</span>
                            </div>
                            
                            {!lesson.exam?.has_exam ? (
                              <button
                                type="button"
                                onClick={() => addExamToLesson(cIndex, lIndex)}
                                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm"
                              >
                                <FaPlus className="text-xs" />
                                এক্সাম যোগ করুন
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => removeExamFromLesson(cIndex, lIndex)}
                                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm"
                              >
                                <FaTrash className="text-xs" />
                                এক্সাম সরান
                              </button>
                            )}
                          </div>

                          {/* Exam Details - Show only if exam exists */}
                          {lesson.exam?.has_exam && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-4">
                              {/* Exam Basic Info */}
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    এক্সাম টাইটেল
                                  </label>
                                  <input
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    value={lesson.exam.title}
                                    onChange={(e) => updateExamDetails(cIndex, lIndex, 'title', e.target.value)}
                                    placeholder="এক্সামের শিরোনাম"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    সময় (মিনিট)
                                  </label>
                                  <input
                                    type="number"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    value={lesson.exam.duration}
                                    onChange={(e) => updateExamDetails(cIndex, lIndex, 'duration', parseInt(e.target.value))}
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    মোট মার্ক
                                  </label>
                                  <input
                                    type="number"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    value={lesson.exam.total_marks}
                                    onChange={(e) => updateExamDetails(cIndex, lIndex, 'total_marks', parseInt(e.target.value))}
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    পাসিং মার্ক
                                  </label>
                                  <input
                                    type="number"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    value={lesson.exam.passing_marks}
                                    onChange={(e) => updateExamDetails(cIndex, lIndex, 'passing_marks', parseInt(e.target.value))}
                                  />
                                </div>
                              </div>

                              {/* Exam Description */}
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  এক্সাম বর্ণনা
                                </label>
                                <textarea
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 h-20"
                                  value={lesson.exam.description}
                                  onChange={(e) => updateExamDetails(cIndex, lIndex, 'description', e.target.value)}
                                  placeholder="এক্সামের বিস্তারিত বর্ণনা..."
                                />
                              </div>

                              {/* Questions Section */}
                              <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                                    <FaListOl className="text-blue-600" />
                                    প্রশ্নসমূহ ({lesson.exam.questions.length}টি)
                                  </h4>
                                  <button
                                    type="button"
                                    onClick={() => addQuestionToExam(cIndex, lIndex)}
                                    className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
                                  >
                                    <FaPlus className="text-xs" />
                                    প্রশ্ন যোগ করুন
                                  </button>
                                </div>

                                {/* Questions List */}
                                {lesson.exam.questions.map((question, qIndex) => (
                                  <div key={qIndex} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                      <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm font-semibold">
                                        প্রশ্ন {qIndex + 1}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => removeQuestionFromExam(cIndex, lIndex, qIndex)}
                                        className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors duration-200"
                                        disabled={lesson.exam.questions.length <= 1}
                                      >
                                        <FaTrash className="text-xs" />
                                      </button>
                                    </div>

                                    {/* Question Text */}
                                    <div className="space-y-2">
                                      <label className="block text-sm font-medium text-gray-700">
                                        প্রশ্ন লিখুন
                                      </label>
                                      <textarea
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        value={question.question_text}
                                        onChange={(e) => updateExamQuestion(cIndex, lIndex, qIndex, 'question_text', e.target.value)}
                                        placeholder="প্রশ্নটি লিখুন..."
                                        rows="2"
                                      />
                                    </div>

                                    {/* Options */}
                                    <div className="space-y-2">
                                      <label className="block text-sm font-medium text-gray-700">
                                        অপশনসমূহ
                                      </label>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {question.options.map((option, optIndex) => (
                                          <div key={optIndex} className="flex items-center gap-3">
                                            <div className="flex items-center gap-2 flex-1">
                                              <span className="font-semibold text-gray-700 w-6">
                                                {option.id}.
                                              </span>
                                              <input
                                                type="text"
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                value={option.text}
                                                onChange={(e) => updateOptionText(cIndex, lIndex, qIndex, optIndex, e.target.value)}
                                                placeholder={`অপশন ${option.id} লিখুন...`}
                                              />
                                            </div>
                                            <input
                                              type="radio"
                                              name={`correct-${cIndex}-${lIndex}-${qIndex}`}
                                              value={option.id}
                                              checked={question.correct_answer === option.id}
                                              onChange={(e) => updateExamQuestion(cIndex, lIndex, qIndex, 'correct_answer', e.target.value)}
                                              className="w-4 h-4 text-blue-600"
                                            />
                                            <span className="text-sm text-gray-500">সঠিক</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Marks */}
                                    <div className="space-y-2">
                                      <label className="block text-sm font-medium text-gray-700">
                                        মার্ক
                                      </label>
                                      <input
                                        type="number"
                                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        value={question.marks}
                                        onChange={(e) => updateExamQuestion(cIndex, lIndex, qIndex, 'marks', parseInt(e.target.value))}
                                        min="1"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Add Lesson Button */}
                    <button
                      type="button"
                      onClick={() => addLesson(cIndex)}
                      className="w-full bg-blue-100 text-blue-600 py-3 rounded-lg hover:bg-blue-200 transition-colors duration-200 flex items-center justify-center gap-2 font-semibold border-2 border-dashed border-blue-300"
                    >
                      <FaPlus className="text-sm" />
                      নতুন লেসন যোগ করুন
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Chapter Button */}
              <button 
                type="button" 
                onClick={addChapter}
                className="w-full bg-green-100 text-green-600 py-4 rounded-lg hover:bg-green-200 transition-colors duration-200 flex items-center justify-center gap-3 font-semibold text-lg border-2 border-dashed border-green-300"
              >
                <FaPlus className="text-lg" />
                নতুন অধ্যায় যোগ করুন
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button 
              type="submit" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg shadow-lg flex items-center gap-3 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <FaSave className="text-xl" />
              {loading ? "কোর্স তৈরি হচ্ছে..." : "কোর্স তৈরি করুন"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}