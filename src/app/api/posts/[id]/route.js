import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { 
      action, 
      userEmail
    } = body;

    console.log("Like/Unlike request:", { id, action, userEmail });

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email is required" },
        { status: 400 }
      );
    }

    const postsCollection = await dbConnect(collectionNameObj.postCollection);
    
    let postId;
    try {
      postId = new ObjectId(id);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid post ID" },
        { status: 400 }
      );
    }

    // Get the existing post
    const existingPost = await postsCollection.findOne({ _id: postId });
    
    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    let updateQuery = {};
    let message = "";

    if (action === 'like') {
      // Check if user already liked the post
      const alreadyLiked = existingPost.likedBy?.includes(userEmail);
      if (alreadyLiked) {
        return NextResponse.json(
          { error: "You have already liked this post" },
          { status: 400 }
        );
      }

      updateQuery = {
        $inc: { likes: 1 },
        $addToSet: { likedBy: userEmail }
      };
      message = "Post liked successfully";

    } else if (action === 'unlike') {
      // Check if user has liked the post
      const hasLiked = existingPost.likedBy?.includes(userEmail);
      if (!hasLiked) {
        return NextResponse.json(
          { error: "You haven't liked this post yet" },
          { status: 400 }
        );
      }

      updateQuery = {
        $inc: { likes: -1 },
        $pull: { likedBy: userEmail }
      };
      message = "Post unliked successfully";

    } else {
      // This is a regular post update (not like/unlike)
      const { content, images, userEmail: updateUserEmail } = body;
      
      if (existingPost.userEmail !== updateUserEmail) {
        return NextResponse.json(
          { error: "Unauthorized to edit this post" }, 
          { status: 403 }
        );
      }

      updateQuery = {
        $set: {
          content: content || existingPost.content,
          images: images || existingPost.images,
          updatedAt: new Date()
        }
      };
      message = "Post updated successfully";
    }

    const result = await postsCollection.findOneAndUpdate(
      { _id: postId },
      updateQuery,
      { returnDocument: "after" }
    );

    if (!result.value) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Convert MongoDB ObjectId to string and add liked status
    const updatedPost = {
      ...result.value,
      _id: result.value._id.toString(),
      liked: result.value.likedBy?.includes(userEmail) || false
    };

    return NextResponse.json(
      { message, post: updatedPost },
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

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('userEmail');

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email is required" },
        { status: 400 }
      );
    }

    const postsCollection = await dbConnect(collectionNameObj.postCollection);
    
    let postId;
    try {
      postId = new ObjectId(id);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid post ID" },
        { status: 400 }
      );
    }

    const existingPost = await postsCollection.findOne({ _id: postId });
    
    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (existingPost.userEmail !== userEmail) {
      return NextResponse.json(
        { error: "Unauthorized to delete this post" }, 
        { status: 403 }
      );
    }

    const deleteResult = await postsCollection.deleteOne({ _id: postId });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(
      { 
        message: "Post deleted successfully",
        deletedId: id
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}