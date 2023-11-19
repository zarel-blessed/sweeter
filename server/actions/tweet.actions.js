/** @format */

const Tweet = require("../models/tweet.model");

/**
 * @function uploadTweet
 * @description Controller function for handling the upload of a new tweet.
 * @param {Object} req - Express request object containing the HTTP request information.
 * @param {Object} res - Express response object for sending HTTP responses.
 */
const uploadTweet = async (req, res) => {
  // Extract content and image from the request body
  const { content, image } = req.body;

  // Check if the content of the tweet is empty
  if (!content || content === "") {
    return res.status(400).json({ message: "Tweet content is empty!" });
  }

  try {
    // Check if an image is provided with the tweet
    if (!image || image === "") {
      // Create a new tweet without an image
      const newTweet = new Tweet({
        content,
        tweetedBy: req._id, // Associate the tweet with the user ID from the request
      });

      // Save the new tweet to the database
      await newTweet.save();

      // Return success response with the newly created tweet
      res.json({ message: "Tweet uploaded successfully!", newTweet });
    } else {
      // Create a new tweet with both content and image
      const newTweet = new Tweet({
        content,
        image,
        tweetedBy: req._id, // Associate the tweet with the user ID from the request
      });

      // Save the new tweet to the database
      await newTweet.save();

      // Return success response with the newly created tweet
      res.json({ message: "Tweet uploaded successfully!", newTweet });
    }
  } catch (error) {
    // Handle errors and return an internal server error message
    res.status(500).json({ message: "Internal server error!" });
  }
};

/**
 * @function likeTweet
 * @description Controller function for allowing a user to like a tweet.
 * @param {Object} req - Express request object containing the HTTP request information.
 *                       Expects `req.params.id` for the Tweet ID and `req._id` for the User ID.
 * @param {Object} res - Express response object for sending HTTP responses.
 */
const likeTweet = async (req, res) => {
  // Extract the Tweet ID from the request parameters
  const { id } = req.params;

  try {
    // Check if a valid Tweet ID is provided
    if (!id) {
      return res.status(400).json({ message: "Invalid tweet ID!" });
    }

    // Find the tweet by its ID
    const tweet = await Tweet.findById(id);

    // Check if the tweet exists
    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found!" });
    }

    // Check if the User ID is provided in the request
    if (!req._id) {
      return res.status(401).json({ message: "Unauthorized: User ID not provided!" });
    }

    // Check if the user has already liked the tweet
    const alreadyLiked = tweet.likes.includes(req._id);

    // Return a response if the user has already liked the tweet
    if (alreadyLiked) {
      return res.status(400).json({
        message: "User has already liked this post!",
        alreadyLiked,
      });
    }

    // Add the User ID to the likes array and save the tweet
    tweet.likes.push(req._id);
    await tweet.save();

    // Return success response
    res.status(200).json({ message: "Tweet updated successfully!" });
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);

    // Handle specific error cases, such as invalid Tweet ID format
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({
        message: "Invalid tweet ID format!",
      });
    }

    // Return an internal server error message for other error cases
    res.status(500).json({ message: "Internal server error!" });
  }
};

/**
 * @function dislikeTweet
 * @description Controller function for allowing a user to dislike a previously liked tweet.
 * @param {Object} req - Express request object containing the HTTP request information.
 *                       Expects `req.params.id` for the Tweet ID and `req._id` for the User ID.
 * @param {Object} res - Express response object for sending HTTP responses.
 */
