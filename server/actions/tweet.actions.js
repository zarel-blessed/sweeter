/** @format */

const Tweet = require("../models/tweet.model");

const uploadTweet = async (req, res) => {
  const { content, image } = req.body;

  if (!content || content === "") {
    return res.status(400).json({ messsage: "Tweet content is empty!" });
  }

  try {
    if (!image || image === "") {
      const newTweet = new Tweet({
        content,
        tweetedBy: req._id,
      });

      await newTweet.save();

      res.json({ message: "Tweet uploaded successfully!", newTweet });
    } else {
      const newTweet = new Tweet({
        content,
        image,
        tweetedBy: req._id,
      });

      await newTweet.save();

      res.json({ message: "Tweet uploaded successfully!", newTweet });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
};

const likeTweet = async (req, res) => {
  const { id } = req.params; // Tweet ID

  try {
    if (!id) {
      return res.status(400).json({ message: "Invalid tweet ID!" });
    }

    const tweet = await Tweet.findById(id);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found!" });
    }

    if (!req._id) {
      return res.status(401).json({ message: "Unauthorized: User ID not provided!" });
    }

    const alreadyLiked = tweet.likes.includes(req._id);

    if (alreadyLiked) {
      return res.status(400).json({
        message: "User has already liked this post!",
        alreadyLiked,
      });
    }

    tweet.likes.push(req._id);

    await tweet.save();

    res.status(200).json({ message: "Tweet updated successfully!" });
  } catch (error) {
    console.error(error); // Log the error for debugging

    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({
        message: "Invalid tweet ID format!",
      });
    }

    res.status(500).json({ message: "Internal server error!" });
  }
};

const dislikeTweet = async (req, res) => {
  const { id } = req.params; // Tweet ID

  try {
    const tweet = await Tweet.findById(id);

    if (!tweet) {
      return res.status(400).json({ message: "Tweet not found!" });
    }

    const alreadyLiked = tweet.likes.includes(req._id);

    if (!alreadyLiked) {
      return res.status(400).json({
        message: "User has not liked this post!",
        alreadyLiked: -1,
      });
    }

    await Tweet.updateOne(
      { _id: id },
      {
        $pull: { likes: req._id }, // Use $pull to remove the specified element from the array
      }
    );

    res.json({ message: "Tweet updated successfully!" });
  } catch (error) {
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({
        message: "Invalid tweet ID format!",
      });
    }

    res.status(500).json({ message: "Internal server error!" });
  }
};

const replyOnTweet = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content || content === "") {
    return res.status(400).json({ message: "Tweet content can't be empty!" });
  }

  try {
    const newReplyTweet = await new Tweet({
      parentId: id,
      content,
      tweetedBy: req._id,
    });

    await newReplyTweet.save();

    const tweet = await Tweet.findByIdAndUpdate(id, {
      $push: { replies: newReplyTweet._id },
    });

    res.json({ message: "New reply added!" });
  } catch (error) {
    if (error.name === "CastError" && error.kind === "ObjectId")
      return res.status(400).json({
        message: "Invalid tweet ID format!",
      });

    res.status(500).json({ message: "Internal server error!" });
  }
};

const getTweetDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const tweet = await Tweet.findById(id)
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
      })
      .exec();

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found!" });
    }

    res.json({ tweet });
  } catch (error) {
    if (error.name === "CastError" && error.type === "ObjectId") {
      res.status(400).json({ message: "Invalid tweet ID format!" });
    }

    res.status(500).json({ message: "Internal server error!" });
  }
};

const getAllTweets = async (req, res) => {
  try {
    const tweets = await Tweet.find()
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

    res.json({ tweets });
  } catch (error) {
    if (error.name === "CastError" && error.type === "ObjectId") {
      res.status(400).json({ message: "Invalid tweet ID format!" });
    }

    res.status(500).json({ message: "Internal server error!" });
  }
};

const deleteTweet = async (req, res) => {
  const { id } = req.params;

  try {
    const tweet = await Tweet.findById(id);
    const isUserAuthenticated = tweet.tweetedBy._id.toString() === req._id.toString();

    if (!isUserAuthenticated)
      return res.status(401).json({
        message: "User is not authenticated to delete this post",
      });

    await Tweet.findByIdAndDelete(id);
  } catch (error) {
    if (error.name === "CastError" && error.type === "ObjectId") {
      res.status(400).json({ message: "Invalid tweet ID format!" });
    }

    res.status(500).json({ message: "Internal server error!" });
  }
};

const retweetTweet = async (req, res) => {
  const { id } = req.params;

  try {
    const tweet = await Tweet.findById(id);

    if (tweet.retweetBy.includes(req._id))
      res.status(409).json({
        message: "User have already reposted this tweet!",
      });

    tweet.retweetBy.push(req._id);

    await tweet.save();
  } catch (error) {
    if (error.name === "CastError" && error.type === "ObjectId") {
      res.status(400).json({ message: "Invalid tweet ID format!" });
    }

    res.status(500).json({ message: "Internal server error!" });
  }
};

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
