const express = require("express");
const router = express.Router();
const { quotesEng, quotesHeb } = require("../data/dailyQuotes");

router.get("/daily-quote", (req, res) => {
  englishQuote = quotesEng[Math.floor(Math.random() * quotesEng.length)];
  hebrewQuote = quotesHeb[Math.floor(Math.random() * quotesHeb.length)];

  res.status(200).json({ englishQuote, hebrewQuote });
});

module.exports = router;
