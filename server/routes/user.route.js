// Import the Express framework for building web applications
const express = require("express");

// Import the verifyAccess middleware for user authentication
const verifyAccess = require("../middleware/auth.middleware");

// Import various user-related actions from the user.actions module
const {
    getUserData,
    followUser,
    unfollowUser,
    updateUser,
    getAllTweets,
    uploadProfilePic,
} = require("../actions/user.actions");

// Create an Express Router to handle user-related routes
const router = express.Router();

// Define routes for getting user data, following a user, unfollowing a user,
// updating user information, and getting all tweets for a specific user
router.get("/:id", verifyAccess, getUserData);
router.post("/:id/follow", verifyAccess, followUser);
router.post("/:id/unfollow", verifyAccess, unfollowUser);
router.put("/:id", verifyAccess, updateUser);
router.get("/:id/tweets", verifyAccess, getAllTweets);
router.post("/:id/uploadProfilePic", verifyAccess, uploadProfilePic);

// Export the router to make it available for use in other files
module.exports = router;