const dislikeTweet = async (req, res) => {
  // Extract the Tweet ID from the request parameters
  const { id } = req.params;

  try {
    // Find the tweet by its ID
    const tweet = await Tweet.findById(id);

    // Check if the tweet exists
    if (!tweet) {
      return res.status(400).json({ message: "Tweet not found!" });
    }

    // Check if the user has previously liked the tweet
    const alreadyLiked = tweet.likes.includes(req._id);

    // Return a response if the user has not liked the tweet
    if (!alreadyLiked) {
      return res.status(400).json({
        message: "User has not liked this post!",
        alreadyLiked: -1,
      });
    }

    // Use $pull to remove the User ID from the likes array and update the tweet
    await Tweet.updateOne(
      { _id: id },
      {
        $pull: { likes: req._id },
      }
    );

    // Return success response
    res.json({ message: "Tweet updated successfully!" });
  } catch (error) {
    // Handle specific error cases, such as invalid Tweet ID format
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({
        message: "Invalid tweet ID format!",
      });
    }

    // Return an internal server error message for other error cases
    res.status(500).json({ message: "Internal server error!" });
  }
};

/**
 * @function replyOnTweet
 * @description Controller function for allowing a user to reply to a tweet.
 * @param {Object} req - Express request object containing the HTTP request information.
 *                       Expects `req.params.id` for the Tweet ID, `req.body.content` for the reply content,
 *                       and `req._id` for the User ID.
 * @param {Object} res - Express response object for sending HTTP responses.
 */
const replyOnTweet = async (req, res) => {
  // Extract the Tweet ID and reply content from the request parameters and body
  const { id } = req.params;
  const { content } = req.body;

  // Check if the reply content is empty
  if (!content || content === "") {
    return res.status(400).json({ message: "Tweet content can't be empty!" });
  }

  try {
    // Create a new reply tweet with the provided content, associated parent ID, and user ID
    const newReplyTweet = await new Tweet({
      parentId: id,
      content,
      tweetedBy: req._id, // Associate the reply with the user ID from the request
    });

    // Save the new reply tweet to the database
    await newReplyTweet.save();

    // Update the parent tweet by pushing the ID of the new reply to the replies array
    await Tweet.findByIdAndUpdate(id, {
      $push: { replies: newReplyTweet._id },
    });

    // Return success response
    res.json({ message: "New reply added!" });
  } catch (error) {
    // Handle specific error cases, such as invalid Tweet ID format
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({
        message: "Invalid tweet ID format!",
      });
    }

    // Return an internal server error message for other error cases
    res.status(500).json({ message: "Internal server error!" });
  }
};

/**
 * @function getTweetDetails
 * @description Controller function for retrieving detailed information about a specific tweet.
 * @param {Object} req - Express request object containing the HTTP request information.
 *                       Expects `req.params.id` for the Tweet ID.
 * @param {Object} res - Express response object for sending HTTP responses.
 */
const getTweetDetails = async (req, res) => {
  // Extract the Tweet ID from the request parameters
  const { id } = req.params;

  try {
    // Find the tweet by its ID and populate related data for detailed information
    const tweet = await Tweet.findById(id)
      ?.populate({
        path: "tweetedBy",
        select: "-password", // Exclude password field from the user details
      })
      ?.populate({
        path: "replies",
        populate: {
          path: "tweetedBy",
          select: "-password", // Exclude password field from the user details
          model: "User",
        },
      })
      ?.populate({
        path: "likes",
        select: "-password", // Exclude password field from the user details
      })
      ?.populate({
        path: "retweetBy",
        select: "-password", // Exclude password field from the user details
      })
      .exec();

    // Check if the tweet exists
    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found!" });
    }

    // Return detailed information about the tweet in the response
    res.json({ tweet });
  } catch (error) {
    // Handle specific error cases, such as invalid Tweet ID format
    if (error.name === "CastError" && error.type === "ObjectId") {
      res.status(400).json({ message: "Invalid tweet ID format!" });
    }

    // Return an internal server error message for other error cases
    res.status(500).json({ message: "Internal server error!" });
  }
};

/**
 * @function getAllTweets
 * @description Controller function for retrieving all tweets with detailed information.
 * @param {Object} req - Express request object containing the HTTP request information.
 * @param {Object} res - Express response object for sending HTTP responses.
 */
