const path = require("path");
// Import the Express framework for building web applications
const express = require("express");

// Create an Express application
const app = express();
// Parse incoming JSON data
app.use(express.json());

// Import Cors for allowing access from cross origin
const cors = require("cors");

// Handle the CORS error
app.use(cors());

// Load environment variables from a .env file
const dotenv = require("dotenv");

// Load environment variables from a .env file
dotenv.config();

// Custom utility function to connect to MongoDB
const connectToMongoDB = require("./utils/connection");

// Middleware to serve files from the 'storage' directory
app.use("/storage", express.static(path.join(__dirname, "storage")));

// Endpoint for file upload/download
const uploadFileEndpoint = "/upload-image";
const downloadFileEndpoint = "/download-image/:filename";

// Import route handlers for authentication, user, and tweet endpoints
const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/user.route");
const tweetRouter = require("./routes/tweet.route");

// Define middleware for the specified routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/tweet", tweetRouter);

// Import functions to upload/download image files
const { uploadFile, downloadFile } = require("./utils/multer");

// Define file upload/download API routes
app.post(uploadFileEndpoint, uploadFile);
app.get(downloadFileEndpoint, downloadFile);

// Define the port for the server to listen on, with a fallback to 4020
const PORT = process.env.PORT || 4020;

// Retrieve the MongoDB connection URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB using the custom utility function
connectToMongoDB(MONGODB_URI);

// Start the Express server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
