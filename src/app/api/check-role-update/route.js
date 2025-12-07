// app/api/check-role-update/route.js
import { NextResponse } from "next/server";
import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const usersCollection = await dbConnect(collectionNameObj.userCollection);
    const paymentCollection = await dbConnect(collectionNameObj.paymentCollection);

    // Find user
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user has any successful payments but still has "user" role
    if (user.role === "user") {
      const successfulPayments = await paymentCollection.find({
        userEmail: email,
        status: { $in: ["success", "completed", "paid"] }
      }).toArray();

      if (successfulPayments.length > 0) {
        // Update role to student
        await usersCollection.updateOne(
          { _id: user._id },
          { 
            $set: { 
              role: "student",
              updatedAt: new Date()
            },
            $push: {
              roleHistory: {
                from: "user",
                to: "student",
                reason: "background_check_payment_found",
                changedAt: new Date(),
                checkDate: new Date()
              }
            }
          }
        );

        return NextResponse.json({
          success: true,
          message: "Role updated from 'user' to 'student'",
          previousRole: "user",
          newRole: "student",
          paymentsFound: successfulPayments.length,
          userEmail: email
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "No role update needed",
      currentRole: user.role,
      userEmail: email
    });

  } catch (error) {
    console.error("Role check error:", error);
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const usersCollection = await dbConnect(collectionNameObj.userCollection);
    const paymentCollection = await dbConnect(collectionNameObj.paymentCollection);

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get payment history
    const payments = await paymentCollection.find({
      userEmail: email
    }).sort({ paymentDate: -1 }).toArray();

    const successfulPayments = payments.filter(p => 
      ["success", "completed", "paid"].includes(p.status)
    );

    return NextResponse.json({
      success: true,
      userEmail: email,
      currentRole: user.role,
      totalPayments: payments.length,
      successfulPayments: successfulPayments.length,
      needsRoleUpdate: user.role === "user" && successfulPayments.length > 0,
      payments: payments.map(p => ({
        id: p._id,
        courseId: p.courseId,
        status: p.status,
        amount: p.amount,
        date: p.paymentDate,
        roleAtPayment: p.userRole
      }))
    });

  } catch (error) {
    console.error("Role check GET error:", error);
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}