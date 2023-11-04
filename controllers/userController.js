const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const { addUserPhoto, removeUserPhoto } = require("../helpers/cloudinary");
const {
  pendingConnections,
  friendsArrayId,
} = require("./connectionController");

const {
  chooseRandomAmount,
  getRecommendedBooksBasedOnGenres,
} = require("../utils");

const { sendWelcomeMessage } = require("./messagesController");

exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const foundUser = await User.findById(id);
    res.status(200).json(foundUser);
  } catch {
    res.status(401).json({ message: "user not found" });
  }
};

exports.tokenCheckNoData = async (req, res) => {
  const { token } = req.body;
  if (token) {
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      const _id = user.id;
      await User.findById(_id);

      res.status(200).json({
        status: "ok",
      });
    } catch {
      res.staus(500).json({ status: "error", error: "access blocked" });
    }
  } else {
    res.status(500).json({ status: "not connected" });
  }
};

exports.tokenCheck = async (req, res) => {
  const { token } = req.body;

  if (token) {
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      const _id = user.id;

      const foundUser = await User.findById(_id);

      delete foundUser.password;
      let suggestedUsers = [];
      suggestedUsers = await User.find({
        genres: { $in: foundUser.genres },
        email: { $ne: foundUser.email },
      });

      ///////////
      ///need to generate array of user friends id's, so we can filter them from the random friends suggestions

      const arrayOfIds = await friendsArrayId(foundUser._id);

      suggestedUsers = suggestedUsers.filter(
        (user) => !arrayOfIds.includes(user._id.toString())
      );

      //////////
      suggestedUsers = chooseRandomAmount(suggestedUsers, 6);

      const recommendationBookArray = await getRecommendedBooksBasedOnGenres(
        foundUser.genres
      );

      const myPendingConnections = await pendingConnections(foundUser._id);

      res.json({
        status: "ok",
        userDetails: foundUser,
        suggestedUsers,
        recommendationBookArray,
        myPendingConnections,
      });
    } catch {
      res.json({ status: "error", error: "access blocked" });
    }
  } else {
    console.log("didn't get access");
    res.status(500).json({ status: "not connected" });
  }
};

exports.login = async (req, res) => {
  const { password, email } = req.body;

  const foundUser = await User.findOne({ email }).lean();
  if (!foundUser) {
    return res.json({ status: "error", error: "invalid username/password" });
  }
  if (await bcrypt.compare(password, foundUser.password)) {
    // the username password is correct
    const token = jwt.sign(
      { id: foundUser._id, email: foundUser.email },
      process.env.JWT_SECRET
    );
    delete foundUser.password;

    let suggestedUsers = [];
    suggestedUsers = await User.find({
      genres: { $in: foundUser.genres },
      email: { $ne: foundUser.email },
    });

    ///////////
    ///need to generate array of user friends id's, so we can filter them from the random friends suggestions

    const arrayOfIds = await friendsArrayId(foundUser._id);

    suggestedUsers = suggestedUsers.filter(
      (user) => !arrayOfIds.includes(user._id.toString())
    );

    //////////

    suggestedUsers = chooseRandomAmount(suggestedUsers, 6);
    const recommendationBookArray = await getRecommendedBooksBasedOnGenres(
      foundUser.genres
    );

    const myPendingConnections = await pendingConnections(foundUser._id);

    return res.send({
      status: "ok",
      token: token,
      userDetails: foundUser,
      suggestedUsers,
      recommendationBookArray,
      myPendingConnections,
    });
  } else {
    return res.json({ status: "error", error: "invalid username/password" });
  }
};

////////////////
//////////////////
/////////////////////////////////

exports.addUser = async (req, res) => {
  const { password } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);

  let imageResponse;

  try {
    imageResponse = await addUserPhoto(req.body.picture);
  } catch (err) {
    console.log(err);
    imageResponse = null;
  }

  const newUser = {
    ...req.body,
    picture: imageResponse ? imageResponse.url : null,
    public_picture_id: imageResponse ? imageResponse.public_id : null,
    password: encryptedPassword,
  };

  try {
    const user = await User.create(newUser);
    delete user.password;

    let suggestedUsers = [];

    suggestedUsers = await User.find({
      genres: { $in: user.genres },
      email: { $ne: user.email },
    });

    ///////////
    ///need to generate array of user friends id's, so we can filter them from the random friends suggestions

    const arrayOfIds = await friendsArrayId(user._id);

    suggestedUsers = suggestedUsers.filter(
      (user) => !arrayOfIds.includes(user._id.toString())
    );

    //////////
    suggestedUsers = chooseRandomAmount(suggestedUsers, 6);

    const recommendationBookArray = await getRecommendedBooksBasedOnGenres(
      user.genres
    );

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET
    );

    const welcomeMessage = await sendWelcomeMessage(user);

    return res.json({
      status: "ok",
      userDetails: user,
      suggestedUsers,
      recommendationBookArray,
      token,
      welcomeMessage,
    });
  } catch (error) {
    // first, let's remove image from cloudinary
    if (imageResponse) {
      removeUserPhoto(imageResponse.public_id);
    }

    ///
    if (error.code === 11000) {
      //means it's duplicate key (user tried to register with same email)
      return res.json({ status: "error", error: "Duplicated email" });
    }
    // we don't know why there is an error
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
};

exports.updateUserPhoto = async (req, res) => {
  try {
    let imageResponse;

    imageResponse = await addUserPhoto(req.body.imgValue);

    console.log("img response is .... ", imageResponse);

    await User.findOneAndUpdate(
      { email: req.body.userEmail },
      { picture: imageResponse ? imageResponse.url : null }
    );

    // if (req.body.formerPicture) {
    //   await removeUserPhoto(req.body.formerPicture);
    // }

    res.status(200).json("image updated successfully server side");
  } catch (err) {
    console.log("error in update user photo function", err);
    res.status(500).json(err);
  }
};

exports.updateUserBasicDetails = async (req, res) => {
  const { email, city, favoriteWriter, genres } = req.body.userDataObject;
  try {
    await User.findOneAndUpdate(
      { email },
      {
        city,
        favoriteWriter,
        genres,
      }
    );
    res.status(200).json("details were updated successfully");
  } catch (err) {
    console.log("error occured...", err);
    res.status(500).json(err);
  }
};
