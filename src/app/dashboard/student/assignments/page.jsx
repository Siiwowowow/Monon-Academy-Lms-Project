"use client";

import React, { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { Upload, Loader2, Link2 } from "lucide-react";

export default function AssignmentsSubmitForm() {
  const { user } = useAuth();

  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // ✅ Either file or link must be provided
    if (!file && !fileUrl) {
      setLoading(false);
      return setError("❌ Please upload a PDF or provide a link");
    }

    const formData = new FormData();
    formData.append("assignmentTitle", assignmentTitle);
    formData.append("description", description);
    formData.append("studentEmail", user?.email);
    if (file) formData.append("pdf", file);
    if (fileUrl) formData.append("fileUrl", fileUrl);

    try {
      const res = await fetch("/api/assignments/submit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("✅ Assignment submitted successfully!");
        setAssignmentTitle("");
        setDescription("");
        setFile(null);
        setFileUrl("");
      } else {
        setError(data.message || "Submission failed");
      }
    } catch (err) {
      setError("❌ Submission failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <Upload className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Submit Your Assignment
          </h2>
          <p className="text-sm text-gray-500">
            Logged in as {user?.email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Assignment Title */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Assignment Title
            </label>
            <input
              type="text"
              value={assignmentTitle}
              onChange={(e) => setAssignmentTitle(e.target.value)}
              required
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* PDF Upload */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Upload PDF (Optional)
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full mt-1 border p-2 rounded-lg bg-gray-50"
            />
            {file && (
              <p className="text-sm text-green-600 mt-1">
                ✅ {file.name}
              </p>
            )}
          </div>

          {/* Link Upload */}
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Link2 className="w-4 h-4" /> File Link (Optional)
            </label>
            <input
              type="text"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Assignment"
            )}
          </button>

          {/* Messages */}
          {success && (
            <p className="text-green-600 text-center font-medium">
              {success}
            </p>
          )}
          {error && (
            <p className="text-red-600 text-center font-medium">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
