// Import the Express framework for building web applications
const express = require("express");

// Import specific functions for user authentication actions
const { signupUser, loginUser } = require("../actions/auth.actions.js");

// Create an Express Router to handle authentication routes
const router = express.Router();

// Define a route for user registration (signup) and associate it with the signupUser function
router.post("/register", signupUser);

// Define a route for user login and associate it with the loginUser function
router.post("/login", loginUser);

// Export the router to make it available for use in other files
module.exports = router;
