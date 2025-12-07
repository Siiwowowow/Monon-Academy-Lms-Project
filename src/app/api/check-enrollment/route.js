// app/api/check-enrollment>route.js
import { NextResponse } from "next/server";
import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

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
    const coursesCollection = await dbConnect(collectionNameObj.coursesCollection);

    // Find all completed payments for this user
    const payments = await paymentCollection.find({ 
      userEmail: userEmail,
      status: { $in: ["completed", "success", "paid"] }
    }).sort({ paymentDate: -1 }).toArray();

    console.log(`Found ${payments.length} payments for ${userEmail}`);

    // Get detailed course information for each payment
    const coursesWithDetails = await Promise.all(
      payments.map(async (payment) => {
        try {
          let courseDetails = null;
          
          // Try to find course by different ID formats
          try {
            courseDetails = await coursesCollection.findOne({ 
              _id: new ObjectId(payment.courseId) 
            });
          } catch (error) {
            courseDetails = await coursesCollection.findOne({ 
              _id: payment.courseId 
            });
          }

          if (!courseDetails) {
            courseDetails = await coursesCollection.findOne({
              $or: [
                { _id: payment.courseId },
                { _id: new ObjectId(payment.courseId) }
              ]
            });
          }

          return {
            // Payment info
            _id: payment._id,
            courseId: payment.courseId,
            courseTitle: payment.courseTitle,
            courseInstructor: payment.courseInstructor,
            amount: payment.amount,
            paymentDate: payment.paymentDate,
            transactionId: payment.transactionId,
            status: payment.status,
            currency: payment.currency,
            
            // Course details
            ...courseDetails,
            class: courseDetails?.class,
            group: courseDetails?.group,
            subject: courseDetails?.subject,
            short_description: courseDetails?.short_description,
            thumbnail_url: courseDetails?.thumbnail_url,
            total_videos: courseDetails?.total_videos,
            language: courseDetails?.language,
            premium: courseDetails?.premium,
            rating: courseDetails?.rating,
            curriculum: courseDetails?.curriculum
          };
        } catch (error) {
          console.error(`Error fetching course details for ${payment.courseId}:`, error);
          return {
            // Return basic payment info if course details not found
            _id: payment._id,
            courseId: payment.courseId,
            courseTitle: payment.courseTitle,
            courseInstructor: payment.courseInstructor,
            amount: payment.amount,
            paymentDate: payment.paymentDate,
            status: payment.status,
            currency: payment.currency
          };
        }
      })
    );

    return NextResponse.json({ 
      success: true,
      courses: coursesWithDetails,
      userEmail,
      totalCourses: coursesWithDetails.length
    });

  } catch (error) {
    console.error("User courses fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching user courses: " + error.message },
      { status: 500 }
    );
  }
}