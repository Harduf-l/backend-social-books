const axios = require("axios");
const { CITIES, COUNTRIES, COUNTRIESHEB } = require("./locations");

exports.getCitiesList = (req, res) => {
  const searchWord = req.query.search;
  let citiesMatch = CITIES.filter((el) => el.startsWith(searchWord));
  res.send(citiesMatch);
};

exports.getCountriesList = (req, res) => {
  const searchWord = req.query.search;
  let countriesMatch = COUNTRIES.filter((el) =>
    el.toLowerCase().startsWith(searchWord)
  );
  res.send(countriesMatch);
};

exports.getCountriesHebList = (req, res) => {
  const searchWord = req.query.search;
  let countriesHebMatch = COUNTRIESHEB.filter((el) =>
    el.startsWith(searchWord)
  );
  res.send(countriesHebMatch);
};
