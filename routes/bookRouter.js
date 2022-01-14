const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

router.get("/get-book-list", bookController.getBooksList);
router.get("/get-book-list-data", bookController.getBooksListData);

module.exports = router;
