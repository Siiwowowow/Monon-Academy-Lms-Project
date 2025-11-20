import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect, { collectionNameObj } from "@/lib/dbConnect"; 

// GET: সব পোস্ট লোড (নতুন পোস্ট আগে)
export async function GET() {
  try {
    const postsCollection = await dbConnect(collectionNameObj.postsCollection);
    const posts = await postsCollection.find({}).sort({ _id: -1 }).toArray();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

// POST: নতুন পোস্ট তৈরি (Multiple Image Support)
export async function POST(request) {
  try {
    const body = await request.json();
    const postsCollection = await dbConnect(collectionNameObj.postsCollection);

    // Handle both single image and multiple images
    const images = body.images || (body.image ? [body.image] : []);

    const newPost = {
      content: body.content,
      images: images, // Store as array for multiple images
      image: images.length > 0 ? images[0] : null, // Keep single image for backward compatibility
      author: {
        name: body.user.name,
        email: body.user.email,
        photoURL: body.user.image,
        role: body.user.role || 'student'
      },
      likes: [],
      comments: [], // এর ভেতরে এখন replies অ্যারেও থাকবে
      createdAt: new Date(),
      updatedAt: new Date(), // এডিট ট্র্যাকিং এর জন্য
    };

    const result = await postsCollection.insertOne(newPost);
    
    // Return the full post data including images array
    return NextResponse.json({ 
      message: "Post created", 
      postId: result.insertedId,
      ...newPost,
      _id: result.insertedId
    }, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

// PUT: লাইক, কমেন্ট, রিপ্লাই এবং পোস্ট আপডেট হ্যান্ডেল করা
export async function PUT(request) {
  try {
    const body = await request.json();
    const postsCollection = await dbConnect(collectionNameObj.postsCollection);
    
    const { postId, action, payload } = body; 
    const filter = { _id: new ObjectId(postId) };

    // ১. লাইক লজিক
    if (action === 'like') {
      const post = await postsCollection.findOne(filter);
      const isLiked = post.likes?.includes(payload.email);
      const updateDoc = isLiked 
        ? { $pull: { likes: payload.email } }
        : { $addToSet: { likes: payload.email } };
        
      await postsCollection.updateOne(filter, updateDoc);
      return NextResponse.json({ message: "Like updated" });
    } 
    
    // ২. কমেন্ট লজিক (মেইন কমেন্ট)
    else if (action === 'comment') {
      const newComment = {
        id: new ObjectId(),
        text: payload.text,
        author: payload.user,
        createdAt: new Date(),
        replies: [] // রিপ্লাই রাখার জন্য খালি অ্যারে
      };
      await postsCollection.updateOne(filter, { $push: { comments: newComment } });
      return NextResponse.json({ message: "Comment added", comment: newComment });
    }

    // ৩. রিপ্লাই লজিক (কমেন্টের রিপ্লাই)
    else if (action === 'reply_comment') {
      const { commentId, text, user } = payload;
      const newReply = {
        id: new ObjectId(),
        text,
        author: user,
        createdAt: new Date()
      };

      // নেস্টেড কমেন্ট আপডেট করার জন্য ফিল্টার ও আপডেট কুয়েরি
      await postsCollection.updateOne(
        { _id: new ObjectId(postId), "comments.id": new ObjectId(commentId) },
        { $push: { "comments.$.replies": newReply } }
      );
      
      return NextResponse.json({ message: "Reply added", reply: newReply });
    }

    // ৪. পোস্ট আপডেট (Edit) লজিক
    else if (action === 'update_post') {
      // চেক করা ওই ইউজারই কিনা (সাধারণত সার্ভার সেশনে চেক করা উচিত, এখানে ইমেইল দিয়ে করা হলো)
      const post = await postsCollection.findOne(filter);
      if (post.author.email !== payload.user.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }

      await postsCollection.updateOne(filter, {
        $set: { 
          content: payload.content,
          updatedAt: new Date() 
        }
      });
      return NextResponse.json({ message: "Post updated" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}

// DELETE: পোস্ট ডিলিট করা (শুধুমাত্র নিজের পোস্ট)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const email = searchParams.get('email'); // সিকিউরিটির জন্য টোকেন ব্যবহার করা উত্তম

    if (!postId || !email) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    const postsCollection = await dbConnect(collectionNameObj.postsCollection);
    const post = await postsCollection.findOne({ _id: new ObjectId(postId) });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.author.email !== email) {
      return NextResponse.json({ error: "Unauthorized action" }, { status: 403 });
    }

    await postsCollection.deleteOne({ _id: new ObjectId(postId) });
    return NextResponse.json({ message: "Post deleted successfully" });

  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}