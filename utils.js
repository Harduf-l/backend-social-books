const axios = require("axios");
const cheerio = require("cheerio");

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
  let possibleAxiosRequests = [];

  const genreObject = {
    novel: "[categoryId]=15&s[subCategoryId]=5",
    thriller: "[categoryId]=15&s[subCategoryId]=2",
    biographic: "[categoryId]=15&s[subCategoryId]=14",
    poetry: "[categoryId]=15&s[subCategoryId]=9",
    fantasy: "[categoryId]=15&s[subCategoryId]=1",
    madab: "[categoryId]=15&s[subCategoryId]=1",
    children: "[categoryId]=8",
    teenagers: "[categoryId]=14",
    plays: "[categoryId]=2&s[subCategoryId]=6",
    nonfiction: "[categoryId]=18",
    "self help": "[categoryId]=17",
    psychology: "[categoryId]=21",
    phlipsophy: "[categoryId]=18&s[subCategoryId]=20",
    history: "[categoryId]=18&s[subCategoryId]=8",
    comics: "[categoryId]=14&s[subCategoryId]=4",
    management: "[categoryId]=19",
  };

  genresArray.forEach((genre) => {
    if (genreObject[genre]) {
      possibleAxiosRequests.push(genreObject[genre]);
    }
  });

  possibleAxiosRequests = chooseRandomAmountFunction(possibleAxiosRequests, 2);

  let bookArray = await getBooksList(possibleAxiosRequests[0]);
  let bookArray2 = [];
  if (possibleAxiosRequests[1]) {
    bookArray2 = await getBooksList(possibleAxiosRequests[1]);
  }

  return chooseRandomAmountFunction([...bookArray, ...bookArray2], 10);
};

const getBooksList = async (stringToAdd) => {
  const response = await axios.get(
    `https://simania.co.il/shop/?s${stringToAdd}`
  );

  const markup = response.data;

  const $ = cheerio.load(markup);

  const bookList = [];
  const bookTables = $(".searchResult");

  bookTables.each(function (idx, el) {
    let bookObj = {};
    bookObj["imgSrc"] = $(el)
      .children("tbody")
      .children("tr")
      .children("td")
      .eq(1)
      .children("div")
      .children("div")
      .children("a")
      .children("img")
      .attr("src");

    bookObj["title"] = $(el)
      .children("tbody")
      .children("tr")
      .children("td")
      .eq(2)
      .children("div")
      .children("div")
      .children("a")
      .eq(0)
      .text();

    bookObj["author"] = $(el)
      .children("tbody")
      .children("tr")
      .children("td")
      .eq(2)
      .children("div")
      .children("div")
      .children("a")
      .eq(1)
      .text();

    bookObj["bookId"] = $(el)
      .children("tbody")
      .children("tr")
      .children("td")
      .eq(2)
      .children("div")
      .children("div")
      .children("a")
      .eq(0)
      .attr("href")
      .split("=")[1];

    bookList.push(bookObj);
  });

  return bookList;
};
