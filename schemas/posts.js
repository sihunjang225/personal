const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const postsSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    user: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Posts", postsSchema);
