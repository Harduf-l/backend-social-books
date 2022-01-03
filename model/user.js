const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, reuired: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    favoriteWriter: { type: String, required: true },
    picture: { type: String, required: true },
  },
  { collection: "users" }
);

const model = mongoose.model("UserSchema", UserSchema);
module.exports = model;
