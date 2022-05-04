const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    userid: { type: mongoose.Schema.Types.ObjectId },
    senderid: { type: mongoose.Schema.Types.ObjectId },

    message: [
      {
        senderid: { type: mongoose.Schema.Types.ObjectId, required: true },
        content: { type: String },
        time: { type: String },
      },
     
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
