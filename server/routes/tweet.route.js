/** @format */

const express = require("express");
const {
  uploadTweet,
  likeTweet,
  dislikeTweet,
  replyOnTweet,
  getTweetDetails,
  getAllTweets,
  deleteTweet,
  retweetTweet,
} = require("../actions/tweet.actions");
const verifyAccess = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/", verifyAccess, uploadTweet);
router.post("/:id/like", verifyAccess, likeTweet);
router.post("/:id/dislike", verifyAccess, dislikeTweet);
router.post("/:id/reply", verifyAccess, replyOnTweet);
router.get("/:id", verifyAccess, getTweetDetails);
router.get("/", verifyAccess, getAllTweets);
router.delete("/:id", verifyAccess, deleteTweet);
router.post("/:id/retweet", verifyAccess, retweetTweet);

module.exports = router;
