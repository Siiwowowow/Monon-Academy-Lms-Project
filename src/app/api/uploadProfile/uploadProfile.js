import nextConnect from "next-connect";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary config
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

// Multer memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Next Connect API
const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(500).json({ error: `Something went wrong: ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  },
});

// Use multer middleware
apiRoute.use(upload.single("profilePicture"));

apiRoute.post(async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload buffer to Cloudinary
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "user_profiles", resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(fileBuffer);
      });
    };

    const result = await streamUpload(file.buffer);

    return res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to upload image" });
  }
});

// Important for multer
export const config = {
  api: { bodyParser: false },
};

export default apiRoute;
