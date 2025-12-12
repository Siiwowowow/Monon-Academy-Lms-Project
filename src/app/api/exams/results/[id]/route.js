// app/api/exams/results/[id]/route.js
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import dbConnect from '@/lib/dbConnect';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid result ID format' },
        { status: 400 }
      );
    }
    
    const examResultsCollection = await dbConnect('examResults');
    
    const result = await examResultsCollection.findOne({ 
      _id: new ObjectId(id) 
    });
    
    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Result not found' },
        { status: 404 }
      );
    }
    
    // Format the response for frontend
    const formattedResult = {
      ...result,
      _id: result._id.toString(),
      examId: result.examId?.toString(),
      // Calculate additional metrics if needed
      percentage: result.percentage || 0,
      passed: result.passed || false,
      totalQuestions: result.totalQuestions || 0,
      correctAnswers: result.correctAnswers || 0,
      wrongAnswers: result.wrongAnswers || 0,
      unanswered: result.unanswered || 0
    };
    
    return NextResponse.json({
      success: true,
      result: formattedResult
    });
    
  } catch (error) {
    console.error('Error fetching result:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}