const getAllTweets = async (req, res) => {
  try {
    // Find all tweets, sort them by creation time in descending order,
    // and populate user, reply, like, and retweet details for a comprehensive response
    const tweets = await Tweet.find()
      ?.sort({ createdAt: "desc" })
      ?.populate({
        path: "tweetedBy",
        select: "-password", // Exclude password field from the user details
      })
      ?.populate({
        path: "replies",
        populate: {
          path: "tweetedBy",
          select: "-password", // Exclude password field from the user details
          model: "User",
        },
      })
      ?.populate({
        path: "likes",
        select: "-password", // Exclude password field from the user details
      })
      ?.populate({
        path: "retweetBy",
        select: "-password", // Exclude password field from the user details
      });

    // Return an array of tweets in the response
    res.json({ tweets });
  } catch (error) {
    // Handle specific error cases, such as invalid Tweet ID format
    if (error.name === "CastError" && error.type === "ObjectId") {
      res.status(400).json({ message: "Invalid tweet ID format!" });
    }

    // Return an internal server error message for other error cases
    res.status(500).json({ message: "Internal server error!" });
  }
};

/**
 * @function deleteTweet
 * @description Controller function for deleting a tweet.
 * @param {Object} req - Express request object containing the HTTP request information.
 *                       Expects `req.params.id` for the Tweet ID and `req._id` for the User ID.
 * @param {Object} res - Express response object for sending HTTP responses.
 */
const deleteTweet = async (req, res) => {
  // Extract the Tweet ID from the request parameters
  const { id } = req.params;

  try {
    // Find the tweet by its ID
    const tweet = await Tweet.findById(id);

    // Check if the user is authenticated to delete the post
    const isUserAuthenticated = tweet.tweetedBy._id.toString() === req._id.toString();

    // Return an unauthorized response if the user is not authenticated
    if (!isUserAuthenticated)
      return res.status(401).json({
        message: "User is not authenticated to delete this post",
      });

    // Delete the tweet and return success response
    await Tweet.findByIdAndDelete(id);
    res.json({ message: "Tweet deleted successfully!" });
  } catch (error) {
    // Handle specific error cases, such as invalid Tweet ID format
    if (error.name === "CastError" && error.type === "ObjectId") {
      res.status(400).json({ message: "Invalid tweet ID format!" });
    }

    // Return an internal server error message for other error cases
    res.status(500).json({ message: "Internal server error!" });
  }
};

/**
 * @function retweetTweet
 * @description Controller function for allowing a user to retweet a tweet.
 * @param {Object} req - Express request object containing the HTTP request information.
 *                       Expects `req.params.id` for the Tweet ID and `req._id` for the User ID.
 * @param {Object} res - Express response object for sending HTTP responses.
 */
const retweetTweet = async (req, res) => {
  // Extract the Tweet ID from the request parameters
  const { id } = req.params;

  try {
    // Find the tweet by its ID
    const tweet = await Tweet.findById(id);

    // Check if the user has already retweeted the tweet
    if (tweet.retweetBy.includes(req._id))
      res.status(409).json({
        message: "User has already reposted this tweet!",
      });

    // Add the User ID to the retweetBy array and save the tweet
    tweet.retweetBy.push(req._id);
    await tweet.save();

    // Return success response
    res.json({ message: "Tweet retweeted successfully!" });
  } catch (error) {
    // Handle specific error cases, such as invalid Tweet ID format
    if (error.name === "CastError" && error.type === "ObjectId") {
      res.status(400).json({ message: "Invalid tweet ID format!" });
    }

    // Return an internal server error message for other error cases
    res.status(500).json({ message: "Internal server error!" });
  }
};

// Export all controller functions for use in other files
module.exports = {
  uploadTweet,
  likeTweet,
  dislikeTweet,
  replyOnTweet,
  getTweetDetails,
  getAllTweets,
  deleteTweet,
  retweetTweet,
};
