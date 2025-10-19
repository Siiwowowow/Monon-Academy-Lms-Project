import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { action, userId, comment } = body;

    const postsCollection = await dbConnect(collectionNameObj.postCollection);

    let updateQuery = {};
    
    if (action === 'like') {
      updateQuery = { $inc: { likes: 1 } };
    } else if (action === 'unlike') {
      updateQuery = { $inc: { likes: -1 } };
    } else if (action === 'comment' && comment) {
      updateQuery = {
        $push: {
          comments: {
            id: new ObjectId(),
            userId,
            comment,
            timestamp: new Date()
          }
        }
      };
    } else if (action === 'share') {
      updateQuery = { $inc: { shares: 1 } };
    }

    const result = await postsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      updateQuery,
      { returnDocument: "after" }
    );

    if (!result.value) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Post updated successfully", post: result.value },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}