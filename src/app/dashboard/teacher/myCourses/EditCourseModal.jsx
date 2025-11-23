"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { 
  FaTimes, 
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
  FaEdit
} from "react-icons/fa";
import { MdSubject, MdClass, MdGroup } from "react-icons/md";
import { RiFileTextFill } from "react-icons/ri";

export default function EditCourseModal({ course, onClose, onUpdate, axiosSecure }) {
  const [formData, setFormData] = useState({
    title: course.title || "",
    short_description: course.short_description || "",
    full_description: course.full_description || "",
    instructor_name: course.instructor_name || "",
    subject: course.subject || "",
    class: course.class || "",
    group: course.group || "",
    price: course.price || "",
    language: course.language || "বাংলা",
    premium: course.premium || true,
    curriculum: course.curriculum || [
      {
        chapter_title: "অধ্যায় ১: পরিচিতি",
        lessons: [
          { lesson_title: "", video_duration: "00:00:00", video_url: "" }
        ]
      }
    ],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle basic input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle chapter title change
  const handleChapterChange = (index, value) => {
    const updated = [...formData.curriculum];
    updated[index].chapter_title = value;
    setFormData({ ...formData, curriculum: updated });
  };

  // Add / Remove chapter
  const addChapter = () => {
    setFormData(prev => ({
      ...prev,
      curriculum: [...prev.curriculum, { 
        chapter_title: `অধ্যায় ${prev.curriculum.length + 1}: নতুন অধ্যায়`, 
        lessons: [{ lesson_title: "", video_duration: "00:00:00", video_url: "" }] 
      }]
    }));
    toast.success("নতুন অধ্যায় যোগ করা হয়েছে");
  };

  const removeChapter = (index) => {
    if (formData.curriculum.length > 1) {
      const updated = [...formData.curriculum];
      updated.splice(index, 1);
      setFormData({ ...formData, curriculum: updated });
      toast.success("অধ্যায় মুছে ফেলা হয়েছে");
    } else {
      toast.error("অন্তত একটি অধ্যায় থাকতে হবে");
    }
  };

  // Handle lesson change
  const handleLessonChange = (cIndex, lIndex, field, value) => {
    const updated = [...formData.curriculum];
    updated[cIndex].lessons[lIndex][field] = value;
    setFormData({ ...formData, curriculum: updated });
  };

  // Add / Remove lesson
  const addLesson = (cIndex) => {
    const updated = [...formData.curriculum];
    updated[cIndex].lessons.push({ 
      lesson_title: "নতুন লেসন", 
      video_duration: "00:10:00", 
      video_url: "" 
    });
    setFormData({ ...formData, curriculum: updated });
    toast.success("নতুন লেসন যোগ করা হয়েছে");
  };

  const removeLesson = (cIndex, lIndex) => {
    const updated = [...formData.curriculum];
    if (updated[cIndex].lessons.length > 1) {
      updated[cIndex].lessons.splice(lIndex, 1);
      setFormData({ ...formData, curriculum: updated });
      toast.success("লেসন মুছে ফেলা হয়েছে");
    } else {
      toast.error("অন্তত একটি লেসন থাকতে হবে");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!formData.title.trim()) {
      toast.error("কোর্সের শিরোনাম দিন");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await axiosSecure.put(`/api/courses/${course._id}`, {
        ...formData,
        updatedAt: new Date()
      });
      
      if (res.data.success) {
        toast.success("কোর্স সফলভাবে আপডেট হয়েছে!");
        onUpdate({ ...course, ...formData });
        onClose();
      }
    } catch (err) {
      console.log(err);
      toast.error("কোর্স আপডেট করতে সমস্যা হয়েছে!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate total lessons
  const totalLessons = formData.curriculum.reduce((total, chapter) => total + chapter.lessons.length, 0);

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-start pt-4 pb-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 my-8 relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl">
                <FaEdit className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">কোর্স এডিট করুন</h2>
                <p className="text-blue-100">আপনার কোর্সের তথ্য আপডেট করুন</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors duration-200"
            >
              <FaTimes className="text-white text-xl" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto">
          {/* Basic Information */}
          <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-200">
            <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <FaBook className="text-blue-600" />
              কোর্সের সাধারণ তথ্য
            </h3>
            
            <div className="space-y-4">
              {/* Course Title */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaBook className="text-blue-600 text-sm" />
                  কোর্স শিরোনাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="কোর্সের শিরোনাম লিখুন..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <RiFileTextFill className="text-green-600 text-sm" />
                    সংক্ষিপ্ত বর্ণনা
                  </label>
                  <textarea
                    name="short_description"
                    value={formData.short_description}
                    onChange={handleChange}
                    placeholder="সংক্ষিপ্ত বিবরণ লিখুন..."
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <RiFileTextFill className="text-purple-600 text-sm" />
                    সম্পূর্ণ বর্ণনা
                  </label>
                  <textarea
                    name="full_description"
                    value={formData.full_description}
                    onChange={handleChange}
                    placeholder="বিস্তারিত বিবরণ লিখুন..."
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Subject Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MdSubject className="text-red-600 text-sm" />
                    বিষয়
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="বিষয়"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MdClass className="text-green-600 text-sm" />
                    শ্রেণি
                  </label>
                  <input
                    type="text"
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    placeholder="শ্রেণি"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MdGroup className="text-blue-600 text-sm" />
                    গ্রুপ
                  </label>
                  <input
                    type="text"
                    name="group"
                    value={formData.group}
                    onChange={handleChange}
                    placeholder="গ্রুপ"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FaDollarSign className="text-emerald-600 text-sm" />
                    মূল্য
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="মূল্য"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Instructor */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaUser className="text-orange-600 text-sm" />
                  ইনস্ট্রাক্টরের নাম
                </label>
                <input
                  type="text"
                  name="instructor_name"
                  value={formData.instructor_name}
                  onChange={handleChange}
                  placeholder="ইনস্ট্রাক্টরের নাম"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Curriculum Section */}
          <div className="bg-green-50 rounded-xl p-6 mb-6 border border-green-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-green-800 flex items-center gap-2">
                <FaLayerGroup className="text-green-600" />
                কোর্স কারিকুলাম
                <span className="text-sm font-normal text-green-600 ml-2">
                  ({formData.curriculum.length} অধ্যায়, {totalLessons} লেসন)
                </span>
              </h3>
              <button 
                type="button" 
                onClick={addChapter}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
              >
                <FaPlus />
                নতুন অধ্যায়
              </button>
            </div>

            <div className="space-y-4">
              {formData.curriculum.map((chapter, cIndex) => (
                <div key={cIndex} className="bg-white rounded-xl p-4 border-2 border-green-200 hover:border-green-300 transition-colors duration-200">
                  {/* Chapter Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-600 p-2 rounded-lg">
                      <FaChalkboardTeacher className="text-white" />
                    </div>
                    <input
                      type="text"
                      value={chapter.chapter_title}
                      onChange={(e) => handleChapterChange(cIndex, e.target.value)}
                      className="flex-1 px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg font-semibold"
                      placeholder="অধ্যায়ের শিরোনাম"
                    />
                    <button 
                      type="button" 
                      onClick={() => removeChapter(cIndex)}
                      className="bg-red-100 text-red-600 p-3 rounded-lg hover:bg-red-200 transition-colors duration-200"
                      title="অধ্যায় মুছুন"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  {/* Lessons */}
                  <div className="space-y-3">
                    {chapter.lessons.map((lesson, lIndex) => (
                      <div key={lIndex} className="bg-gray-50 rounded-lg p-4 border border-blue-200">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
                          {/* Lesson Title */}
                          <div className="lg:col-span-5 space-y-2">
                            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                              <FaPlayCircle className="text-blue-600 text-sm" />
                              লেসন টাইটেল
                            </label>
                            <input
                              type="text"
                              value={lesson.lesson_title}
                              onChange={(e) => handleLessonChange(cIndex, lIndex, "lesson_title", e.target.value)}
                              placeholder="লেসনের শিরোনাম"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          {/* Duration */}
                          <div className="lg:col-span-3 space-y-2">
                            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                              <FaClock className="text-orange-600 text-sm" />
                              সময়
                            </label>
                            <input
                              type="text"
                              value={lesson.video_duration}
                              onChange={(e) => handleLessonChange(cIndex, lIndex, "video_duration", e.target.value)}
                              placeholder="00:00:00"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                          </div>

                          {/* Video URL */}
                          <div className="lg:col-span-3 space-y-2">
                            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                              <FaLink className="text-purple-600 text-sm" />
                              ভিডিও লিঙ্ক
                            </label>
                            <input
                              type="text"
                              value={lesson.video_url}
                              onChange={(e) => handleLessonChange(cIndex, lIndex, "video_url", e.target.value)}
                              placeholder="https://example.com/video"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>

                          {/* Remove Button */}
                          <div className="lg:col-span-1">
                            <button 
                              type="button" 
                              onClick={() => removeLesson(cIndex, lIndex)}
                              className="w-full bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors duration-200"
                              title="লেসন মুছুন"
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add Lesson Button */}
                    <button
                      type="button"
                      onClick={() => addLesson(cIndex)}
                      className="w-full bg-blue-100 text-blue-600 py-2 rounded-lg hover:bg-blue-200 transition-colors duration-200 flex items-center justify-center gap-2 border-2 border-dashed border-blue-300"
                    >
                      <FaPlus className="text-sm" />
                      নতুন লেসন যোগ করুন
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-semibold flex items-center gap-2"
            >
              বাতিল করুন
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSave />
              {isSubmitting ? "আপডেট হচ্ছে..." : "কোর্স আপডেট করুন"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}