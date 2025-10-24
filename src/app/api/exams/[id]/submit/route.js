import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(req, { params }) {
  try {
    const examId = params.id;
    const { studentEmail, answers } = await req.json();

    const examCollection = await dbConnect(collectionNameObj.examCollection);
    const submissionCollection = await dbConnect("examSubmissions");

    // Find exam
    const exam = await examCollection.findOne({ _id: new ObjectId(examId) });
    if (!exam) return NextResponse.json({ success: false, message: "Exam not found" }, { status: 404 });

    // Calculate score
    let score = 0;
    exam.questions.forEach((q, i) => {
      const studentAnswer = answers[i]; // This is the option text like "Option 1"
      const correctOptionIndex = q.correctAnswer; // This is like "A", "B", "C", "D"
      
      // Convert letter to index: A=0, B=1, C=2, D=3
      const correctIndex = correctOptionIndex.charCodeAt(0) - 65;
      
      // Get the correct option text
      const correctOptionText = q.options[correctIndex];
      
      // Compare the actual text
      if (studentAnswer === correctOptionText) {
        score += q.marks || 1;
      }
    });

    // Save submission
    await submissionCollection.insertOne({
      examId: new ObjectId(examId),
      studentEmail,
      answers,
      score,
      totalMarks: exam.questions.reduce((total, q) => total + (q.marks || 1), 0),
      createdAt: new Date(),
    });

    return NextResponse.json({ 
      success: true, 
      score, 
      total: exam.questions.reduce((total, q) => total + (q.marks || 1), 0) 
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to submit exam" }, { status: 500 });
  }
}