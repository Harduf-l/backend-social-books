const axios = require("axios");

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
