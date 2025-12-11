"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import useRole from "@/hooks/useRole";

export default function CreateExam() {
  const { user } = useAuth();   // logged-in user
  const { role } = useRole();   // user role

  const [formData, setFormData] = useState({
    title: "",
    duration: "",
    totalMarks: "",
    courseId: "",
    email: "", // will be set from useAuth
    role: "",  // will be set from useRole
    questions: [
      { question: "", options: ["", "", "", ""], correctAnswer: "A" },
    ],
  });

  // Set email and role when user/role ready
  useEffect(() => {
    if (user?.email && role) {
      setFormData((prev) => ({ ...prev, email: user.email, role }));
    }
  }, [user, role]);

  // Basic field change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Question field change
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    if (field.startsWith("option")) {
      const optionIndex = parseInt(field.split("-")[1]);
      updatedQuestions[index].options[optionIndex] = value;
    } else {
      updatedQuestions[index][field] = value;
    }
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        { question: "", options: ["", "", "", ""], correctAnswer: "A" },
      ],
    });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form:", formData);

    try {
      const res = await fetch("/api/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Something went wrong!");
        return;
      }

      toast.success("Exam created successfully!");
      // Reset form, keep email and role
      setFormData({
        title: "",
        duration: "",
        totalMarks: "",
        courseId: "",
        email: user?.email || "",
        role: role || "",
        questions: [{ question: "", options: ["", "", "", ""], correctAnswer: "A" }],
      });
    } catch (err) {
      toast.error("Server error!");
      console.log(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Create New Exam / Quiz</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Exam Info */}
        <input
          type="text"
          name="title"
          placeholder="Exam Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          name="duration"
          placeholder="Duration (minutes)"
          value={formData.duration}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          name="totalMarks"
          placeholder="Total Marks"
          value={formData.totalMarks}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="courseId"
          placeholder="Course ID"
          value={formData.courseId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        {/* Hidden fields */}
        <input type="hidden" name="email" value={formData.email} />
        <input type="hidden" name="role" value={formData.role} />

        <hr className="my-4" />

        {/* Questions */}
        {formData.questions.map((q, index) => (
          <div key={index} className="border p-4 rounded mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Question {index + 1}</h3>
              {formData.questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="text-red-600"
                >
                  Remove
                </button>
              )}
            </div>

            <input
              type="text"
              placeholder="Question Text"
              value={q.question}
              onChange={(e) =>
                handleQuestionChange(index, "question", e.target.value)
              }
              className="w-full border p-2 rounded mb-2"
              required
            />

            {q.options.map((opt, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                value={opt}
                onChange={(e) =>
                  handleQuestionChange(index, `option-${i}`, e.target.value)
                }
                className="w-full border p-2 rounded mb-1"
                required
              />
            ))}

            <select
              value={q.correctAnswer}
              onChange={(e) =>
                handleQuestionChange(index, "correctAnswer", e.target.value)
              }
              className="w-full border p-2 rounded mt-2"
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="w-full bg-green-600 text-white p-2 rounded mb-2"
        >
          + Add Question
        </button>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Create Exam
        </button>
      </form>
    </div>
  );
}
