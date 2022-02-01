const Post = require("../model/post");

exports.addPost = async (req, res) => {
  const post = {
    postWriter: req.body.postWriter,
    createdAt: Date.now(),
    postContent: req.body.postContent,
    comments: [],
    likes: [],
    tag: req.body.tag,
  };
  try {
    const newPost = new Post(post);
    let newPostCreated = await newPost.save();

    const populatedPost = await Post.findById(newPostCreated._id)
      .populate({
        path: "postWriter",
        select: "username _id picture",
      })
      .populate({
        path: "comments.commentResponder",
        select: "username _id picture",
      })
      .populate({
        path: "comments.miniComments.miniCommentResponder",
        select: "username _id picture",
      });

    res.status(200).json(populatedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const populatedPost = await Post.find()
      .populate({
        path: "postWriter",
        select: "username _id picture",
      })
      .populate({
        path: "comments.commentResponder",
        select: "username _id picture",
      })
      .populate({
        path: "comments.miniComments.miniCommentResponder",
        select: "username _id picture",
      });

    res.status(200).json(populatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
};
