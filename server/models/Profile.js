const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  bio: {
    type: String,
    maxlength: [200, "Bio should not be more than 200"],
    default: "",
  },
  social_links: {
    youtube: {
      type: String,
      default: "",
    },
    instagram: {
      type: String,
      default: "",
    },
    facebook: {
      type: String,
      default: "",
    },
    twitter: {
      type: String,
      default: "",
    },
    github: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
  },
});

module.exports = mongoose.model("Profile", profileSchema);
