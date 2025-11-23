import { NextResponse } from "next/server";
import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    console.log('Checking enrollment for course:', courseId);

    // Connect to database
    const paymentCollection = await dbConnect(collectionNameObj.paymentCollection);

    // Check if there's any completed payment for this course
    const payment = await paymentCollection.findOne({ 
      courseId: courseId,
      status: "completed"
    });

    const isEnrolled = !!payment;

    console.log('Enrollment result:', isEnrolled, 'for course:', courseId);

    return NextResponse.json({ 
      isEnrolled,
      courseId,
      paymentId: payment?._id,
      transactionId: payment?.transactionId,
      enrolledAt: payment?.paymentDate,
      userEmail: payment?.userEmail
    });

  } catch (error) {
    console.error("Enrollment check error:", error);
    return NextResponse.json(
      { error: "Internal server error during enrollment check" },
      { status: 500 }
    );
  }
}