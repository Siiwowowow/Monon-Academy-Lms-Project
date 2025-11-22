import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const group = searchParams.get("group") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 6;

    const skip = (page - 1) * limit;

    const coursesCollection = await dbConnect(collectionNameObj.coursesCollection);

    let query = {};

    // 🔍 Search by title or instructor name
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { instructor_name: { $regex: search, $options: "i" } }
      ];
    }

    // 🧪 Filter by group
    if (group) {
      query.group = group;
    }

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
        currentPage: page
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
