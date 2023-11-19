/** @format */

const { verify } = require("jsonwebtoken");

// Load environment variables from a .env file
require("dotenv").config();

// Get the JWT secret key from the environment variable or use a default key
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "cyw6Pd09WjcrSie3dPnzA8d5";

/**
 * @function verifyAccess
 * @description Middleware function to verify the access token in the request header.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function in the Express pipeline.
 */
const verifyAccess = (req, res, next) => {
  // Extract the access token from the request headers
  const accessToken = req.headers["x-auth-token"]?.split(" ")[1];

  // Return an error response if no access token is provided
  if (!accessToken)
    return res.status(401).json({
      message: "User not authenticated!",
    });

  try {
    // Verify the access token using the JWT_SECRET_KEY
    const decodedData = verify(accessToken, JWT_SECRET_KEY);

    // Return an error response if the decoded data is invalid
    if (!decodedData)
      res.status(401).json({
        message: "Provided access token is invalid",
      });

    // Attach the user ID from the decoded token to the request object
    req._id = decodedData._id;

    // Call the next middleware function in the pipeline
    next();
  } catch (error) {
    // Handle errors during token verification and provide an appropriate response
    res.status(500).json({
      error: error.message,
      message: "Something went wrong while verifying the access token!",
    });
  }
};

// Export the middleware function for use in other files
module.exports = verifyAccess;
