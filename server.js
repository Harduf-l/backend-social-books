require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const userRouter = require("./routes/userRoutes");
const bookRouter = require("./routes/bookRouter");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const mongoDB = process.env.mongoUrl;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("mongoDB connection established successfully");
});

app.use("/users", userRouter);
app.use("/books", bookRouter);

app.listen(5005, () => {
  console.log("server is running");
});
