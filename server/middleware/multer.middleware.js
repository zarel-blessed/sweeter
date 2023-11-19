/**
 * @format
 * @module multerConfig
 * @description Configuration module for handling file uploads using Multer middleware. It defines storage settings, file filtering, and size limits for uploaded files.
 */

const multer = require("multer");
const path = require("path");

// Resolve the top-level directory path
const topLevelDirectory = path.resolve(__dirname, "..");

// Define the storage path for uploaded files
const storagePath = path.join(topLevelDirectory, "storage");

// Configure Multer storage settings
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // Set the storage destination to the specified storage path
    callback(null, storagePath);
  },
  filename: (req, file, callback) => {
    // Generate a unique filename for the uploaded file by appending the current timestamp and the original file extension
    callback(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Define a file filter function to allow only specific image file types
const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    // Accept the file if it matches the allowed image types
    callback(null, true);
  } else {
    // Reject the file and return an error for invalid file types
    callback(new Error("Invalid file type"), false);
  }
};

// Configure Multer with defined storage, file filter, and size limits
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB limit for uploaded files
  },
});

// Create a Multer middleware for handling single file uploads with the field name "file"
const uploadMulterFile = upload.single("file");

// Export relevant configuration and middleware for use in other parts of the application
module.exports = { storagePath, uploadMulterFile };
