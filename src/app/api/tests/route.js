import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

// GET all exams
export async function GET() {
  try {
    const examCollection = await dbConnect(collectionNameObj.examCollection);
    const exams = await examCollection.find().toArray();
    return NextResponse.json(exams);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST create new exam
export async function POST(req) {
  try {
    const body = await req.json();
    const { title, duration, totalMarks, courseId, email,role, questions } = body;

    // Validate required fields
    if (!title || !duration || !totalMarks || !courseId || !email || role !== 'teacher') {
      return NextResponse.json(
        { error: "সব ইনপুট পূরণ করুন এবং লগইন ইউজার চিহ্নিত করুন!" },
        { status: 400 }
      );
    }

    const examCollection = await dbConnect(collectionNameObj.examCollection);

    const newExam = {
      title,
      duration,
      totalMarks,
      courseId,
      email, 
      role,        
      questions: questions || [],
      createdAt: new Date(),
    };

    const result = await examCollection.insertOne(newExam);

    console.log("✅ Exam inserted:", result.insertedId);

    return NextResponse.json({ 
      message: "Exam created successfully!", 
      insertedId: result.insertedId 
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
