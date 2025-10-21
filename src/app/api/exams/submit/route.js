import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { examId, answers, student } = await req.json();
    const collection = await dbConnect(collectionNameObj.answerCollection);

    const result = await collection.insertOne({
      examId,
      student,
      answers,
      submittedAt: new Date(),
    });

    return NextResponse.json({ message: "Exam submitted", result });
  } catch (error) {
    console.error("Error submitting exam:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
