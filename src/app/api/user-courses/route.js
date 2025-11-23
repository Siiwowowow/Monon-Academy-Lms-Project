import { NextResponse } from "next/server";
import dbConnect, { collectionNameObj } from "@/lib/dbConnect";

export async function POST(request) {
  try {
    const { userEmail } = await request.json();

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email is required" },
        { status: 400 }
      );
    }

    console.log('Fetching courses for user:', userEmail);

    // Connect to database
    const paymentCollection = await dbConnect(collectionNameObj.paymentCollection);

    // Find all completed payments for this user
    const payments = await paymentCollection.find({ 
      userEmail: userEmail,
      status: { $in: ["completed", "success"] } // Handle both status values
    }).sort({ paymentDate: -1 }).toArray();

    console.log(`Found ${payments.length} enrolled courses for ${userEmail}`);

    // Transform the payment data into course format
    const courses = payments.map(payment => ({
      _id: payment._id,
      courseId: payment.courseId,
      courseTitle: payment.courseTitle,
      courseInstructor: payment.courseInstructor,
      amount: payment.amount,
      paymentDate: payment.paymentDate,
      transactionId: payment.transactionId,
      status: payment.status,
      // You can add more course details here if needed
    }));

    return NextResponse.json({ 
      success: true,
      courses,
      userEmail,
      totalCourses: courses.length
    });

  } catch (error) {
    console.error("User courses fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching user courses" },
      { status: 500 }
    );
  }
}