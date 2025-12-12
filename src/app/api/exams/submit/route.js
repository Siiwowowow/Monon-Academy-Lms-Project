// app/api/exams/submit/route.js
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import dbConnect, { collectionNameObj } from '@/lib/dbConnect';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.examId || !body.studentId || !body.answers) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: examId, studentId, answers' },
        { status: 400 }
      );
    }

    // Connect to collections
    const examResultsCollection = await dbConnect('examResults');
    const examsCollection = await dbConnect(collectionNameObj.examMcqCollection);
    
    // Get exam data to validate and calculate results
    const exam = await examsCollection.findOne({ 
      _id: new ObjectId(body.examId) 
    });

    if (!exam) {
      return NextResponse.json(
        { success: false, message: 'Exam not found' },
        { status: 404 }
      );
    }

    // Check if student has already submitted this exam
    const existingResult = await examResultsCollection.findOne({
      examId: new ObjectId(body.examId),
      studentId: body.studentId
    });

    if (existingResult) {
      return NextResponse.json(
        { success: false, message: 'You have already submitted this exam' },
        { status: 400 }
      );
    }

    // Calculate detailed results
    let totalMarks = 0;
    let obtainedMarks = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    const detailedAnswers = [];

    exam.questions.forEach((question, index) => {
      const userAnswer = body.answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      const questionMarks = parseInt(question.marks) || 1;
      
      totalMarks += questionMarks;
      
      if (isCorrect) {
        obtainedMarks += questionMarks;
        correctAnswers++;
      } else if (userAnswer !== null) {
        wrongAnswers++;
      }

      detailedAnswers.push({
        questionIndex: index,
        questionId: question.id || `q${index + 1}`,
        selectedOption: userAnswer !== null ? userAnswer : null,
        correctAnswer: question.correctAnswer,
        isCorrect: isCorrect,
        marksObtained: isCorrect ? questionMarks : 0,
        timeSpent: body.questionTime?.[index] || 0
      });
    });

    const percentage = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0;
    const passingMarks = parseInt(exam.passingMarks) || Math.ceil(totalMarks * 0.6); // Default 60%
    const passed = obtainedMarks >= passingMarks;

    // Calculate category-wise performance
    const categoryWise = {};
    exam.questions.forEach((question, index) => {
      const category = question.category || 'General';
      if (!categoryWise[category]) {
        categoryWise[category] = { total: 0, correct: 0 };
      }
      categoryWise[category].total++;
      if (detailedAnswers[index].isCorrect) {
        categoryWise[category].correct++;
      }
    });

    // Calculate difficulty breakdown
    const difficultyBreakdown = {
      easy: { correct: 0, total: 0 },
      medium: { correct: 0, total: 0 },
      hard: { correct: 0, total: 0 }
    };

    exam.questions.forEach((question, index) => {
      const difficulty = question.difficulty || 'medium';
      const key = difficulty.toLowerCase();
      if (difficultyBreakdown[key]) {
        difficultyBreakdown[key].total++;
        if (detailedAnswers[index].isCorrect) {
          difficultyBreakdown[key].correct++;
        }
      }
    });

    // Create result document
    const resultDoc = {
      examId: new ObjectId(body.examId),
      studentId: body.studentId,
      studentName: body.studentName || 'Student',
      examTitle: exam.examTitle,
      subject: exam.subject,
      obtainedMarks: obtainedMarks,
      totalMarks: totalMarks,
      percentage: percentage,
      passed: passed,
      passingMarks: passingMarks,
      answers: detailedAnswers,
      correctAnswers: correctAnswers,
      wrongAnswers: wrongAnswers,
      unanswered: exam.questions.length - (correctAnswers + wrongAnswers),
      timeTaken: body.timeSpent || 0, // in minutes
      submittedAt: new Date(),
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      deviceInfo: request.headers.get('user-agent') || 'unknown',
      // Analytics data
      categoryWiseScore: categoryWise,
      difficultyBreakdown: difficultyBreakdown,
      // Additional metadata
      examDuration: parseInt(exam.duration) || 60,
      totalQuestions: exam.questions.length,
      createdAt: new Date()
    };

    // Save to database
    const result = await examResultsCollection.insertOne(resultDoc);

    // Update exam statistics
    await updateExamStatistics(exam._id, obtainedMarks, totalMarks, passed);

    // Prepare response with detailed results
    const responseData = {
      success: true,
      message: 'Exam submitted successfully',
      resultId: result.insertedId,
      result: {
        _id: result.insertedId,
        ...resultDoc,
        // Format for frontend
        questionResults: exam.questions.map((question, index) => ({
          questionIndex: index,
          questionText: question.questionText,
          options: question.options,
          correctAnswer: question.correctAnswer,
          userAnswer: detailedAnswers[index].selectedOption,
          isCorrect: detailedAnswers[index].isCorrect,
          marks: parseInt(question.marks) || 1,
          marksObtained: detailedAnswers[index].marksObtained,
          category: question.category || 'General',
          difficulty: question.difficulty || 'Medium'
        }))
      }
    };

    return NextResponse.json(responseData, { status: 201 });

  } catch (error) {
    console.error('Error submitting exam:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Server error', 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Helper function to update exam statistics
async function updateExamStatistics(examId, obtainedMarks, totalMarks, passed) {
  try {
    const examsCollection = await dbConnect(collectionNameObj.examMcqCollection);
    const examResultsCollection = await dbConnect('examResults');

    // Get all results for this exam
    const allResults = await examResultsCollection.find({ 
      examId: examId 
    }).toArray();

    const totalAttempts = allResults.length;
    const totalScore = allResults.reduce((sum, result) => sum + result.percentage, 0);
    const averageScore = totalAttempts > 0 ? Math.round(totalScore / totalAttempts) : 0;
    const passCount = allResults.filter(result => result.passed).length;
    const passRate = totalAttempts > 0 ? Math.round((passCount / totalAttempts) * 100) : 0;

    // Update exam with new statistics
    await examsCollection.updateOne(
      { _id: examId },
      {
        $set: {
          attempts: totalAttempts,
          averageScore: averageScore,
          passRate: passRate,
          updatedAt: new Date()
        }
      }
    );

  } catch (error) {
    console.error('Error updating exam statistics:', error);
    // Don't fail the main request if statistics update fails
  }
}

// GET endpoint to fetch results for a student
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const examId = searchParams.get('examId');
    const studentId = searchParams.get('studentId');

    if (!examId || !studentId) {
      return NextResponse.json(
        { success: false, message: 'Missing examId or studentId' },
        { status: 400 }
      );
    }

    const examResultsCollection = await dbConnect('examResults');
    
    const result = await examResultsCollection.findOne({
      examId: new ObjectId(examId),
      studentId: studentId
    });

    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Result not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      result: result
    });

  } catch (error) {
    console.error('Error fetching result:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}