// app/api/exam-submissions/[id]/route.js
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import dbConnect from '../../../../lib/dbConnect';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const submissionsCollection = await dbConnect('exam_submissions');
    
    let submission;
    try {
      // Try to find by ObjectId first
      submission = await submissionsCollection.findOne({ 
        _id: new ObjectId(id) 
      });
    } catch (error) {
      // If ObjectId fails, try as string
      submission = await submissionsCollection.findOne({ 
        _id: id 
      });
    }

    if (!submission) {
      return NextResponse.json({ 
        success: false, 
        error: 'Submission not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: submission 
    });
  } catch (error) {
    console.error('GET submission error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 400 });
  }
}