//src/app/api/tests/mcq/[id]/route.js
import { NextResponse } from "next/server";
import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET(req, context) {
  // 🔑 Unwrap params
  const params = await context.params;
  const id = params.id;

  if (!id) return NextResponse.json({ success: false, message: "ID is required" });

  try {
    const examCollection = await dbConnect(collectionNameObj.examMcqCollection);
    const exam = await examCollection.findOne({ _id: new ObjectId(id) });

    if (!exam) return NextResponse.json({ success: false, message: "Exam not found" });

    return NextResponse.json({ success: true, exam });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to load exam" });
  }
}

export async function DELETE(req, context) {
  const params = await context.params;
  const id = params.id;

  if (!id) return NextResponse.json({ success: false, message: "ID is required" });

  try {
    const examCollection = await dbConnect(collectionNameObj.examMcqCollection);
    await examCollection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true, message: "Exam deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Delete failed" });
  }
}

export async function PATCH(req, context) {
  const params = await context.params;
  const id = params.id;

  if (!id) return NextResponse.json({ success: false, message: "ID is required" });

  const body = await req.json();

  try {
    const examCollection = await dbConnect(collectionNameObj.examMcqCollection);
    await examCollection.updateOne({ _id: new ObjectId(id) }, { $set: body });

    return NextResponse.json({ success: true, message: "Exam updated" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Update failed" });
  }
}
