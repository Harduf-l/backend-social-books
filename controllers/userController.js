const User = require("../model/user");
const path = require("path");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const {
  chooseRandomAmount,
  getRecommendedBooksBasedOnGenres,
} = require("../utils");

exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const foundUser = await User.findById(id);
    res.status(200).json(foundUser);
  } catch {
    res.status(401).json({ message: "user not found" });
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
      suggestedUsers = chooseRandomAmount(suggestedUsers, 5);

      const recommendationBookArray = await getRecommendedBooksBasedOnGenres(
        foundUser.genres
      );

      res.json({
        status: "ok",
        userDetails: foundUser,
        suggestedUsers,
        recommendationBookArray,
      });
    } catch {
      res.json({ status: "error", error: "access blocked" });
    }
  } else {
    res.json({ status: "not connected" });
  }
};

exports.login = async (req, res) => {
  const { password, email } = req.body;

  const user = await User.findOne({ email }).lean();
  if (!user) {
    return res.json({ status: "error", error: "invalid username/password" });
  }
  if (await bcrypt.compare(password, user.password)) {
    // the username password is correct
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET
    );
    delete user.password;

    let suggestedUsers = [];
    suggestedUsers = await User.find({
      genres: { $in: user.genres },
      email: { $ne: user.email },
    });

    suggestedUsers = chooseRandomAmount(suggestedUsers, 5);
    const recommendationBookArray = await getRecommendedBooksBasedOnGenres(
      foundUser.genres
    );

    return res.send({
      status: "ok",
      token: token,
      userDetails: user,
      suggestedUsers,
      recommendationBookArray,
    });
  } else {
    return res.json({ status: "error", error: "invalid username/password" });
  }
};

exports.addUser = async (req, res) => {
  const { password, genres } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);
  const genresArray = genres.split(",");
  console.log(req.body);
  const newUser = {
    ...req.body,
    picture: req.file ? req.file.filename : null,
    password: encryptedPassword,
    genres: genresArray,
  };

  try {
    const response = await User.create(newUser);
    delete response.password;

    let suggestedUsers = [];

    suggestedUsers = await User.find({
      genres: { $in: response.genres },
      email: { $ne: response.email },
    });
    suggestedUsers = chooseRandomAmount(suggestedUsers, 5);

    const recommendationBookArray = await getRecommendedBooksBasedOnGenres(
      foundUser.genres
    );

    return res.json({
      status: "ok",
      userDetails: response,
      suggestedUsers,
      recommendationBookArray,
    });
  } catch (error) {
    // first, deleting picture file because the user wasn't approved/created
    if (req.file) {
      const pathToDelete = path.join(__dirname, "public", req.file.filename);
      try {
        fs.unlinkSync(pathToDelete);
      } catch (err) {
        console.error(err);
      }
    }
    if (error.code === 11000) {
      //means it's duplicate key (user tried to register with same email)
      return res.json({ status: "error", error: "Duplicated email" });
    }
    // we don't know why there is an error
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
};
