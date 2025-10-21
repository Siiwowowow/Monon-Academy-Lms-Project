import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const { 
      content, 
      images, 
      userId, 
      user, 
      userName, 
      userAvatar, 
      userEmail 
    } = body;

    console.log("Create post request:", { userEmail, content: content?.substring(0, 50) });

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email is required" },
        { status: 400 }
      );
    }

    const postsCollection = await dbConnect(collectionNameObj.postCollection);

    const newPost = {
      content: content || "",
      images: images || [],
      userId: userId || "guest",
      user: user || {
        name: userName,
        photoURL: userAvatar,
        email: userEmail
      },
      userName: userName || "User",
      userAvatar: userAvatar || "/default-avatar.png",
      userEmail: userEmail,
      likes: 0,
      likedBy: [], // Array to track users who liked the post
      comments: [],
      commentsCount: 0,
      shares: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await postsCollection.insertOne(newPost);

    const createdPost = {
      _id: result.insertedId,
      ...newPost,
      liked: false // Default like status for new post
    };

    return NextResponse.json(
      { 
        message: "Post created successfully", 
        post: createdPost
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 5;
    const skip = (page - 1) * limit;

    const postsCollection = await dbConnect(collectionNameObj.postCollection);

    const posts = await postsCollection
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Convert MongoDB ObjectId to string and add liked status
    const processedPosts = posts.map(post => ({
      ...post,
      _id: post._id.toString(),
      liked: post.likedBy?.length > 0 || false
    }));

    const totalPosts = await postsCollection.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);
    const hasNext = page < totalPages;

    return NextResponse.json({
      posts: processedPosts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        hasNext,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}