const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  { collection: "conversations" }
);

const model = mongoose.model("ConversationSchema", ConversationSchema);
module.exports = model;
