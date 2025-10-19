import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, photoURL, provider } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const usersCollection = await dbConnect(collectionNameObj.userCollection);

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      // Update lastLogin and updatedAt for returning users
      const updatedUser = await usersCollection.findOneAndUpdate(
        { email },
        { $set: { lastLogin: new Date(), updatedAt: new Date() } },
        { returnDocument: "after" }
      );

      return NextResponse.json(
        { message: "User already exists", user: updatedUser.value },
        { status: 200 }
      );
    }

    // Create new user
    const newUser = {
      name: name || null,
      email,
      photoURL: photoURL || null,
      provider: provider || "credentials",
      role: "user",
      isVerified: false,
      status: "active",
      phone: null,
      address: null,
      preferences: {
        language: "en",
        theme: "light",
        notifications: true,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: new Date(), // first login
    };

    const result = await usersCollection.insertOne(newUser);

    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const usersCollection = await dbConnect(collectionNameObj.userCollection);

    // Optional: get email from query params
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    let query = {};
    if (email) {
      query.email = email;
    }

    const users = await usersCollection.find(query).toArray();

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
