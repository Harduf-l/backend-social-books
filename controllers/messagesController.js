const Conversation = require("../model/conversation");
const User = require("../model/user");

exports.getConversationsOfUser = async (req, res) => {
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

exports.addMessage = async (req, res) => {
  const newMessage = {
    senderId: req.body.senderId,
    receiverId: req.body.receiverId,
    text: req.body.text,
    createdAt: Date.now(),
  };
  if (req.body.createNewConversation) {
    try {
      const newConversationData = await newConversation(
        req.body.senderId,
        req.body.receiverId,
        newMessage
      );

      res.status(200).json({
        message: "conversation created successfully",
        newConverationCreated: newConversationData,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  } else {
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

      res.status(200).json({ message: "message was added" });
    } catch (err) {
      res.status(500).json(err);
    }
  }
};

const newConversation = async (senderId, receiverId, firstMessage) => {
  const newConversationObject = new Conversation({
    members: [senderId, receiverId],
    messages: [firstMessage],
    shouldSee: { personId: receiverId, count: 1 },
    updatedAt: Date.now(),
  });

  try {
    const savedConversation = await newConversationObject.save();

    const conversationPopulates = await Conversation.findById(
      savedConversation._id
    ).populate({
      path: "members",
      select: "username _id picture",
      match: { _id: { $ne: senderId } },
    });

    return conversationPopulates;
  } catch (err) {
    console.log(err);
  }
};
