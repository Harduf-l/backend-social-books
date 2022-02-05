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
        path: "likes",
        select: "username _id picture",
      })
      .populate({
        path: "comments.commentResponder",
        select: "username _id picture",
      })
      .populate({
        path: "comments.miniComments.commentResponder",
        select: "username _id picture",
      });

    res.status(200).json(populatedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.addPostLike = async (req, res) => {
  try {
    let postToAddLike = await Post.findById(req.body.postId);
    let index = postToAddLike.likes.findIndex(
      (el) => el.toString() === req.body.userId
    );
    if (index === -1) {
      postToAddLike.likes.push(req.body.userId);
      await postToAddLike.save();
      res.status(200).json("like was added");
    } else {
      res.status(500).json("like already exist");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.removePostLike = async (req, res) => {
  try {
    let postToRemoveLike = await Post.findById(req.body.postId);

    let indexLikeToDelete = postToRemoveLike.likes.findIndex(
      (liker) => liker.toString() === req.body.userId
    );

    if (indexLikeToDelete !== -1) {
      postToRemoveLike.likes.splice(indexLikeToDelete, 1);
    }

    await postToRemoveLike.save();

    /////

    res.status(200).json("liked removed");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.addPostComment = async (req, res) => {
  let newComment = {
    commentContent: req.body.content,
    commentResponder: req.body.responderId,
    createdAt: Date.now(),
  };

  try {
    let postToAddComment = await Post.findById(req.body.postId);

    /// checking if it's mini comment or regular comment, inserting to database accordingly ///
    if (req.body.commentId) {
      let commentIndex = postToAddComment.comments.findIndex(
        (el) => el._id.toString() === req.body.commentId.toString()
      );
      if (commentIndex !== -1) {
        postToAddComment.comments[commentIndex].miniComments.unshift(
          newComment
        );
      }
    } else {
      postToAddComment.comments.push(newComment);
    }
    /////
    const newPostWithComments = await postToAddComment.save();
    const populatedPost = await Post.findById(newPostWithComments._id)
      .populate({
        path: "postWriter",
        select: "username _id picture",
      })
      .populate({
        path: "likes",
        select: "username _id picture",
      })
      .populate({
        path: "comments.commentResponder",
        select: "username _id picture",
      })
      .populate({
        path: "comments.miniComments.commentResponder",
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
        path: "likes",
        select: "username _id picture",
      })
      .populate({
        path: "comments.commentResponder",
        select: "username _id picture",
      })
      .populate({
        path: "comments.miniComments.commentResponder",
        select: "username _id picture",
      });

    res.status(200).json(populatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
};
