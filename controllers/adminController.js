const jwt = require("jsonwebtoken");
const User = require("../model/user");
const fs = require("fs");
const { pseudoRandomBytes } = require("crypto");

exports.getData = (req, res) => {
  fs.readFile("./data/names.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let parsedData = JSON.parse(data);

      parsedData.push({ name: "ari", age: 20 });

      fs.writeFile(
        "./data/names.json",
        JSON.stringify(parsedData),
        function (err) {
          if (err) throw err;
          console.log('The "data to append" was appended to file!');
        }
      );
    }
  });

  res.status(200).json("passed middleware");
};

exports.verifyAdminTokenMiddleWare = async (req, res, next) => {
  const { token } = req.body;

  if (token) {
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      const _id = user.id;

      const selectedUser = await User.findById(_id);
      if (selectedUser.email === process.env.MANAGER_EMAIL) {
        next();
      } else {
        res.status(500).json({ status: "error", error: "user is not manager" });
      }
    } catch (err) {
      res.status(500).json({ status: "error", error: "access blocked" });
    }
  } else {
    res.status(500).json("no token");
  }
};
