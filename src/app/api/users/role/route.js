import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const usersCollection = await dbConnect("users");
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return NextResponse.json({ role: "user" });
    }

    return NextResponse.json({ role: user.role || "user" });
  } catch (error) {
    console.error("Role fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
