const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure temp folder exists
const TEMP_DIR = './public/temp';
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// ---------------- STORAGE ----------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMP_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();

    // safer filename
    const safeName = file.originalname
      .replace(/\\s+/g, '-')
      .replace(/[^a-zA-Z0-9.-]/g, '');

    cb(null, `${file.fieldname}-${uniqueSuffix}-${safeName}${ext}`);
  }
});


// Allowed MIME types
const allowedMimeTypes = [
  // Images
  "image/jpeg",
  "image/png",
  "image/webp",

  // Videos
  "video/mp4",
  "video/webm",
  "video/quicktime",

  // Audio
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",

  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain"
];

// Allowed extensions
const allowedExtensions = [
  ".jpg", ".jpeg", ".png", ".webp",
  ".mp4", ".webm", ".mov",
  ".mp3", ".wav", ".ogg",
  ".pdf", ".doc", ".docx",
  ".xls", ".xlsx",
  ".ppt", ".pptx",
  ".txt"
];

// File filter
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (
    allowedMimeTypes.includes(file.mimetype) &&
    allowedExtensions.includes(ext)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported or unsafe file type"), false);
  }
};

// ---------------- SIZE LIMITS ----------------

// Dynamic size limit based on file type
const GetFileSizeLimit = (mimetype) => {
  if (mimetype.startsWith("image")) return 5 * 1024 * 1024; // 5MB
  if (mimetype.startsWith("video")) return 20 * 1024 * 1024; // 20MB
  if (mimetype.startsWith("audio")) return 10 * 1024 * 1024; // 10MB
  return 10 * 1024 * 1024; // documents
};

// Custom middleware to enforce dynamic size
const DynamicFileSize = (req, res, next) => {
  if (!req.file) return next();

  const maxSize = getFileSizeLimit(req.file.mimetype);

  if (req.file.size > maxSize) {
    return res.status(400).json({
      success: false,
      message: `File too large. Max allowed: ${maxSize / (1024 * 1024)} MB`
    });
  }

  next();
};


const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024 
    }
});


const GetFileCategory = (mimetype) => {
      if (mimetype.startsWith("image")) return "image";
      if (mimetype.startsWith("video")) return "video";
      if (mimetype.startsWith("audio")) return "audio";
      return "document";
};



const CleanupFile = (filePath) => {
	if (filePath && fs.existsSync(filePath)) {
		fs.unlinkSync(filePath);
	}
};

module.exports = {
    upload,
    DynamicFileSize,
    GetFileCategory,
    CleanupFile
};
