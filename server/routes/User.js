const express = require("express");
const router = express.Router();

const {
  signUp,
  sendOTP,
  login,
  changePassword,
} = require("../controllers/Auth");

const { auth } = require("../middlewares/auth");

const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword");

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user signup
router.post("/signup", signUp);

// Route for sending OTP to the user's email
router.post("/sendotp", sendOTP);

// Route for user login
router.post("/login", login);

// Route for changing password
router.post("/changepassword", auth, changePassword);

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken);

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword);

module.exports = router;
