/** @format */

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    bannerImage: { type: String },
    location: { type: String },
    dateOfBirth: { type: Date },
    followers: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
    following: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;
