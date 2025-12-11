import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = await params; // For Next.js 16, use await params
  const examCollection = await dbConnect(collectionNameObj.examCollection);
  const exam = await examCollection.findOne({ _id: new ObjectId(id) });
  if (!exam) return NextResponse.json({ error: "Exam not found" }, { status: 404 });
  return NextResponse.json(exam);
}

export async function PUT(req, { params }) {
  const { id } = await params;
  const body = await req.json();
  const examCollection = await dbConnect(collectionNameObj.examCollection);

  const result = await examCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: body }
  );

  if (result.modifiedCount === 0) {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
  return NextResponse.json({ message: "Exam updated successfully!" });
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  const examCollection = await dbConnect(collectionNameObj.examCollection);

  const result = await examCollection.deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
  return NextResponse.json({ message: "Exam deleted successfully!" });
}
