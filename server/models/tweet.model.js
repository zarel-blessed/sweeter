const mongoose = require("mongoose");

const TweetSchema = new mongoose.Schema(
               {
    parentId:  { type: String, default: null },
    content:   { type: String, required: true },
    image:     { type: String },
    tweetedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likes:     { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
    retweetBy: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
    replies:   { type: [mongoose.Schema.Types.ObjectId], ref: "Tweet" },
                                                                      },
               { timestamps: true }
);

const Tweet = mongoose.models.Tweet || mongoose.model("Tweet", TweetSchema);
module.exports = Tweet;
