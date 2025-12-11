import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const assignmentTitle = formData.get("assignmentTitle");
    const description = formData.get("description");
    const studentEmail = formData.get("studentEmail");
    const fileUrl = formData.get("fileUrl");
    const file = formData.get("pdf");

    if (!assignmentTitle || !studentEmail) {
      return NextResponse.json(
        { message: "Required fields missing" },
        { status: 400 }
      );
    }

    if (!file && !fileUrl) {
      return NextResponse.json(
        { message: "Either file or link is required" },
        { status: 400 }
      );
    }

    let pdfBuffer = null;
    let pdfName = null;

    // ✅ If file uploaded
    if (file) {
      const bytes = await file.arrayBuffer();
      pdfBuffer = Buffer.from(bytes);
      pdfName = file.name;
    }

    const submissionCollection = await dbConnect(
      collectionNameObj.submissionCollection
    );

    const submissionData = {
      assignmentTitle,
      description,
      studentEmail,
      fileUrl: fileUrl || null,
      pdfName,
      pdfBuffer, // ✅ Stored in MongoDB
      status: "submitted",
      submittedAt: new Date(),
    };

    const result = await submissionCollection.insertOne(submissionData);

    return NextResponse.json(
      { message: "Assignment submitted successfully", result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Assignment Submit Error:", error);
    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}
