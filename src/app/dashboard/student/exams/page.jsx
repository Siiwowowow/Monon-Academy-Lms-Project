"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function ALLExamCard() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await fetch("/api/tests");
        const data = await res.json();
        setExams(data);
      } catch (err) {
        console.error("Failed to fetch exams:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  if (loading) return <div>Loading exams...</div>;
  if (exams.length === 0) return <div>No exams found</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exams.map((exam) => (
        <Link key={exam._id} href={`/dashboard/student/exams/${exam._id}`}>
          <div className="bg-white border rounded-lg shadow-md hover:shadow-xl transition cursor-pointer p-4 flex flex-col justify-between">
            <h2 className="text-xl font-bold mb-2 text-blue-600">{exam.title}</h2>
            <p className="text-gray-600">Duration: {exam.duration} mins</p>
            <p className="text-gray-600">Total Marks: {exam.totalMarks}</p>
            <p className="mt-2 text-sm text-gray-400">
              Created At: {new Date(exam.createdAt).toLocaleDateString()}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
