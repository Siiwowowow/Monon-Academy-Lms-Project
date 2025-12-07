import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// Fix: Add this helper function to handle ObjectId validation for both string and ObjectId
function isValidId(id) {
  try {
    return ObjectId.isValid(id) || typeof id === 'string';
  } catch {
    return false;
  }
}

export async function GET(request, { params }) {
  try {
    // Fix: Await the params object
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    const coursesCollection = await dbConnect(collectionNameObj.coursesCollection);
    
    // Try to find course by different ID formats
    let course;
    
    // First try as ObjectId
    if (ObjectId.isValid(id)) {
      course = await coursesCollection.findOne({ _id: new ObjectId(id) });
    }
    
    // If not found, try as string ID
    if (!course) {
      course = await coursesCollection.findOne({ _id: id });
    }
    
    // If still not found, try searching by any field containing the ID
    if (!course) {
      course = await coursesCollection.findOne({
        $or: [
          { id: id }, // If you have an 'id' field
          { courseId: id }, // If you have a 'courseId' field
          { slug: id } // If you have a 'slug' field
        ]
      });
    }

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    // Fix: Await the params object
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    const coursesCollection = await dbConnect(collectionNameObj.coursesCollection);
    
    let result;
    
    // Try to delete by ObjectId
    if (ObjectId.isValid(id)) {
      result = await coursesCollection.deleteOne({ _id: new ObjectId(id) });
    } else {
      // Try to delete by string ID
      result = await coursesCollection.deleteOne({ _id: id });
    }

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Course deleted successfully" 
    }, { status: 200 });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}

// ⭐ PUT API (update course)
export async function PUT(request, { params }) {
  try {
    // Fix: Await the params object
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    const coursesCollection = await dbConnect(collectionNameObj.coursesCollection);

    let result;
    
    // Try to update by ObjectId
    if (ObjectId.isValid(id)) {
      result = await coursesCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...body, updated_at: new Date() } }
      );
    } else {
      // Try to update by string ID
      result = await coursesCollection.updateOne(
        { _id: id },
        { $set: { ...body, updated_at: new Date() } }
      );
    }

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Course updated successfully" 
    }, { status: 200 });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}