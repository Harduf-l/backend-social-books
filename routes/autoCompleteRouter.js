const express = require("express");
const router = express.Router();
const autoCompleteController = require("../controllers/autoCompleteController");

router.get("/get-cities-list", autoCompleteController.getCitiesList);

router.get("/get-countries-list", autoCompleteController.getCountriesList);
router.get(
  "/get-countriesHeb-list",
  autoCompleteController.getCountriesHebList
);

module.exports = router;
