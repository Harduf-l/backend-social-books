const axios = require("axios");
const { CITIES } = require("./cities");

exports.getCitiesList = (req, res) => {
  const searchWord = req.query.search;
  let citiesMatch = CITIES.filter((el) => el.startsWith(searchWord));
  res.send(citiesMatch);
};
