import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    if (!ObjectId.isValid(id))
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });

    const coursesCollection = await dbConnect(collectionNameObj.coursesCollection);
    const course = await coursesCollection.findOne({ _id: new ObjectId(id) });

    if (!course)
      return NextResponse.json({ error: "Course not found" }, { status: 404 });

    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    if (!ObjectId.isValid(id))
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });

    const coursesCollection = await dbConnect(collectionNameObj.coursesCollection);
    const result = await coursesCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0)
      return NextResponse.json({ error: "Course not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Course deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}

// ⭐ PUT API (update course)
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!ObjectId.isValid(id))
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });

    const coursesCollection = await dbConnect(collectionNameObj.coursesCollection);

    const result = await coursesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body, updated_at: new Date() } }
    );

    if (result.matchedCount === 0)
      return NextResponse.json({ error: "Course not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Course updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}
