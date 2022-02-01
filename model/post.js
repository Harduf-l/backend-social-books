const mongoose = require("mongoose");

const miniCommentSchema = new mongoose.Schema({
  miniCommentContent: { type: String },
  miniCommentResponder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserSchema",
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserSchema" }],
});

const commentSchema = new mongoose.Schema({
  commentContent: { type: String },
  commentResponder: { type: mongoose.Schema.Types.ObjectId, ref: "UserSchema" },
  miniComments: [miniCommentSchema],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserSchema" }],
});

const PostSchema = new mongoose.Schema(
  {
    postWriter: { type: mongoose.Schema.Types.ObjectId, ref: "UserSchema" },
    createdAt: { type: Date },
    postContent: { type: String },
    comments: [commentSchema],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserSchema" }],
    tag: { type: String },
  },
  { collection: "posts" }
);

const model = mongoose.model("PostSchema", PostSchema);
module.exports = model;
