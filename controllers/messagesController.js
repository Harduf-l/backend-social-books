const Conversation = require("../model/conversation");
const Message = require("../model/message");

exports.newConversation = async (req, res) => {
  const newConversationObject = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedConversation = await newConversationObject.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getConversationsOfUser = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.checkIfConversationAlreadyExist = async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $all: [req.params.userId, req.params.friendId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.addMessage = async (req, res) => {
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
};
