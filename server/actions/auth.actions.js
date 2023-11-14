// Import necessary libraries for password hashing and JSON Web Token (JWT) handling
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Import the User model and the verifyFields utility function
const User = require("../models/user.model");
const verifyFields = require("../utils/verifyFields");

// Load environment variables from a .env file and retrieve the JWT secret key
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

/**
 * @function signupUser
 * @description Register a new user by handling a POST request with user data.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const signupUser = async (req, res) => {
    // Destructure user data from the request body
    const { name, username, email, password } = req.body;

    // Validate that all required fields are provided
    if (!verifyFields(name, username, email, password))
        return res.status(400).json({ message: "All fields are required!" });

    try {
        // Check if the username or email already exists in the database
        const usernameAlreadyExist = await User.findOne({ username });
        const emailAlreadyExist = await User.findOne({ email });

        // Return an error response if the username is already in use
        if (usernameAlreadyExist) {
            return res.status(409).json({
                message: "Username already in use!",
            });
        }

        // Return an error response if the email already exists
        if (emailAlreadyExist) {
            return res.status(409).json({
                message: "Email already exists!",
            });
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new User instance with the hashed password
        const newUser = await new User({
            name,
            username,
            email,
            password: hashedPassword,
        });

        // Save the new user to the database
        const savedUser = await newUser.save();

        // Return a success response with the registered user data
        res.status(201).json({
            message: "User registered successfully!",
            user: savedUser,
        });
    } catch (error) {
        // Return an error response if an exception occurs during registration
        res.status(500).json({
            message: `Error while registering the user: ${error.message}`,
        });
    }
};

/**
 * @function loginUser
 * @description Authenticate a user by handling a POST request with login credentials.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const loginUser = async (req, res) => {
    // Destructure login credentials from the request body
    const { username, password } = req.body;

    // Validate that all required fields are provided
    if (!username || !password)
        return res.status(400).json({
            message: "All fields are required!",
        });

    try {
        // Find the user with the provided username in the database
        const existingUser = await User.findOne({ username });

        // Return an error response if the username is not found
        if (!existingUser) {
            return res.status(401).json({ message: "Invalid username!" });
        }

        // Compare the provided password with the hashed password stored in the database
        const passwordMatched = await bcrypt.compare(
            password,
            existingUser.password
        );

        // Return an error response if the password is invalid
        if (!passwordMatched) {
            return res.status(401).json({ message: "Invalid password!" });
        }

        // Generate a JWT access token for the authenticated user
        const accessToken = jwt.sign({ _id: existingUser._id }, JWT_SECRET_KEY);

        // Return a success response with the authenticated user data and access token
        res.status(200).json({
            message: "User logged in successfully!",
            user: existingUser,
            accessToken,
        });
    } catch (error) {
        // Handle specific errors and provide appropriate responses
        if (error.name === "CastError" && error.kind === "ObjectId")
            return res.status(400).json({
                message: "Invalid user ID format!",
            });

        // Return an error response if an exception occurs during login
        res.status(500).json({
            message: `Error while logging in the user: ${error.message}`,
        });
    }
};

// Export the signupUser and loginUser functions for use in other files
module.exports = { signupUser, loginUser };
