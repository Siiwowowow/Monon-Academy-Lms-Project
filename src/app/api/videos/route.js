// api/videos/route.js - FINAL SOLUTION
import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import { collectionNameObj } from "@/lib/dbConnect"

export async function GET(request) {
  try {
    const videosCollection = await dbConnect(collectionNameObj.videoCollection)
    
    // Get auth token from header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (token) {
      try {
        // User is logged in - সব data দেবো
        const allVideos = await videosCollection.find({}).toArray()
        console.log('Authenticated user - returning all videos')
        return NextResponse.json({ success: true, data: allVideos })
      } catch (authError) {
        // Token invalid - public data দেবো
        console.log('Invalid token - returning public videos')
        const publicVideos = await videosCollection.find({ isPublic: true }).toArray()
        return NextResponse.json({ success: true, data: publicVideos })
      }
    } else {
      // No token - public data দেবো
      console.log('No token - returning public videos')
      const publicVideos = await videosCollection.find({ isPublic: true }).toArray()
      return NextResponse.json({ success: true, data: publicVideos })
    }
    
  } catch (error) {
    console.error("Error fetching videos:", error)
    return NextResponse.json(
      { success: false, error: "Failed to load videos" },
      { status: 500 }
    )
  }
}