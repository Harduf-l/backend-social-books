require("dotenv").config();
const cors = require("cors");
const express = require("express");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const cookie = require("cookie-parser");
const axios = require("axios");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const User = require("./model/user");

const mongoDB = process.env.mongoUrl;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("mongoDB connection established successfully");
});

const multerConfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/");
  },
  filename: (req, file, callback) => {
    const ext = file.mimetype.split("/")[1];
    callback(null, `image-${Date.now()}.${ext}`);
  },
});

const isImage = (req, file, callback) => {
  if (file.mimetype.split("/")[0] === "image") {
    callback(null, true);
  } else {
    callback(new Error("only image is allowed..."));
  }
  return true;
};

const upload = multer({
  storage: multerConfig,
  fileFilter: isImage,
});

app.post("/tokenCheck", async (req, res) => {
  const { token } = req.body;
  if (token) {
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      const _id = user.id;
      const foundUser = await User.findById(_id);
      delete foundUser.password;
      let suggestedUsers = [];
      suggestedUsers = await User.find({
        genres: { $in: foundUser.genres },
        email: { $ne: foundUser.email },
      }).limit(5);

      res.json({ status: "ok", userDetails: foundUser, suggestedUsers });
    } catch {
      res.json({ status: "error", error: "access blocked" });
    }
  } else {
    res.json({ status: "not connected" });
  }
});

app.post("/login", async (req, res) => {
  const { password, email } = req.body;

  const user = await User.findOne({ email }).lean();
  if (!user) {
    return res.json({ status: "error", error: "invalid username/password" });
  }
  if (await bcrypt.compare(password, user.password)) {
    // the username password is correct
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET
    );
    delete user.password;

    let suggestedUsers = [];
    suggestedUsers = await User.find({
      genres: { $in: user.genres },
      email: { $ne: user.email },
    }).limit(5);

    return res.send({
      status: "ok",
      token: token,
      userDetails: user,
      suggestedUsers,
    });
  } else {
    return res.json({ status: "error", error: "invalid username/password" });
  }
});

app.post("/add-user", upload.single("photo"), async (req, res) => {
  const { password, genres } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);
  const genresArray = genres.split(",");

  const newUser = {
    ...req.body,
    picture: req.file.filename,
    password: encryptedPassword,
    genres: genresArray,
  };

  try {
    const response = await User.create(newUser);
    delete response.password;

    let suggestedUsers = [];
    suggestedUsers = await User.find({
      genres: { $in: response.genres },
      email: { $ne: response.email },
    }).limit(5);

    return res.json({ status: "ok", userDetails: response, suggestedUsers });
  } catch (error) {
    // deleting picture file because the user wasn't approved/created
    const pathToDelete = path.join(__dirname, "public", req.file.filename);
    try {
      fs.unlinkSync(pathToDelete);
    } catch (err) {
      console.error(err);
    }

    if (error.code === 11000) {
      //means it's duplicate key (user tried to register with same email)
      return res.json({ status: "error", error: "Duplicated email" });
    }
    // we don't know why there is an error
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
});

app.get("/get-book-list", (req, res) => {
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
});

app.listen(5005, () => {
  console.log("server is running");
});
