const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inviteSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: "event",
  },
  recipientId: {
    type: String,
  },
  recipientEmail: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending",
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Invite = mongoose.model("invite", inviteSchema);

module.exports = { Invite };
