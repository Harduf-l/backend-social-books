require("dotenv").config();
const cors = require("cors");
const express = require("express");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const fs = require("fs");
const bcrypt = require("bcryptjs");

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

app.post("/login", async (req, res) => {
  const { password, email } = req.body;

  const user = await User.findOne({ email }).lean();
  if (!user) {
    return res.json({ status: "error", error: "invalid username/password" });
  }
  if (await bcrypt.compare(password, user.password)) {
    // the username password is correct
    return res.send({ status: "ok" });
  } else {
    return res.json({ status: "error", error: "invalid username/password" });
  }
});

app.post("/add-user", upload.single("photo"), async (req, res) => {
  const { password } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    ...req.body,
    picture: req.file.filename,
    password: encryptedPassword,
  };

  try {
    const response = await User.create(newUser);
    console.log("user created successfully", response);
    return res.json({ status: "ok" });
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

app.listen(5005, () => {
  console.log("server is running");
});
