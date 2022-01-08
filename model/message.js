const mongoose = require("mongoose");

const MessagesSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    sender: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  { collection: "messages", timestamps: true }
);

const model = mongoose.model("MessagesSchema", MessagesSchema);
module.exports = model;
