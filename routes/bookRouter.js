const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

// router.get("/get-book-list", bookController.getBooksList);
// router.get("/get-book-list-data", bookController.getBooksListData);
// router.get("/get-single-book-data", bookController.getSingleBookData);

router.get("/get-genre-book-list", bookController.createGenreBookList);
module.exports = router;
