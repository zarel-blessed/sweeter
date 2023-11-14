// Import the Mongoose library for MongoDB interactions
const mongoose = require("mongoose");

// Variable to track the connection status
let isConnected = false;

/**
 * @function connectToMongoDB
 * @description Establish a connection to MongoDB using the provided URL.
 * @param {string} url - The MongoDB connection URL.
 */
const connectToMongoDB = async (url) => {
    try {
        // Check if not already connected
        if (!isConnected) {
            // Attempt to connect to MongoDB
            await mongoose.connect(url);

            // Update connection status and log success
            isConnected = true;
            console.log("Connected to MongoDB");
        } else {
            // Log a message if already connected
            console.log("Already connected to MongoDB");
        }
    } catch (error) {
        // Handle connection errors and log the details
        console.error(`Error while connecting to MongoDB: ${error.message}`);
    }
};

// Export the connectToMongoDB function to make it available for use in other files
module.exports = connectToMongoDB;
