const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/get-data", adminController.getData);

module.exports = router;
