const Connection = require("../model/connection");
const User = require("../model/user");

exports.sendConnectionRequest = async (req, res) => {
  console.log(req.body);

  const checkIfConnectionExist = await Connection.find({
    senderId: req.body.senderId,
    receiverId: req.body.receiverId,
  });

  const checkIfConnectionExistOpposite = await Connection.find({
    senderId: req.body.receiverId,
    receiverId: req.body.senderId,
  });

  if (checkIfConnectionExist[0] || checkIfConnectionExistOpposite[0]) {
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
    console.log(updated);
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteConnectionRequest = async (req, res) => {
  console.log(req.body);
  try {
    const removedRequest = await Connection.findOneAndDelete({
      _id: req.body.connectionId,
    });
    res.status(200).json(removedRequest);
  } catch (err) {
    res.send(500).json(err);
  }
};

exports.allApprovedConnection = (req, res) => {};

exports.pendingConnections = async (userId) => {
  try {
    const requestsPending = await Connection.find({
      receiverId: userId,
      approved: false,
    });

    var requestsPendingWithUsersData = await Promise.all(
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
