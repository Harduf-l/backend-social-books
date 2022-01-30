const Connection = require("../model/connection");
const User = require("../model/user");

exports.connectionStatus = async (req, res) => {
  const checkIfConnectionExist = await Connection.find({
    $or: [
      { senderId: req.body.userId, receiverId: req.body.friendId },
      { senderId: req.body.friendId, receiverId: req.body.userId },
    ],
  });

  if (!checkIfConnectionExist[0]) {
    res.status(200).json("no connection");
    return;
  }

  if (checkIfConnectionExist[0].approved) {
    res.status(200).json("friendhip");
    return;
  }
  if (checkIfConnectionExist[0].senderId === req.body.userId) {
    res.status(200).json("friend request was sent");
    return;
  }
  if (checkIfConnectionExist[0].senderId === req.body.friendId) {
    res.status(200).json("respond to friend request");
    return;
  }
};

////

exports.sendConnectionRequest = async (req, res) => {
  const checkIfConnectionExist = await Connection.find({
    $or: [
      { senderId: req.body.senderId, receiverId: req.body.receiverId },
      { senderId: req.body.receiverId, receiverId: req.body.senderId },
    ],
  });

  if (checkIfConnectionExist[0]) {
    res.status(500).json("connection already exist");
  } else {
    const newConnection = new Connection({
      senderId: req.body.senderId,
      receiverId: req.body.receiverId,
      approved: false,
    });

    try {
      const savedConnection = await newConnection.save();
      res.status(200).json(savedConnection);
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

exports.approveConnectionRequest = async (req, res) => {
  try {
    const updated = await Connection.findOneAndUpdate(
      { _id: req.body.connectionId },
      { approved: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteConnectionRequest = async (req, res) => {
  try {
    const removedRequest = await Connection.findOneAndDelete({
      _id: req.body.connectionId,
    });
    res.status(200).json(removedRequest);
  } catch (err) {
    res.send(500).json(err);
  }
};

exports.allApprovedConnection = async (req, res) => {
  try {
    const requestsApproved = await Connection.find({
      $or: [
        { receiverId: req.params.userId, approved: true },
        { senderId: req.params.userId, approved: true },
      ],
    });

    var requestsApprovedWithUsersData = await Promise.all(
      requestsApproved.map(async (item) => {
        let userDataCheck;
        if (item.senderId === req.params.userId) {
          userDataCheck = item.receiverId;
        } else {
          userDataCheck = item.senderId;
        }
        const userData = await User.findById(userDataCheck);

        if (userData) {
          // it means the friend exist
          return {
            connectionId: item._id,
            picture: userData.picture,
            username: userData.username,
            _id: userData._id,
          };
        } else {
          // it means the friend deleted his account, so in client we shall show only connections
          // that have friend data in them
          return { connectionId: item._id };
        }
      })
    );

    res
      .status(200)
      .json({ approvedConnections: requestsApprovedWithUsersData });
  } catch (err) {
    res.status(500).json("no connections found");
  }
};

exports.friendsArrayId = async (userId) => {
  try {
    const requestsApproved = await Connection.find({
      $or: [
        { receiverId: userId, approved: true },
        { senderId: userId, approved: true },
      ],
    });
    let arrayOfFriendId = [];
    requestsApproved.forEach((connection) => {
      if (connection.senderId === userId) {
        arrayOfFriendId.push(connection.receiverId);
      } else {
        arrayOfFriendId.push(connection.senderId);
      }
    });
    return arrayOfFriendId;
  } catch (err) {
    return err;
  }
};

exports.pendingConnections = async (userId) => {
  try {
    const requestsPending = await Connection.find({
      receiverId: userId,
      approved: false,
    });

    const requestsPendingWithUsersData = await Promise.all(
      requestsPending.map(async (item) => {
        const userData = await User.findById(item.senderId);
        return {
          connectionId: item._id,
          pictureOfSender: userData.picture,
          nameOfSender: userData.username,
          idOfSender: item.senderId,
        };
      })
    );

    return requestsPendingWithUsersData;
  } catch (err) {
    return [];
  }
};
