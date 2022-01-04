const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

router.get("/get-book-list", bookController.getBooksList);

module.exports = router;
