// app/api/exams/route.js
import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const examData = JSON.parse(formData.get('examData'));

    // Handle main exam image upload
    let photoURL = null;
    const examImage = formData.get('examImage');
    if (examImage) {
      const uploadsDir = path.join(process.cwd(), 'public/uploads/exams');
      await mkdir(uploadsDir, { recursive: true });
      
      const timestamp = Date.now();
      const filename = `exam_${timestamp}${path.extname(examImage.name)}`;
      const filePath = path.join(uploadsDir, filename);
      
      const bytes = await examImage.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);
      
      photoURL = `/uploads/exams/${filename}`;
    }

    // Handle question images upload
    const questionsWithImages = await Promise.all(
      examData.questions.map(async (question, index) => {
        const questionImage = formData.get(`questionImage_${index}`);
        let questionImageURL = null;

        if (questionImage) {
          const uploadsDir = path.join(process.cwd(), 'public/uploads/questions');
          await mkdir(uploadsDir, { recursive: true });
          
          const timestamp = Date.now();
          const filename = `question_${timestamp}_${index}${path.extname(questionImage.name)}`;
          const filePath = path.join(uploadsDir, filename);
          
          const bytes = await questionImage.arrayBuffer();
          const buffer = Buffer.from(bytes);
          await writeFile(filePath, buffer);
          
          questionImageURL = `/uploads/questions/${filename}`;
        }

        return {
          ...question,
          questionImage: questionImageURL
        };
      })
    );

    const examCollection = await dbConnect(collectionNameObj.examCollection);

    const result = await examCollection.insertOne({
      ...examData,
      photoURL,
      questions: questionsWithImages,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Exam created successfully!",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating exam:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create exam" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const examCollection = await dbConnect(collectionNameObj.examCollection);
    const exams = await examCollection.find({}).toArray();

    return NextResponse.json({
      success: true,
      exams,
    });
  } catch (error) {
    console.error("Error fetching exams:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch exams" },
      { status: 500 }
    );
  }
}