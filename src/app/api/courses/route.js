import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const group = searchParams.get("group") || "";
    const email = searchParams.get("email") || ""; // ⭐ added
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const skip = (page - 1) * limit;

    const coursesCollection = await dbConnect(
      collectionNameObj.coursesCollection
    );

    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { instructor_name: { $regex: search, $options: "i" } },
      ];
    }

    if (group) query.group = group;

    if (email) query.instructor_email = email; // ⭐ only own courses

    const total = await coursesCollection.countDocuments(query);

    const courses = await coursesCollection
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json(
      {
        success: true,
        data: courses,
        total,
        totalPages: Math.ceil(total / limit),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const courseData = await request.json();

    const requiredFields = [
      "title",
      "short_description",
      "instructor_name",
      "subject",
      "class",
      "group",
      "price",
      "instructor_email" // ⭐ added
    ];

    for (const field of requiredFields) {
      if (!courseData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const coursesCollection = await dbConnect(
      collectionNameObj.coursesCollection
    );

    const courseToInsert = {
      ...courseData,
      rating: 0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await coursesCollection.insertOne(courseToInsert);

    return NextResponse.json(
      {
        success: true,
        message: "Course created successfully",
        courseId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
