"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { toast } from "react-hot-toast";

export default function ExamCard() {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user?.email) return;

    const fetchExams = async () => {
      try {
        const res = await fetch("/api/tests");
        const data = await res.json();

        const filteredExams = data.filter((exam) => exam.email === user.email);
        setExams(filteredExams);
      } catch (err) {
        console.error("Error fetching exams:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [user]);

  // Delete exam
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this exam?")) return;

    try {
      const res = await fetch(`/api/tests/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to delete exam");
        return;
      }

      toast.success("Exam deleted successfully!");
      setExams(exams.filter((exam) => exam._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  if (loading) return <div>Loading exams...</div>;
  if (!exams.length) return <div>No exams found for your email.</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {exams.map((exam) => (
        <div
          key={exam._id}
          className="border p-4 rounded mb-4 shadow hover:shadow-lg transition"
        >
          <h3 className="text-xl font-bold">{exam.title}</h3>
          <p><strong>Duration:</strong> {exam.duration} minutes</p>
          <p><strong>Total Marks:</strong> {exam.totalMarks}</p>
          <p><strong>Course ID:</strong> {exam.courseId}</p>
          <p><strong>Created At:</strong> {new Date(exam.createdAt).toLocaleString()}</p>

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => router.push(`/dashboard/teacher/edit-exam/${exam._id}`)}
              className="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(exam._id)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
