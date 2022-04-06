const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { verifyUserIsWhoHeSays } = require("../helpers/verification");

router.post("/edit-post", verifyUserIsWhoHeSays, postController.editPost);
router.post("/add-post", postController.addPost);
router.get("/get-all-posts", postController.getAllPosts);
router.get(
  "/get-searched-posts/:searchedWord",
  postController.getSearchedPosts
);
router.post("/add-post-comment", postController.addPostComment);
router.post("/add-post-like", postController.addPostLike);
router.post("/remove-post-like", postController.removePostLike);
router.delete(
  "/remove-post-entirely",
  verifyUserIsWhoHeSays,
  postController.deletePost
);
module.exports = router;
