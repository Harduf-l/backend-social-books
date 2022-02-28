const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    favoriteWriter: { type: String },
    picture: { type: String },
    genres: { type: Array, required: true },
    birthday: { type: Object },
    country: { type: String },
    city: { type: String },
    freeText: { type: String },
    writingDescription: { type: String },
  },
  { collection: "users" }
);

const model = mongoose.model("UserSchema", UserSchema);
module.exports = model;
