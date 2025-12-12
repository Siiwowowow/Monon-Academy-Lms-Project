//src/app/dashboard/teacher/myCourses/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaStar } from "react-icons/fa";
import EditCourseModal from "./EditCourseModal";

export default function MyCourses() {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);

  // Fetch courses based on teacher email
  useEffect(() => {
    if (loading) return;
    if (!user?.email) return;

    const fetchCourses = async () => {
      try {
        const res = await axiosSecure.get(`/api/courses?email=${user.email}`);
        setCourses(res.data.data);
      } catch (err) {
        toast.error("Failed to fetch courses!");
      }
    };

    fetchCourses();
  }, [user, loading, axiosSecure]);

  // Delete course
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      const res = await axiosSecure.delete(`/api/courses/${id}`);
      if (res.data.success) {
        toast.success("Course Deleted!");
        setCourses(courses.filter(c => c._id !== id));
      }
    } catch (error) {
      console.error(error);
      toast.error("Delete Failed!");
    }
  };

  // Update course after editing
  const handleUpdate = (updatedCourse) => {
    setCourses(courses.map(c => c._id === updatedCourse._id ? updatedCourse : c));
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-6">My Courses</h1>

      {courses.length === 0 ? (
        <p className="text-gray-500">No courses found. Create your first course!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div
              key={course._id}
              className="bg-white rounded-lg shadow hover:shadow-xl transition overflow-hidden flex flex-col justify-between"
            >
              {/* Thumbnail */}
              <img
                src={course.thumbnail_url || "/default-thumbnail.jpg"}
                alt={course.title}
                className="w-full h-40 object-cover"
              />

              {/* Course Info */}
              <div className="p-4 flex flex-col justify-between h-full">
                <div>
                  <h2 className="font-bold text-lg">{course.title}</h2>
                  <p className="text-gray-600 text-sm mb-2">
                    {course.subject} | {course.class} | {course.group}
                  </p>
                  <p className="text-gray-700 text-sm mb-2">{course.short_description}</p>

                  {/* Rating & Lessons */}
                  <div className="flex items-center mb-2">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{course.rating?.toFixed(1) || 0}</span>
                    <span className="text-gray-500 ml-2 text-sm">
                      ({course.total_videos || 0} lessons)
                    </span>
                  </div>

                  {/* Price */}
                  <p className="text-lg font-semibold text-green-600">
                    ৳{course.price || 0}{" "}
                    {course.original_price && (
                      <span className="line-through text-gray-400 ml-2">৳{course.original_price}</span>
                    )}
                  </p>
                </div>

                {/* Edit/Delete Buttons */}
                <div className="flex gap-2 mt-3">
                  <button
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    onClick={() => setEditingCourse(course)}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    onClick={() => handleDelete(course._id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingCourse && (
        <EditCourseModal
          course={editingCourse}
          axiosSecure={axiosSecure}
          onClose={() => setEditingCourse(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
