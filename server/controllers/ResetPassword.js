const bcrypt = require("bcrypt");
const { randomBytes } = require("node:crypto");

const User = require("../models/User");
const mailSender = require("../utils/mailSender");

// reset password token
exports.resetPasswordToken = async (req, res) => {
  try {
    // get email from body
    const email = req.body.email;

    // check user for the given email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: `The email ${email} is not Registered With Us, Please enter a Valid Email`,
      });
    }

    // generate token
    const token = randomBytes(20).toString("hex");

    console.log("url token", token);

    // update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      { token: token, resetPasswordExpires: Date.now() + 3600000 },
      { new: true }
    );

    console.log("Updated user details:", updatedDetails);

    // create url
    const url = `http://localhost:3000/update-password/${token}`;

    // send mail containing the url
    await mailSender(
      email,
      "Password reser link",
      `Your Link for email verification is ${url}. Please click this url to reset your password.`
    );

    // return response
    return res.status(200).json({
      success: true,
      message:
        "Email sent successfully. Please check your email and change the password",
    });
  } catch (error) {
    console.log("Error occurred in resetPasswordToken", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending Reset passord email",
      error: error.message,
    });
  }
};

// reset password
exports.resetPassword = async (req, res) => {
  try {
    // data is fetched
    const { password, confirmPassword, token } = req.body;

    // validation
    if (password !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message:
          "Password and Confirm password doesn't match. Please try again",
      });
    }

    // get user details using token
    const userDetails = await User.findOne({ token: token });

    // token validation
    if (!userDetails) {
      return res.status(401).json({
        success: false,
        message: "Token is Invalid.",
      });
    }

    // check time for token
    const isTokenValid = userDetails.resetPasswordExpires > Date.now();

    if (!isTokenValid) {
      return res.status(403).json({
        success: false,
        message: "Token is expired. Please regenerate your token.",
      });
    }

    // hash the password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // update the password
    await User.findOneAndUpdate(
      { token: token },
      { password: encryptedPassword },
      { new: true }
    );

    // return response
    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.log("Error occurred in resetPassword", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while Password was being reset",
      error: error.message,
    });
  }
};
