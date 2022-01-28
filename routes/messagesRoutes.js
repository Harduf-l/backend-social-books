const express = require("express");
const router = express.Router();
const messagesController = require("../controllers/messagesController");

//get conversations of specific users
router.get(
  "/get-all-conversations/:userId",
  messagesController.getConversationsOfUser
);

router.get(
  "/get-single-conversation/:convId/:userId",
  messagesController.getSingleConversation
);

router.get(
  "/update-should-see/:conversationId",
  messagesController.updateShouldSee
);

// post a message
router.post("/add-message", messagesController.addMessage);

module.exports = router;
