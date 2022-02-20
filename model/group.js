const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema(
  {
    name: { type: String },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "PostSchema" }],
    tag: { type: String },
  },
  { collection: "groups" }
);

const model = mongoose.model("GroupSchema", GroupSchema);
module.exports = model;
