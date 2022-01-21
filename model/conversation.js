const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
    messages: [
      {
        senderId: {
          type: String,
        },
        receiverId: {
          type: String,
        },
        text: {
          type: String,
        },
        createdAt: { type: Date },
      },
    ],
    shouldSee: { personId: String, count: Number },
    updatedAt: { type: Date },
  },
  { collection: "conversations" }
);

const model = mongoose.model("ConversationSchema", ConversationSchema);
module.exports = model;
