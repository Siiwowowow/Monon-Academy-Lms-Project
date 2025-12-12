import { NextResponse } from "next/server";
import dbConnect, { collectionNameObj } from "@/lib/dbConnect";

// ==============================
//     CREATE MCQ EXAM (POST)
// ==============================
export async function POST(req) {
  try {
    const body = await req.json();

    // Validate basic fields
    if (!body.examTitle || !body.subject || !body.questions?.length) {
      return NextResponse.json(
        { success: false, message: "Please fill all required fields!" },
        { status: 400 }
      );
    }

    // Connect to DB
    const mcqCollection = await dbConnect(collectionNameObj.examMcqCollection);

    // Insert exam
    const newExam = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: body.isActive !== false, // Default to true
      attempts: 0,
      averageScore: 0,
      passRate: 0
    };

    const result = await mcqCollection.insertOne(newExam);

    return NextResponse.json(
      {
        success: true,
        message: "MCQ Exam Created Successfully!",
        examId: result.insertedId,
        exam: { ...newExam, _id: result.insertedId }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating MCQ Exam:", error);
    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}

// ==============================
//     GET MCQ EXAMS (with filters)
// ==============================
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const instructorEmail = searchParams.get('instructorEmail'); // For teacher dashboard
    const forStudents = searchParams.get('forStudents') === 'true'; // For student dashboard
    const isActive = searchParams.get('isActive'); // Filter by active status
    const subject = searchParams.get('subject'); // Filter by subject
    const limit = parseInt(searchParams.get('limit')) || 50;
    const page = parseInt(searchParams.get('page')) || 1;
    const skip = (page - 1) * limit;

    const mcqCollection = await dbConnect(collectionNameObj.examMcqCollection);
    
    // Build query based on parameters
    let query = {};
    
    // For teacher dashboard: show only their exams
    if (instructorEmail) {
      query.instructorEmail = instructorEmail;
    }
    
    // For student dashboard: show only active exams
    if (forStudents) {
      query.isActive = true; // Only show active exams to students
    }
    
    // Filter by active status if specified
    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }
    
    // Filter by subject if specified
    if (subject && subject !== 'all') {
      query.subject = subject;
    }

    // Get total count for pagination
    const totalExams = await mcqCollection.countDocuments(query);
    
    // Execute query with pagination
    const exams = await mcqCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json(
      { 
        success: true, 
        exams,
        pagination: {
          page,
          limit,
          total: totalExams,
          pages: Math.ceil(totalExams / limit)
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching exams:", error);
    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}