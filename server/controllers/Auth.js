const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/User");
const Profile = require("../models/Profile");
const OTP = require("../models/OTP");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");

// send OTP for email Verification------------------->
exports.sendOTP = async (req, res) => {
  try {
    console.log("send otp 1");
    // email is fetched
    const { email } = req.body;

    console.log("send otp 2s");
    // check if user already exist
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: "User already exist",
      });
    }

    // generate the otp
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // check unique otp
    const uniqueOtp = await OTP.findOne({ otp });

    while (uniqueOtp) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
    }
    console.log("Generated OTP", otp);

    // create an entry for otp
    const otpPayload = { email, otp };

    const otpBody = await OTP.create(otpPayload);
    console.log("OTP body", otpBody);

    // return success response
    return res.status(200).json({
      success: true,
      message: "OTP generated successfully",
      otp,
    });
  } catch (error) {
    console.log("Error while sending OTP", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while sending OTP",
    });
  }
};

// signUp controller for registering users----------->
exports.signUp = async (req, res) => {
  try {
    // data is fetched
    const { fullName, userName, email, password, confirmPassword, otp } =
      req.body;

    // data is validated
    if (
      !fullName ||
      !userName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }
    // passwords are matched
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password doesn't match. Please try again",
      });
    }

    // check if user already exist
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(403).json({
        success: false,
        message: "User already exists. Please Sign in to continue",
      });
    }

    // find the most recent otp stored for the user
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    // validate the otp
    if (recentOtp.length === 0) {
      return res.status(403).json({
        success: false,
        message: "OTP not found",
      });
    } else if (otp !== recentOtp[0].otp) {
      return res.status(403).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create additional profile
    const profileDetails = await Profile.create({});

    console.log("profileDetails", profileDetails);

    // create the user
    const user = await User.create({
      fullName,
      userName,
      email,
      password: hashedPassword,
      additionalDetails: profileDetails._id,
      accountType: "Blogger",
    });

    // return the response
    return res.status(200).json({
      success: true,
      message: "User is registered Successfully",
      user,
    });
  } catch (error) {
    console.log("Error while registering user", error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    });
  }
};

// login controller for authenticating users--------->
exports.login = async (req, res) => {
  try {
    // get data
    const { email, password } = req.body;

    // check if data is present
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check if user already exist or not
    const user = await User.findOne({ email }).populate("additionalDetails");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered. Please Sign up to Continue",
      });
    }

    // generate jwt and compare password
    const checkPassword = await bcrypt.compare(password, user.password);

    if (checkPassword) {
      const token = jwt.sign(
        { email: user.email, id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      user.token = token;
      user.password = undefined;

      console.log("user data while sign in", user);

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      // create cookie for token and send response
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "User logged in successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect. Please try again",
      });
    }
  } catch (error) {
    console.log("Error occurred while logging in", error);
    return res.status(500).json({
      success: false,
      message: "Login Failure, Please try again",
    });
  }
};

// change password
exports.changePassword = async (req, res) => {
  try {
    // get data from request user
    const userDetails = await User.findById(req.user.id);

    // get oldPassword, newPassword and confirmPassword
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // validate the password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "The current password is incorrect",
      });
    }

    // match new password and confirm password
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "The password and confirm password does not match",
      });
    }

    // update password in DB
    const encryptedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    );

    // send notification email that password is updated
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(updatedUserDetails.email, updatedUserDetails.fullName)
      );

      console.log("Password update email sent successfully: ", emailResponse);
    } catch (error) {
      console.error("Error occurred while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }

    // return response
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error occurred while updating password:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }
};
