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

router.get(
  "/update-should-see/:conversationId",
  messagesController.updateShouldSee
);

router.get(
  "/check-if-conversation-already-exist/:userId/:friendId",
  messagesController.checkIfConversationAlreadyExist
);
// post a message
router.post("/add-message", messagesController.addMessage);

module.exports = router;
