 import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    const examCollection = await dbConnect(collectionNameObj.examCollection);
    const examId = params.id;

    // Find exam by _id
    const exam = await examCollection.findOne({ _id: new ObjectId(examId) });

    if (!exam) {
      return NextResponse.json({ success: false, message: "Exam not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, exam });
  } catch (error) {
    console.error("Error fetching exam:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch exam" },
      { status: 500 }
    );
  }
}

// Optional: you can also add DELETE or PUT here if needed
