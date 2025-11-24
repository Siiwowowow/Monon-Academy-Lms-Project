import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import dbConnect, { collectionNameObj } from '@/lib/dbConnect';

// GET: লেসনের এক্সাম ফেচ করতে
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const lessonId = searchParams.get('lessonId');

    if (!courseId || !lessonId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Course ID and Lesson ID are required' 
      });
    }

    const examCollection = await dbConnect(collectionNameObj.examCollection);
    
    // Find exam by course ID and lesson ID
    const exam = await examCollection.findOne({
      course_id: courseId,
      lesson_id: lessonId,
      is_active: true
    });

    return NextResponse.json({ 
      success: true, 
      exam 
    });
  } catch (error) {
    console.error('Error fetching exam:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    });
  }
}

// POST: কোর্স থেকে এক্সাম তৈরি করতে
export async function POST(request) {
  try {
    const { courseId, curriculum } = await request.json();

    if (!courseId || !curriculum) {
      return NextResponse.json({ 
        success: false, 
        error: 'Course ID and curriculum are required' 
      });
    }

    const examCollection = await dbConnect(collectionNameObj.examCollection);
    const createdExams = [];

    // প্রতিটি লেসনের জন্য এক্সাম তৈরি করুন
    for (const chapter of curriculum) {
      for (const lesson of chapter.lessons) {
        if (lesson.exam && lesson.exam.has_exam) {
          // চেক করুন এক্সাম ইতিমধ্যে exists কিনা
          const existingExam = await examCollection.findOne({
            course_id: courseId,
            lesson_id: lesson._id || lesson.lesson_title
          });

          if (!existingExam) {
            const examData = {
              course_id: courseId,
              lesson_id: lesson._id || lesson.lesson_title,
              lesson_title: lesson.lesson_title,
              title: lesson.exam.title,
              description: lesson.exam.description,
              duration: lesson.exam.duration,
              total_marks: lesson.exam.total_marks,
              passing_marks: lesson.exam.passing_marks,
              questions: lesson.exam.questions,
              is_active: true,
              created_at: new Date(),
              updated_at: new Date()
            };

            const result = await examCollection.insertOne(examData);
            createdExams.push({ ...examData, _id: result.insertedId });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      created_count: createdExams.length,
      exams: createdExams,
      message: 'Lesson exams created successfully'
    });
  } catch (error) {
    console.error('Error creating exams:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    });
  }
}