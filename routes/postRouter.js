const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router.post("/add-post", postController.addPost);
router.get("/get-all-posts", postController.getAllPosts);

module.exports = router;
