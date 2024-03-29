const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const { getBiggerResolutionImage } = require("../helpers/utils");

/// creating genre book list from goodreads
exports.createGenreBookList = (req, res) => {
  axios
    .get(`https://www.goodreads.com/shelf/show/management`)
    .then((response) => {
      const $ = cheerio.load(response.data);

      const bookUnits = $(".elementList");

      bookUnits.toArray().map((book, index) => {
        const title = book.children[1].children[0].next.attribs.title;
        const photo = getBiggerResolutionImage(
          book.children[1].children[0].next.children[0].attribs.src
        );
        const author =
          book.children[1].children[9].children[1].children[1].children[0]
            .children[0].data;

        // ערך 50 ו-51 הם אנדיפיינד

        console.log({ index, title, photo, author }, ",");
      });
    })
    .catch((err) => {
      console.log("error is in createGenreBookList", err);
    });
};

// exports.getSingleBookData = (req, res) => {
//   const bookId = req.query.bookId;
//   axios
//     .get(`https://simania.co.il/bookdetails.php?item_id=${bookId}`)
//     .then((response) => {
//       const markup = response.data;
//       const $ = cheerio.load(markup);

//       const bookArea = $(".description")[0];
//       bookAreaChildren = bookArea.children;
//       let bigDataStr = "";

//       for (let i = 0; i < bookAreaChildren.length; i++) {
//         if (bookAreaChildren[i].data) {
//           bigDataStr += bookAreaChildren[i].data + " ";
//         }
//       }

//       let bookDescription = bookArea ? bigDataStr.trim() : null;

//       constDetailsArea = $(".when")[0];

//       let printedBy = null;
//       let yearReleased = null;
//       let pagesInBook = null;
//       if (constDetailsArea) {
//         printedBy =
//           constDetailsArea.children[1] &&
//           constDetailsArea.children[1].children[0].data;
//         yearReleased =
//           constDetailsArea.children[3] &&
//           constDetailsArea.children[3].children[0].data;
//         pagesInBook =
//           constDetailsArea.children[5] &&
//           constDetailsArea.children[5].children[0].data;
//       }

//       pagesInBook = +pagesInBook;
//       yearReleased = +yearReleased;

//       if (yearReleased && yearReleased < 1600) {
//         pagesInBook = yearReleased;
//         yearReleased = null;
//       }

//       if (pagesInBook && pagesInBook > 1600) {
//         yearReleased = pagesInBook;
//         pagesInBook = null;
//       }

//       res
//         .status(200)
//         .json({ bookDescription, printedBy, yearReleased, pagesInBook });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// };

// exports.getBooksListData = (req, res) => {
//   const searchWord = req.query.search;
//   let encodedWord = encodeURI(searchWord);

//   axios
//     .get(
//       `https://simania.co.il/searchBooks.php?searchType=tabAll&query=${encodedWord}`
//     )
//     .then((response) => {
//       const markup = response.data;

//       if (response.data.length < 200) {
//         // it means we have only one book
//         // need to get the bookId and scrape in the single book page
//         let bookDetail = markup.split("item_id=")[1].split(`"`)[0];

//         axios
//           .get(`https://simania.co.il/bookdetails.php?item_id=${bookDetail}`)
//           .then((data) => {
//             const markup = data.data;
//             const $ = cheerio.load(markup);
//             let bookObj = {};
//             bookObj["bookId"] = bookDetail;
//             bookObj["imgSrc"] = $(".bookImage")[0].attribs["src"];

//             bookObj["title"] = constDetailsArea = $(".when")
//               .parent()
//               .children("h2")
//               .eq(0)
//               .text();

//             bookObj["author"] = constDetailsArea = $(".when")
//               .parent()
//               .children("h3")
//               .eq(0)
//               .text();

//             let bookList = [];
//             bookList.push(bookObj);
//             res.status(200).json(bookList);
//           })
//           .catch((err) => {
//             res.status(500).json(err);
//           });
//       } else {
//         // scraping list of boooks
//         const $ = cheerio.load(markup);
//         const bookList = [];
//         const bookTables = $(".searchResult");

//         bookTables.each(function (idx, el) {
//           let bookObj = {};
//           bookObj["imgSrc"] = $(el)
//             .children("tbody")
//             .children("tr")
//             .children("td")
//             .eq(1)
//             .children("div")
//             .children("div")
//             .children("a")
//             .children("img")
//             .attr("src");

//           bookObj["title"] = $(el)
//             .children("tbody")
//             .children("tr")
//             .children("td")
//             .eq(2)
//             .children("div")
//             .children("div")
//             .children("a")
//             .eq(0)
//             .text();

//           bookObj["author"] = $(el)
//             .children("tbody")
//             .children("tr")
//             .children("td")
//             .eq(2)
//             .children("div")
//             .children("div")
//             .children("a")
//             .eq(1)
//             .text();

//           bookObj["bookId"] = $(el)
//             .children("tbody")
//             .children("tr")
//             .children("td")
//             .eq(2)
//             .children("div")
//             .children("div")
//             .children("a")
//             .eq(0)
//             .attr("href")
//             .split("=")[1];

//           bookList.push(bookObj);
//         });

//         res.status(200).json(bookList);
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// };

// exports.getBooksList = (req, res) => {
//   const searchWord = req.query.search;
//   let encodedWord = encodeURI(searchWord);
//   axios
//     .get(
//       `https://api.nli.org.il/openlibrary/search?api_key=uoX9ZMiaRMIBUF4pX0SEuGXMRpUqQIHrw5XuQKcE&query=title,contains,${encodedWord},And;creator,contains,${encodedWord},AND;language,exact,heb&output_format=json&material_type=books`
//     )
//     .then((response) => {
//       const hebrewData = response.data.map((el) => {
//         return {
//           title: el["http://purl.org/dc/elements/1.1/title"]
//             ? el["http://purl.org/dc/elements/1.1/title"][0]["@value"].split(
//                 "/"
//               )[0]
//             : "",
//           author: el["http://purl.org/dc/elements/1.1/creator"]
//             ? el["http://purl.org/dc/elements/1.1/creator"][0]["@value"].split(
//                 /[,$$Q]/
//               )[0] +
//               el["http://purl.org/dc/elements/1.1/creator"][0]["@value"].split(
//                 /[,$$Q]/
//               )[1]
//             : "",
//         };
//       });

//       res.json(hebrewData);
//     });
// };
