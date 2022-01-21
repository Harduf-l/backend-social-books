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
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getConversationsOfUser = async (req, res) => {
  try {
    const conversations = await Conversation.aggregate([
      { $match: { members: { $in: [req.params.userId] } } },
    ]);

    let numberOfUnseenMessages = 0;

    const conversationsWithFriendData = await Promise.all(
      conversations.map(async (item) => {
        let friendId;
        if (item.members[0] === req.params.userId) {
          friendId = item.members[1];
        } else {
          friendId = item.members[0];
        }
        if (item.shouldSee.personId === req.params.userId) {
          numberOfUnseenMessages++;
        }
        const userData = await User.findById(friendId);
        return {
          ...item,
          pictureOfFriend: userData.picture,
          nameOfFriend: userData.username,
          idOfFriend: userData._id,
        };
      })
    );

    conversationsWithFriendData.sort(
      (a, b) => a.updatedAt.getTime() - b.updatedAt.getTime()
    );

    res
      .status(200)
      .json({ conversationsWithFriendData, numberOfUnseenMessages });
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
