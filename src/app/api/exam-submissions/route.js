// app/api/exam-submissions/route.js
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import dbConnect from '../../../lib/dbConnect';

export async function POST(request) {
  try {
    const submissionData = await request.json();
    
    const submissionsCollection = await dbConnect('exam_submissions');
    const examsCollection = await dbConnect('exams');

    // Fetch exam data to get questions and correct answers
    const exam = await examsCollection.findOne({ 
      _id: new ObjectId(submissionData.examId) 
    });

    if (!exam) {
      return NextResponse.json({ success: false, error: 'Exam not found' }, { status: 404 });
    }

    // Calculate results and marks
    let obtainedMarks = 0;
    const questionResults = {};
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let unanswered = 0;

    exam.questions?.forEach(question => {
      const userAnswer = submissionData.answers[question._id];
      let isCorrect = false;
      let pointsEarned = 0;

      if (question.questionType === 'multiple-choice') {
        const correctOptionIndex = question.options?.findIndex(opt => opt.isCorrect);
        
        if (userAnswer === correctOptionIndex) {
          isCorrect = true;
          pointsEarned = question.points || 1;
          obtainedMarks += pointsEarned;
          correctAnswers++;
        } else if (userAnswer !== null && userAnswer !== undefined) {
          incorrectAnswers++;
        } else {
          unanswered++;
        }
      } else {
        // For creative and other question types
        const hasAnswer = userAnswer && 
          (typeof userAnswer === 'string' ? userAnswer.trim() !== '' :
           (question.questionType === 'creative' ? 
            Object.values(userAnswer || {}).some(val => val && (typeof val === 'string' ? val.trim() !== '' : val)) : 
            false));
        
        if (hasAnswer) {
          // These need manual grading - initially 0 points
          pointsEarned = 0;
          unanswered++; // Count as unanswered for auto-grading purposes
        } else {
          unanswered++;
        }
      }

      questionResults[question._id] = {
        isCorrect,
        pointsEarned,
        correctAnswer: question.questionType === 'multiple-choice' ? 
          question.options?.findIndex(opt => opt.isCorrect) : null,
        questionType: question.questionType,
        points: question.points || 1
      };
    });

    const submissionWithResults = {
      ...submissionData,
      obtainedMarks,
      totalMarks: exam.totalMarks,
      questionResults,
      correctAnswers,
      incorrectAnswers,
      unanswered,
      submittedAt: new Date(),
      examTitle: exam.title,
      examSubject: exam.subject,
      examDuration: exam.duration,
      passingMarks: exam.passingMarks
    };

    const result = await submissionsCollection.insertOne(submissionWithResults);
    
    return NextResponse.json({ 
      success: true, 
      data: {
        _id: result.insertedId,
        ...submissionWithResults
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const examId = searchParams.get('examId');
    const studentId = searchParams.get('studentId');

    const submissionsCollection = await dbConnect('exam_submissions');
    
    const filter = {};
    if (examId) filter.examId = examId;
    if (studentId) filter.studentId = studentId;

    const submissions = await submissionsCollection.find(filter)
      .sort({ submittedAt: -1 })
      .toArray();
    
    return NextResponse.json({ success: true, data: submissions });
  } catch (error) {
    console.error('GET submissions error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}