//src/lib/dbConnect.js
import { MongoClient, ServerApiVersion } from "mongodb";

export const collectionNameObj = {
  userCollection: "users",
  coursesCollection: "courses",
  examMcqCollection: "examsMcq",
  examResultsCollection: "examResults", // Add this line
  videoCollection: "videos",
  postsCollection: "posts",
  paymentCollection: "payments",
  submissionCollection: "assignmentSubmit",
};

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

if (!uri) {
  throw new Error("❌ Please define MONGODB_URI in .env.local");
}
if (!dbName) {
  throw new Error("❌ Please define DB_NAME in .env.local");
}

let client;
let clientPromise;

// ✅ Development Mode (Hot Reload Safe)
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
}
// ✅ Production Mode
else {
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  clientPromise = client.connect();
}

// ✅ Main DB Connector
export default async function dbConnect(collectionName) {
  const connectedClient = await clientPromise; // ✅ FIX
  const db = connectedClient.db(dbName);       // ✅ FIX
  return db.collection(collectionName);
}
