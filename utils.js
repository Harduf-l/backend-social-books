const axios = require("axios");
const cheerio = require("cheerio");
const {
  novalsRecommendations,
  thrillersRecommendations,
  biographyRecommendations,
  poetryRecommendations,
  fantasyRecommendations,
  madabRecommendations,
  childrenRecommendations,
  teenagersRecommendations,
  playsRecommendations,
  nonFictionRecommendations,
  selfHelpRecommendations,
  psychologyRecommendations,
  philosophyRecommendations,
  historyRecommendations,
  comicsRecommendations,
  managementRecommendations,
} = require("./data/genresRecommendation");

exports.chooseRandomAmount = (dataArray, amount) => {
  return chooseRandomAmountFunction(dataArray, amount);
};

function chooseRandomAmountFunction(dataArray, amount) {
  if (dataArray.length <= amount) {
    return dataArray;
  }

  recommendationArray = [];
  indexesUsed = {};

  while (recommendationArray.length < amount) {
    let indexFound = Math.floor(Math.random() * dataArray.length);
    if (!indexesUsed[indexFound]) {
      recommendationArray.push(dataArray[indexFound]);
      indexesUsed[indexFound] = true;
    }
  }

  return recommendationArray;
}

exports.getRecommendedBooksBasedOnGenres = async (genresArray) => {
  const genreObject = {
    novel: novalsRecommendations,
    thriller: thrillersRecommendations,
    biographic: biographyRecommendations,
    poetry: poetryRecommendations,
    fantasy: fantasyRecommendations,
    madab: madabRecommendations,
    children: childrenRecommendations,
    teenagers: teenagersRecommendations,
    plays: playsRecommendations,
    nonfiction: nonFictionRecommendations,
    "self help": selfHelpRecommendations,
    psychology: psychologyRecommendations,
    phlipsophy: philosophyRecommendations,
    history: historyRecommendations,
    comics: comicsRecommendations,
    management: managementRecommendations,
  };

  let possibleBooksRecommendatios = [];

  genresArray.forEach((genre) => {
    if (genreObject[genre]) {
      possibleBooksRecommendatios = [
        ...possibleBooksRecommendatios,
        ...genreObject[genre],
      ];
    }
  });

  return chooseRandomAmountFunction([...possibleBooksRecommendatios], 10);
};
