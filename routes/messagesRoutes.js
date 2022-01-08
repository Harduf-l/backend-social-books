const express = require("express");
const router = express.Router();
const messagesController = require("../controllers/messagesController");

// post new conversation
router.post("/new-conversation", messagesController.newConversation);

//get conversations of specific users
router.get(
  "/get-all-conversations/:userId",
  messagesController.getConversationsOfUser
);

// post a message
router.post("/add-message", messagesController.addMessage);

// get messages
router.get("/get-messages/:conversationId", messagesController.getMessages);

module.exports = router;
