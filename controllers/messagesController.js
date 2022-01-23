const Conversation = require("../model/conversation");
const User = require("../model/user");

exports.newConversation = async (req, res) => {
  const newConversationObject = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
    messages: [],
    shouldSee: { personId: "", count: 0 },
    updatedAt: Date.now(),
  });

  try {
    const savedConversation = await newConversationObject.save();

    const conversationPopulates = await Conversation.findById(
      savedConversation._id
    ).populate({
      path: "members",
      select: "username _id picture",
      match: { _id: { $ne: req.body.senderId } },
    });

    console.log(conversationPopulates);

    res.status(200).json(conversationPopulates);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getConversationsOfUser = async (req, res) => {
  console.log(req.params.userId);
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.params.userId] },
    }).populate({
      path: "members",
      select: "username _id picture",
      match: { _id: { $ne: req.params.userId } },
    });

    let numberOfUnseenMessages = 0;
    conversations.forEach((conv) => {
      if (conv.shouldSee.personId === req.params.userId) {
        numberOfUnseenMessages++;
      }
    });

    conversations.sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime());

    res.status(200).json({
      conversationsWithFriendData: conversations,
      numberOfUnseenMessages,
    });
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};

exports.updateShouldSee = async (req, res) => {
  const filter = { _id: req.params.conversationId };

  try {
    await Conversation.findOneAndUpdate(filter, {
      $set: { "shouldSee.count": 0, "shouldSee.personId": "" },
    });

    res.status(200).json("all messages are seen");
  } catch (err) {
    console.log("error here");
    res.status(500).json(err.response);
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
  const newMessage = {
    senderId: req.body.senderId,
    receiverId: req.body.receiverId,
    text: req.body.text,
    createdAt: Date.now(),
  };

  const filter = { _id: req.body.conversationId };

  try {
    await Conversation.findOneAndUpdate(filter, {
      $push: { messages: newMessage },
      $inc: { "shouldSee.count": 1 },
      $set: {
        "shouldSee.personId": req.body.receiverId,
        updatedAt: Date.now(),
      },
    });

    res.status(200).json("message was added");
  } catch (err) {
    res.status(500).json(err.response);
  }
};
