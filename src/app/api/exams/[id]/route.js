import dbConnect, { collectionNameObj } from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const collection = await dbConnect(collectionNameObj.examCollection);
    const exam = await collection.findOne({ _id: new ObjectId(id) });

    if (!exam) {
      return new Response(
        JSON.stringify({ success: false, message: 'Exam not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ success: true, data: exam }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
