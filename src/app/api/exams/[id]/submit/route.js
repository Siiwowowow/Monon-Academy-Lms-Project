import { NextResponse } from 'next/server';
import dbConnect, { collectionNameObj } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { studentId, answers, timeSpent } = await request.json();

    if (!studentId || !answers) {
      return NextResponse.json({ 
        success: false, 
        error: 'Student ID and answers are required' 
      });
    }

    const examCollection = await dbConnect(collectionNameObj.examCollection);
    
    // Create exam_results collection if not exists
    let examResultCollection;
    try {
      examResultCollection = await dbConnect('exam_results');
    } catch (error) {
      // If collection doesn't exist, create it
      const db = (await dbConnect(collectionNameObj.examCollection)).db;
      examResultCollection = db.collection('exam_results');
    }

    // এক্সাম ফেচ করুন
    let exam;
    try {
      exam = await examCollection.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid exam ID' 
      });
    }
    
    if (!exam) {
      return NextResponse.json({ 
        success: false, 
        error: 'Exam not found' 
      });
    }

    // রেজাল্ট ক্যালকুলেট করুন
    let obtainedMarks = 0;
    let correctAnswers = 0;
    let totalQuestions = exam.questions.length;

    const questionResults = exam.questions.map((question, index) => {
      const studentAnswer = answers[index];
      const isCorrect = studentAnswer === question.correct_answer;
      
      if (isCorrect) {
        obtainedMarks += question.marks || 1;
        correctAnswers++;
      }

      return {
        question_text: question.question_text,
        student_answer: studentAnswer,
        correct_answer: question.correct_answer,
        is_correct: isCorrect,
        marks: question.marks || 1,
        obtained_marks: isCorrect ? (question.marks || 1) : 0
      };
    });

    // পাস/ফেল ডিটারমাইন করুন
    const percentage = (obtainedMarks / exam.total_marks) * 100;
    const isPassed = obtainedMarks >= exam.passing_marks;

    // রেজাল্ট সেভ করুন
    const examResult = {
      exam_id: id,
      student_id: studentId,
      course_id: exam.course_id,
      lesson_id: exam.lesson_id,
      obtained_marks: obtainedMarks,
      total_marks: exam.total_marks,
      percentage: Math.round(percentage),
      is_passed: isPassed,
      correct_answers: correctAnswers,
      total_questions: totalQuestions,
      time_spent: timeSpent,
      answers: questionResults,
      submitted_at: new Date()
    };

    await examResultCollection.insertOne(examResult);

    return NextResponse.json({
      success: true,
      result: {
        obtained_marks: obtainedMarks,
        total_marks: exam.total_marks,
        percentage: Math.round(percentage),
        is_passed: isPassed,
        correct_answers: correctAnswers,
        total_questions: totalQuestions,
        time_spent: timeSpent,
        passing_marks: exam.passing_marks,
        question_results: questionResults
      },
      message: 'Exam submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting exam:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    });
  }
}