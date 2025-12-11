"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ExamQuestion() {
  const { id: examId } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({}); // store selected answers

  useEffect(() => {
    if (!examId) return;

    const fetchExam = async () => {
      try {
        const res = await fetch(`/api/tests/${examId}`);
        const data = await res.json();
        setExam(data);
      } catch (err) {
        console.error("Error fetching exam:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId]);

  const handleOptionChange = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  const handleSubmit = () => {
    console.log("Submitted Answers:", answers);
    alert("Exam submitted! Check console for answers.");
  };

  if (loading) return <div>Loading exam...</div>;
  if (!exam || exam.error) return <div>{exam?.error || "Exam not found"}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white border rounded shadow mt-6">
      <h2 className="text-3xl font-bold mb-4 text-blue-600">{exam.title}</h2>
      <p className="text-gray-600 mb-6">
        Duration: {exam.duration} mins | Total Marks: {exam.totalMarks}
      </p>

      {exam.questions && exam.questions.length > 0 ? (
        exam.questions.map((q, idx) => (
          <div key={idx} className="mb-6 border-b pb-4">
            <h3 className="font-semibold mb-2">
              Q{idx + 1}: {q.question}
            </h3>
            <div className="flex flex-col gap-2">
              {q.options.map((opt, i) => (
                <label
                  key={i}
                  className={`p-2 border rounded hover:bg-gray-100 cursor-pointer ${
                    answers[idx] === String.fromCharCode(65 + i) ? "bg-blue-100 border-blue-500" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${idx}`}
                    value={String.fromCharCode(65 + i)}
                    checked={answers[idx] === String.fromCharCode(65 + i)}
                    onChange={() => handleOptionChange(idx, String.fromCharCode(65 + i))}
                    className="mr-2"
                  />
                  {String.fromCharCode(65 + i)}. {opt}
                </label>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No questions found for this exam.</p>
      )}

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white p-3 rounded mt-4 hover:bg-blue-700 transition"
      >
        Submit Exam
      </button>
    </div>
  );
}
