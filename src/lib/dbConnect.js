import { MongoClient, ServerApiVersion } from "mongodb";

export const collectionNameObj = {
    userCollection: "users",
    coursesCollection:"courses",
    postCollection:"posts",
    examCollection:"exams",
    
    
  };
const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

if (!client) {
  client = new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
  });
  clientPromise = client.connect();
}



export default async function dbConnect(collectionName) {
  await clientPromise;
  const db = client.db(dbName);
  return db.collection(collectionName);
}
