require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
const bookRouter = require("./routes/bookRouter");
const messagesRouter = require("./routes/messagesRoutes");
const autoCompleteRouter = require("./routes/autoCompleteRouter");
const app = express();
const PORT = process.env.PORT || 5005;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

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
app.use("/messages", messagesRouter);
app.use("/autoComplete", autoCompleteRouter);

server = app.listen(PORT, () => {
  console.log("server is running");
});
