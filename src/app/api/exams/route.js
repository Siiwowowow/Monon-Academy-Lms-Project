// app/api/exams/route.js
import dbConnect, { collectionNameObj } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';

// GET - Fetch all exams for teacher
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');
    const subject = searchParams.get('subject');
    const classLevel = searchParams.get('classLevel');
    const educationBoard = searchParams.get('educationBoard');

    const examsCollection = await dbConnect(collectionNameObj.examCollection);
    
    // Build filter based on query parameters
    let filter = {};
    if (teacherId) filter.teacherId = teacherId;
    if (subject) filter.subject = subject;
    if (classLevel) filter.classLevel = classLevel;
    if (educationBoard) filter.educationBoard = educationBoard;

    const exams = await examsCollection.find(filter)
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json({ success: true, data: exams });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// POST - Create new exam
export async function POST(request) {
  try {
    const examData = await request.json();
    
    if (!examData.teacherId) {
      return NextResponse.json({ message: 'Teacher ID required' }, { status: 400 });
    }

    const examsCollection = await dbConnect(collectionNameObj.examCollection);
    
    const examWithTimestamp = {
      ...examData,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublished: false
    };

    const result = await examsCollection.insertOne(examWithTimestamp);
    
    return NextResponse.json({ 
      success: true, 
      data: {
        _id: result.insertedId,
        ...examWithTimestamp
      }
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}