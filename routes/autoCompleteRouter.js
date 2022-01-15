const express = require("express");
const router = express.Router();
const autoCompleteController = require("../controllers/autoCompleteController");

router.get("/get-cities-list", autoCompleteController.getCitiesList);

module.exports = router;
