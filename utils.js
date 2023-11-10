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

const {
  novalsRecommendationsEng,
  thrillersRecommendationsEng,
  biographyRecommendationsEng,
  poetryRecommendationsEng,
  fantasyRecommendationsEng,
  madabRecommendationsEng,
  childrenRecommendationsEng,
  teenagersRecommendationsEng,
  playsRecommendationsEng,
  nonFictionRecommendationsEng,
  selfHelpRecommendationsEng,
  psychologyRecommendationsEng,
  philosophyRecommendationsEng,
  historyRecommendationsEng,
  comicsRecommendationsEng,
  managementRecommendationsEng,
} = require("./data/genresRecommendationEng");

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

exports.getRecommendedBooksBasedOnGenres = (genresArray) => {
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

  const genreObjectEng = {
    novel: novalsRecommendationsEng,
    thriller: thrillersRecommendationsEng,
    biographic: biographyRecommendationsEng,
    poetry: poetryRecommendationsEng,
    fantasy: fantasyRecommendationsEng,
    madab: madabRecommendationsEng,
    children: childrenRecommendationsEng,
    teenagers: teenagersRecommendationsEng,
    plays: playsRecommendationsEng,
    nonfiction: nonFictionRecommendationsEng,
    "self help": selfHelpRecommendationsEng,
    psychology: psychologyRecommendationsEng,
    phlipsophy: philosophyRecommendationsEng,
    history: historyRecommendationsEng,
    comics: comicsRecommendationsEng,
    management: managementRecommendationsEng,
  };

  let possibleBooksRecommendatiosHeb = [];

  genresArray.forEach((genre) => {
    if (genreObject[genre]) {
      possibleBooksRecommendatiosHeb = [
        ...possibleBooksRecommendatiosHeb,
        ...genreObject[genre],
      ];
    }
  });

  let possibleBooksRecommendatiosEng = [];

  genresArray.forEach((genre) => {
    if (genreObjectEng[genre]) {
      possibleBooksRecommendatiosEng = [
        ...possibleBooksRecommendatiosEng,
        ...genreObjectEng[genre],
      ];
    }
  });

  const booksRecommendation = {
    hebrewRecommendations: chooseRandomAmountFunction(
      [...possibleBooksRecommendatiosHeb],
      10
    ),
    englishRecommendations: chooseRandomAmountFunction(
      [...possibleBooksRecommendatiosEng],
      10
    ),
  };

  console.log("booksRecommendation is.... ", booksRecommendation);

  return booksRecommendation;
};
