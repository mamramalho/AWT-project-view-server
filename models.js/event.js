const { boolean } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
    required: false,
  },
  latitude: {
    type: Number,
    required: false,
  },
  longitude: {
    type: Number,
    required: false,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
  },
  userEvent: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  calendarEvent: {
    type: Schema.Types.ObjectId,
    ref: "calendar",
  },
  inviteEvent: {
    type: Schema.Types.ObjectId,
    ref: "invite",
  },
});

const Event = mongoose.model("event", eventSchema);

module.exports = { Event };
