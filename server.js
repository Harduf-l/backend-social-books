require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
const bookRouter = require("./routes/bookRouter");
const messagesRouter = require("./routes/messagesRoutes");
const app = express();
const PORT = process.env.PORT || 5005;

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
app.use("/messages", messagesRouter);

const server = app.listen(PORT, () => {
  console.log("server is running");
});

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

let usersOnline = [];

const addUser = (userId, socketId) => {
  !usersOnline.some((user) => user.userId === userId) &&
    usersOnline.push({ userId, socketId });
};

const removeUser = (socketId) => {
  usersOnline = usersOnline.filter((user) => user.socketId !== socketId);
};

io.on("connection", (socket) => {
  console.log("connected to backend socket");
  io.emit("welcome", "hello this is from backend socket");

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", usersOnline);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", usersOnline);
  });
});
