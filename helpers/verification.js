const Post = require("../model/post");
const jwt = require("jsonwebtoken");

exports.verifyUserIsWhoHeSays = async (req, res, next) => {
  const { token } = req.body;
  const { postId } = req.body;
  if (token) {
    try {
      const userToken = jwt.verify(token, process.env.JWT_SECRET);
      const userTokenId = userToken.id;

      const postRequestedToChange = await Post.findById(postId);

      if (userTokenId === postRequestedToChange.postWriter.toString()) {
        next();
      } else {
        res
          .status(500)
          .json({ status: "error", error: "user is not who he says" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: "error", error: "access blocked" });
    }
  } else {
    res.status(500).json("no token on request body");
  }
};
