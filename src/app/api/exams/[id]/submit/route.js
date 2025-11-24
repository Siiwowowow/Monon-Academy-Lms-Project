import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import dbConnect, { collectionNameObj } from '@/lib/dbConnect';

export async function POST(request, { params }) {
  try {
    // params কে await করুন
    const { id } = await params;
    const { studentId, answers, timeSpent } = await request.json();

    console.log('📝 Submit Data:', { studentId, answers, timeSpent });

    if (!studentId || !answers) {
      return NextResponse.json({ 
        success: false, 
        error: 'Student ID and answers are required' 
      }, { status: 400 });
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
      }, { status: 400 });
    }
    
    if (!exam) {
      return NextResponse.json({ 
        success: false, 
        error: 'Exam not found' 
      }, { status: 404 });
    }

    // রেজাল্ট ক্যালকুলেট করুন - FIXED LOGIC
    let obtainedMarks = 0;
    let correctAnswers = 0;
    let totalQuestions = exam.questions.length;

    const questionResults = exam.questions.map((question, index) => {
      const studentAnswer = answers[index];
      
      // Find the correct option object
      const correctOption = question.options.find(opt => opt.id === question.correct_answer);
      const studentSelectedOption = question.options.find(opt => opt.id === studentAnswer);
      
      const isCorrect = studentAnswer === question.correct_answer;
      
      if (isCorrect) {
        obtainedMarks += question.marks || 1;
        correctAnswers++;
      }

      return {
        question_text: question.question_text,
        options: question.options,
        student_answer: studentAnswer,
        student_answer_text: studentSelectedOption?.text || 'Not answered',
        correct_answer: question.correct_answer,
        correct_answer_text: correctOption?.text || 'Not set',
        is_correct: isCorrect,
        marks: question.marks || 1,
        obtained_marks: isCorrect ? (question.marks || 1) : 0
      };
    });

    // পাস/ফেল ডিটারমাইন করুন
    const totalMarks = exam.questions.reduce((sum, q) => sum + (q.marks || 1), 0);
    const percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;
    const isPassed = obtainedMarks >= exam.passing_marks;

    // রেজাল্ট সেভ করুন
    const examResult = {
      exam_id: id,
      student_id: studentId,
      course_id: exam.course_id,
      lesson_id: exam.lesson_id,
      obtained_marks: obtainedMarks,
      total_marks: totalMarks,
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
        total_marks: totalMarks,
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
    }, { status: 500 });
  }
}