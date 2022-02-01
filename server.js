require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
const bookRouter = require("./routes/bookRouter");
const postsRouter = require("./routes/postRouter");
const generalRouter = require("./routes/generalRouter");
const connectionRouter = require("./routes/connectionsRouter");
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
app.use("/posts", postsRouter);
app.use("/messages", messagesRouter);
app.use("/autoComplete", autoCompleteRouter);
app.use("/connections", connectionRouter);
app.use("/general", generalRouter);
const server = app.listen(PORT, () => {
  console.log("server is running");
});

///// socket section ///////////////

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const usersOnline = {};

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    removeSpecificSocket(socket.id);
    let objectOfOnlineId = getOnlineObject();
    io.emit("userDisconnected", objectOfOnlineId);
  });

  socket.on("addUser", (userId) => {
    usersOnline[userId] = socket.id;

    let objectOfOnlineId = getOnlineObject();
    io.emit("onlineArray", objectOfOnlineId);
  });

  socket.on("messageSend", (message) => {
    const receiverSocket = getReceiverSocket(message.receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("newMessage", message);
    }
  });

  socket.on("userIsTyping", (details) => {
    const receiverSocket = getReceiverSocket(details.receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("newTypingEvent", details.convId);
    }
  });

  socket.on("friendRequestSend", (friendRequest) => {
    const receiverSocket = getReceiverSocket(friendRequest.idOfReceiver);

    if (receiverSocket) {
      io.to(receiverSocket).emit("newFriendRequest", friendRequest);
    }
  });

  socket.on("userLogout", (userId) => {
    delete usersOnline[userId];
    let objectOfOnlineId = getOnlineObject();
    io.emit("userDisconnected", objectOfOnlineId);
  });
});

const getReceiverSocket = (reveiverId) => {
  const socketsList = Object.keys(usersOnline);

  for (let i = 0; i < socketsList.length; i++) {
    if (socketsList[i] === reveiverId) {
      return usersOnline[socketsList[i]];
    }
  }
  return false;
};

const removeSpecificSocket = (socketId) => {
  const socketsList = Object.keys(usersOnline);

  for (let i = 0; i < socketsList.length; i++) {
    if (usersOnline[socketsList[i]] === socketId) {
      delete usersOnline[socketsList[i]];
    }
  }
};

const getOnlineObject = () => {
  const idOnlineArray = Object.keys(usersOnline);
  let onlineObj = {};
  idOnlineArray.forEach((id) => {
    onlineObj[id] = true;
  });
  return onlineObj;
};
