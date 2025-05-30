import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "telemedicine_chat_files",
    resource_type: "auto", // support image, video, pdf, etc.
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json({
      url: req.file.path,
      public_id: req.file.filename,
    });
  } catch (err) {
    res.status(500).json({ error: "Upload failed", message: err.message });
  }
});

export default router;
