const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    blog_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Blog",
    },
    blog_author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Blog",
    },
    comment: {
      type: String,
      required: true,
    },
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    commented_by: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
    isReply: {
      type: Boolean,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  {
    timestamps: {
      createdAt: "commentedAt",
    },
  }
);

module.exports = mongoose.model("Comment", commentSchema);
