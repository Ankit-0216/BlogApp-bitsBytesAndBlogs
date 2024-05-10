const jwt = require("jsonwebtoken");
require("dotenv").config();

// auth ------------->
exports.auth = async (req, res, next) => {
  try {
    console.log("inside auth");
    console.log("token in cookies", req.cookies.token);

    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");

    console.log("token in auth", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "JWT Token is missing",
      });
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log("decode from auth-->", decode);
      req.user = decode;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token is Invalid",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while validating the Token!!",
    });
  }
};

// isBlogger--------->
exports.isBlogger = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Blogger") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Blogger only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified for Blogger. Please try again",
    });
  }
};

// isAdmin----------->
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Admin only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified for Admin.",
    });
  }
};
