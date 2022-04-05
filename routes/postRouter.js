const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router.post("/add-post", postController.addPost);
router.get("/get-all-posts", postController.getAllPosts);
router.get(
  "/get-searched-posts/:searchedWord",
  postController.getSearchedPosts
);
router.post("/add-post-comment", postController.addPostComment);
router.post("/add-post-like", postController.addPostLike);
router.post("/remove-post-like", postController.removePostLike);
module.exports = router;
