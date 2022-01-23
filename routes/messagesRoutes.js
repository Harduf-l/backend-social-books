const express = require("express");
const router = express.Router();
const messagesController = require("../controllers/messagesController");
const Conversation = require("../model/conversation");

// post new conversation
router.post("/new-conversation", messagesController.newConversation);

//get conversations of specific users
router.get(
  "/get-all-conversations/:userId",
  messagesController.getConversationsOfUser
);

router.get("/checking/:userId", async (req, res) => {
  try {
    const results = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json("error");
  }
});

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

// get messages
// router.get("/get-messages/:conversationId", messagesController.getMessages);

module.exports = router;
