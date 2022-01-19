const mongoose = require("mongoose");

const ConnectionSchema = new mongoose.Schema(
  {
    senderId: { type: String },
    receiverId: { type: String },
    approved: { type: Boolean },
  },
  { collection: "connections" }
);

const model = mongoose.model("ConnectionSchema", ConnectionSchema);
module.exports = model;
