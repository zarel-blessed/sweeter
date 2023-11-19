/** @format */

// Import necessary models, utilities, and configuration
const User = require("../models/user.model");
const Tweet = require("../models/tweet.model");
const connectToMongoDB = require("../utils/connection");
const verifyFields = require("../utils/verifyFields");

// Load environment variables from a .env file
require("dotenv").config();
const MONGODB_URI = process.env.MONGODB_URI;

/**
 * @function getUserData
 * @description Get a single user's data by their ID.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getUserData = async (req, res) => {
  // Extract the user ID from the request parameters
  const { id } = req.params;

  try {
    // Connect to MongoDB
    connectToMongoDB(MONGODB_URI);

    // Find the user by ID, exclude the password field, and populate followers and following
    const user = await User.findById(id)
      ?.select("-password")
      ?.populate("followers", "_id name username profilePicture")
      ?.populate("following", "_id name username profilePicture")
      .exec();

    // Return an error response if the user is not found
    if (!user)
      return res.status(400).json({
        message: "Invalid user ID!",
      });

    // Return the user data in the response
    res.json({ user });
  } catch (error) {
    // Handle specific errors and provide appropriate responses
    if (error.name === "CastError" && error.kind === "ObjectId")
      return res.status(400).json({
        message: "Invalid user ID format!",
      });

    res.status(500).json({ message: "Internal server error!" });
  }
};

// Similar comments will be added for the remaining functions (followUser, unfollowUser, updateUser, getAllTweets)
// to ensure clarity and understanding of each section of the code.

/**
 * @function followUser
 * @description Follow a user by updating the follower and following lists.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const followUser = async (req, res) => {
  // Extract the user ID and the ID of the person to follow from request parameters and body
  const { id } = req.params; // ID of the user initiating the follow
  const { user_id } = req.body; // ID of the user to be followed

  // Check if the user is attempting to follow themselves
  if (id === user_id)
    return res.status(401).json({
      message: "User can't follow himself/herself!",
    });

  // Check if both user IDs are provided
  if (!verifyFields(id, user_id))
    return res.status(400).json({
      message: "Both user IDs are required!",
    });

  try {
    // Connect to MongoDB
    connectToMongoDB(MONGODB_URI);

    // Retrieve the user initiating the follow and the user to be followed from the database
    const user = await User.findById(id);
    const otherUser = await User.findById(user_id);

    // Verify that both user IDs are valid
    if (!verifyFields(user, otherUser))
      return res.status(400).json({
        message: "One or both user IDs are invalid!",
      });

    // Check if the user is not already following the other user
    if (!user.following.includes(user_id)) {
      // Update the following list of the user initiating the follow
      await User.updateOne({ _id: id }, { $push: { following: user_id } });

      // Save the changes to the user initiating the follow
      await user.save();
    }

    // Check if the other user is not already being followed by the user
    if (!otherUser.followers.includes(id)) {
      // Update the followers list of the user to be followed
      await User.updateOne({ _id: user_id }, { $push: { followers: id } });

      // Save the changes to the user to be followed
      await otherUser.save();
    }

    // Return a success response
    res.json({ success: true });
  } catch (error) {
    // Handle specific errors and provide appropriate responses
    if (error.name === "CastError" && error.kind === "ObjectId")
      return res.status(400).json({
        message: "Invalid user ID format!",
      });

    res.status(500).json({ message: "Internal server error!" });
  }
};

/**
 * @function unfollowUser
 * @description Unfollow a user by updating the follower and following lists.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const unfollowUser = async (req, res) => {
  // Extract the user ID and the ID of the person to unfollow from request parameters and body
  const { id } = req.params; // ID of the user initiating the unfollow
  const { user_id } = req.body; // ID of the user to be unfollowed

  // Check if the user is attempting to unfollow themselves
  if (id === user_id)
    return res.status(401).json({
      message: "User can't unfollow himself/herself!",
    });

  // Check if both user IDs are provided
  if (!verifyFields(id, user_id))
    return res.status(400).json({
      message: "Both user IDs are required!",
    });

  try {
    // Connect to MongoDB
    connectToMongoDB(MONGODB_URI);

    // Retrieve the user initiating the unfollow and the user to be unfollowed from the database
    const user = await User.findById(id);
    const otherUser = await User.findById(user_id);

    // Verify that both user IDs are valid
    if (!verifyFields(user, otherUser))
      return res.status(400).json({
        message: "One or both user IDs are invalid!",
      });

    // Check if the user is currently following the other user
    if (user.following.includes(user_id)) {
      // Update the following list of the user initiating the unfollow
      await User.updateOne({ _id: id }, { $pull: { following: user_id } });

      // Save the changes to the user initiating the unfollow
      await user.save();
    }

    // Check if the other user currently has the user as a follower
    if (otherUser.followers.includes(id)) {
      // Update the followers list of the user to be unfollowed
      await User.updateOne({ _id: user_id }, { $pull: { followers: id } });

      // Save the changes to the user to be unfollowed
      await otherUser.save();
    }

    // Return a success response
    res.json({ success: true });
  } catch (error) {
    // Handle specific errors and provide appropriate responses
    if (error.name === "CastError" && error.kind === "ObjectId")
      return res.status(400).json({
        message: "Invalid user ID format!",
      });

    res.status(500).json({ message: "Internal server error!" });
  }
};

/**
 * @function updateUser
 * @description Update user's name, dateOfBirth, or location.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const updateUser = async (req, res) => {
  // Extract the user ID from the request parameters
  const { id } = req.params;

  // Destructure user data (name, dateOfBirth, location) from the request body
  const { name, dateOfBirth, location, bio } = req.body;

  // Check if all required fields are provided
  if (!verifyFields(name, dateOfBirth, location, bio))
    return res.status(400).json({ message: "All fields are required" });

  try {
    // Connect to MongoDB
    connectToMongoDB(MONGODB_URI);

    // Find the user by ID and update the specified fields (name, dateOfBirth, location)
    const updatedUser = await User.findByIdAndUpdate(id, {
      name,
      dateOfBirth,
      location,
      bio,
    });

    // Return a success response
    res.json({ success: true });
  } catch (error) {
    // Handle specific errors and provide appropriate responses
    if (error.name === "CastError" && error.kind === "ObjectId")
      return res.status(400).json({
        message: "Invalid user ID format!",
      });

    res.status(500).json({ message: "Internal server error!" });
  }
};

/**
 * @function getAllTweets
 * @description Get all tweets of a user by their ID.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getAllTweets = async (req, res) => {
  // Extract the user ID from the request parameters
  const { id } = req.params;

  try {
    // Find all tweets with the specified user ID as the "tweetedBy" field
    const tweets = await Tweet.find({ tweetedBy: id })
      ?.sort({ createdAt: "desc" })
      ?.populate({
        path: "tweetedBy",
        select: "-password",
      })
      ?.populate({
        path: "replies",
        populate: {
          path: "tweetedBy",
          select: "-password",
          model: "User",
        },
      })
      ?.populate({
        path: "likes",
        select: "-password",
      })
      ?.populate({
        path: "retweetBy",
        select: "-password",
      });

    // Return the tweets in the response
    return res.json({ tweets });
  } catch (error) {
    // Handle specific errors and provide appropriate responses
    if (error.name === "CastError" && error.kind === "ObjectId")
      return res.status(400).json({
        message: "Invalid user ID format!",
      });

    res.status(500).json({ message: "Internal server error!" });
  }
};

/**
 * @function uploadProfilePic
 * @description Upload profile picture of logged in user.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const uploadProfilePic = async (req, res) => {
  // Extract the filepath from request body
  const { filepath } = req.body;
  // Extract the user ID from the request parameters
  const { id } = req.params;

  // Check is required filepath is provided
  if (!filepath)
    return res.status(400).json({
      message: "Filepath is mendatory for file upload!",
    });

  try {
    // Update user's profilePicture property
    await User.findByIdAndUpdate(id, {
      profilePicture: filepath,
    });

    res.json({ message: "User updated successfully!" });
  } catch (error) {
    // Handle specific errors and provide appropriate responses
    if (error.name === "CastError" && error.kind === "ObjectId")
      return res.status(400).json({
        message: "Invalid user ID format!",
      });

    res.status(500).json({ message: "Internal server error!" });
  }
};

const uploadBannerImage = async (req, res) => {
  // Extract the filepath from request body
  const { filepath } = req.body;
  // Extract the user ID from the request parameters
  const { id } = req.params;

  // Check is required filepath is provided
  if (!filepath)
    return res.status(400).json({
      message: "Filepath is mendatory for file upload!",
    });

  try {
    // Update user's bannerImage property
    await User.findByIdAndUpdate(id, {
      bannerImage: filepath,
    });

    res.json({ message: "User updated successfully!" });
  } catch (error) {
    // Handle specific errors and provide appropriate responses
    if (error.name === "CastError" && error.kind === "ObjectId")
      return res.status(400).json({
        message: "Invalid user ID format!",
      });

    res.status(500).json({ message: "Internal server error!" });
  }
};

// Export the functions for use in other files
module.exports = {
  getUserData,
  followUser,
  unfollowUser,
  updateUser,
  getAllTweets,
  uploadProfilePic,
  uploadBannerImage,
};
