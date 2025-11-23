import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';

export async function GET(req, { params }) {
  try {
    const examCollection = await dbConnect(collectionNameObj.examCollection);
    const examId = params.id;

    // Find exam by _id
    const exam = await examCollection.findOne({ _id: new ObjectId(examId) });

    if (!exam) {
      return NextResponse.json({ success: false, message: "Exam not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, exam });
  } catch (error) {
    console.error("Error fetching exam:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch exam" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const examId = params.id;
    const formData = await req.formData();
    const examData = JSON.parse(formData.get('examData'));

    const examCollection = await dbConnect(collectionNameObj.examCollection);

    // Find existing exam
    const existingExam = await examCollection.findOne({ _id: new ObjectId(examId) });
    if (!existingExam) {
      return NextResponse.json({ success: false, message: "Exam not found" }, { status: 404 });
    }

    // Handle main exam image upload/update
    let photoURL = existingExam.photoURL;
    const examImage = formData.get('examImage');
    if (examImage) {
      // Delete old image if exists
      if (existingExam.photoURL) {
        try {
          const oldImagePath = path.join(process.cwd(), 'public', existingExam.photoURL);
          await unlink(oldImagePath);
        } catch (error) {
          console.error("Error deleting old exam image:", error);
        }
      }

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

    // Handle question images upload/update
    const questionsWithImages = await Promise.all(
      examData.questions.map(async (question, index) => {
        const questionImage = formData.get(`questionImage_${index}`);
        let questionImageURL = question.questionImage || existingExam.questions[index]?.questionImage;

        if (questionImage) {
          // Delete old question image if exists
          if (existingExam.questions[index]?.questionImage) {
            try {
              const oldImagePath = path.join(process.cwd(), 'public', existingExam.questions[index].questionImage);
              await unlink(oldImagePath);
            } catch (error) {
              console.error("Error deleting old question image:", error);
            }
          }

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

    const result = await examCollection.updateOne(
      { _id: new ObjectId(examId) },
      {
        $set: {
          ...examData,
          photoURL,
          questions: questionsWithImages,
          updatedAt: new Date(),
        }
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ success: false, message: "Failed to update exam" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Exam updated successfully!",
    });
  } catch (error) {
    console.error("Error updating exam:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update exam" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const examId = params.id;
    const examCollection = await dbConnect(collectionNameObj.examCollection);

    // Find exam first to delete associated images
    const exam = await examCollection.findOne({ _id: new ObjectId(examId) });
    if (!exam) {
      return NextResponse.json({ success: false, message: "Exam not found" }, { status: 404 });
    }

    // Delete exam image if exists
    if (exam.photoURL) {
      try {
        const imagePath = path.join(process.cwd(), 'public', exam.photoURL);
        await unlink(imagePath);
      } catch (error) {
        console.error("Error deleting exam image:", error);
      }
    }

    // Delete question images if exist
    if (exam.questions) {
      for (const question of exam.questions) {
        if (question.questionImage) {
          try {
            const imagePath = path.join(process.cwd(), 'public', question.questionImage);
            await unlink(imagePath);
          } catch (error) {
            console.error("Error deleting question image:", error);
          }
        }
      }
    }

    const result = await examCollection.deleteOne({ _id: new ObjectId(examId) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Failed to delete exam" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Exam deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting exam:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete exam" },
      { status: 500 }
    );
  }
}