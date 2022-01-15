const axios = require("axios");
const cheerio = require("cheerio");

exports.getBooksList = (req, res) => {
  const searchWord = req.query.search;
  let encodedWord = encodeURI(searchWord);
  axios
    .get(
      `https://api.nli.org.il/openlibrary/search?api_key=uoX9ZMiaRMIBUF4pX0SEuGXMRpUqQIHrw5XuQKcE&query=title,contains,${encodedWord},And;creator,contains,${encodedWord},AND;language,exact,heb&output_format=json&material_type=books`
    )
    .then((response) => {
      const hebrewData = response.data.map((el) => {
        return {
          title: el["http://purl.org/dc/elements/1.1/title"]
            ? el["http://purl.org/dc/elements/1.1/title"][0]["@value"].split(
                "/"
              )[0]
            : "",
          author: el["http://purl.org/dc/elements/1.1/creator"]
            ? el["http://purl.org/dc/elements/1.1/creator"][0]["@value"].split(
                /[,$$Q]/
              )[0] +
              el["http://purl.org/dc/elements/1.1/creator"][0]["@value"].split(
                /[,$$Q]/
              )[1]
            : "",
        };
      });

      res.json(hebrewData);
    });
};

exports.getSingleBookData = (req, res) => {
  const bookId = req.query.bookId;
  axios
    .get(`https://simania.co.il/bookdetails.php?item_id=${bookId}`)
    .then((response) => {
      const markup = response.data;
      const $ = cheerio.load(markup);

      const bookArea = $(".description")[0];
      bookAreaChildren = bookArea.children;
      let bigDataStr = "";

      for (let i = 0; i < bookAreaChildren.length; i++) {
        if (bookAreaChildren[i].data) {
          bigDataStr += bookAreaChildren[i].data + " ";
        }
      }

      let bookDescription = bookArea ? bigDataStr : null;

      constDetailsArea = $(".when")[0];

      let printedBy = null;
      let yearReleased = null;
      let pagesInBook = null;
      if (constDetailsArea) {
        printedBy =
          constDetailsArea.children[1] &&
          constDetailsArea.children[1].children[0].data;
        yearReleased =
          constDetailsArea.children[3] &&
          constDetailsArea.children[3].children[0].data;
        pagesInBook =
          constDetailsArea.children[5] &&
          constDetailsArea.children[5].children[0].data;
      }

      pagesInBook = +pagesInBook;
      yearReleased = +yearReleased;

      if (yearReleased && yearReleased < 1600) {
        pagesInBook = yearReleased;
        yearReleased = null;
      }

      if (pagesInBook && pagesInBook > 1600) {
        yearReleased = pagesInBook;
        pagesInBook = null;
      }

      res
        .status(200)
        .json({ bookDescription, printedBy, yearReleased, pagesInBook });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

exports.getBooksListData = (req, res) => {
  const searchWord = req.query.search;
  let encodedWord = encodeURI(searchWord);

  axios
    .get(
      `https://simania.co.il/searchBooks.php?searchType=tabAll&query=${encodedWord}`
    )
    .then((response) => {
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

      res.status(200).json(bookList);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};
