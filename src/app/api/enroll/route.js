// app/api/enroll/route.js
import { NextResponse } from "next/server";
import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { courseId, paymentMethod, sessionId, status, price = 0 } = await req.json();

    console.log('Enrollment request received:', {
      courseId,
      paymentMethod,
      sessionId,
      status,
      price
    });

    // Validate required fields
    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Connect to database
    const paymentCollection = await dbConnect(collectionNameObj.paymentCollection);
    const coursesCollection = await dbConnect(collectionNameObj.coursesCollection);
    const usersCollection = await dbConnect(collectionNameObj.userCollection);

    console.log('Looking for course with ID:', courseId);
    
    // Try to find course
    let course;
    try {
      course = await coursesCollection.findOne({ _id: new ObjectId(courseId) });
    } catch (error) {
      course = await coursesCollection.findOne({ _id: courseId });
    }

    if (!course) {
      course = await coursesCollection.findOne({ 
        $or: [
          { _id: courseId },
          { _id: new ObjectId(courseId) },
          { id: courseId }
        ]
      });
    }
    
    if (!course) {
      return NextResponse.json(
        { error: `Course not found. ID: ${courseId}` },
        { status: 404 }
      );
    }

    // Check if payment already exists
    const existingPayment = await paymentCollection.findOne({ sessionId });
    if (existingPayment) {
      console.log('Payment already exists:', existingPayment._id);
      return NextResponse.json({ 
        success: true,
        message: "Payment already processed",
        courseId,
        paymentId: existingPayment._id,
        accessGranted: true
      });
    }

    // Get the most recent active user from database
    let user = await usersCollection.findOne({ 
      status: "active" 
    }, {
      sort: { lastLogin: -1 }
    });

    // If no user found, create a temporary one
    if (!user) {
      console.log('No active user found, creating temporary user...');
      user = {
        _id: new ObjectId(),
        name: "Payment User",
        email: `user_${sessionId.substring(0, 8)}@example.com`,
        status: "active",
        role: "user", // Default role
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date()
      };
      
      const userResult = await usersCollection.insertOne(user);
      user._id = userResult.insertedId;
      console.log('Created temporary user:', user.email);
    } else {
      console.log('Using existing user:', user.email);
    }

    // ============ AUTOMATIC ROLE UPDATE ============
    let roleUpdated = false;
    
    // Check if we should update role to student
    if (status === "success" || status === "completed" || status === "paid") {
      // Only update if current role is "user" or undefined
      const currentRole = user.role || "user";
      
      if (currentRole === "user") {
        // Update user role to student
        await usersCollection.updateOne(
          { _id: user._id },
          { 
            $set: { 
              role: "student",
              updatedAt: new Date()
            }
          }
        );
        roleUpdated = true;
        console.log(`✅ User ${user.email} role updated from "user" to "student"`);
      } else {
        console.log(`⚠️ User ${user.email} already has role: "${currentRole}" - no update needed`);
      }
    }
    // ============ END ROLE UPDATE ============

    // Generate transaction ID
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create payment record
    const paymentData = {
      sessionId,
      transactionId,
      courseId: course._id.toString(),
      courseTitle: course.title || "Unknown Course",
      courseInstructor: course.instructor_name || "Unknown Instructor",
      amount: price || course.price || 0,
      currency: "BDT",
      paymentMethod,
      status: status || "completed",
      paymentDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      
      // USER INFORMATION
      userId: user._id.toString(),
      userEmail: user.email,
      userName: user.name,
      userPhotoURL: user.photoURL,
      userProvider: user.provider,
      userRole: roleUpdated ? "student" : (user.role || "user"), // Updated role
      roleUpdated: roleUpdated, // Track if role was updated
      
      metadata: {
        stripeSessionId: sessionId,
        coursePrice: course.price,
        originalCourseId: courseId,
        userPhone: user.phone,
        userAddress: user.address,
        isTemporaryUser: !user.lastLogin
      }
    };

    // Save payment to database
    const result = await paymentCollection.insertOne(paymentData);
    
    console.log('Payment saved to database with ID:', result.insertedId);
    console.log('User email used:', user.email);

    // Update user's enrolled courses
    try {
      await usersCollection.updateOne(
        { _id: user._id },
        { 
          $addToSet: { 
            enrolledCourses: {
              courseId: course._id.toString(),
              courseTitle: course.title,
              enrolledAt: new Date(),
              paymentId: result.insertedId,
              transactionId: transactionId,
              courseInstructor: course.instructor_name,
              coursePrice: course.price
            }
          },
          $set: { 
            updatedAt: new Date(),
            lastLogin: new Date()
          }
        }
      );
      console.log('User enrolled courses updated successfully');
    } catch (userUpdateError) {
      console.error('Error updating user enrolled courses:', userUpdateError);
    }

    return NextResponse.json({ 
      success: true,
      message: "Successfully enrolled in course",
      courseId: course._id.toString(),
      courseTitle: course.title,
      paymentId: result.insertedId,
      transactionId: transactionId,
      userId: user._id.toString(),
      userEmail: user.email,
      userName: user.name,
      userRole: roleUpdated ? "student" : (user.role || "user"),
      roleUpdated: roleUpdated,
      accessGranted: true,
      enrolledAt: new Date().toISOString()
    });

  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json(
      { error: "Internal server error during enrollment: " + error.message },
      { status: 500 }
    );
  }
}