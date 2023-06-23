const { Invite } = require("../models.js/invite");
const { User } = require("../models.js/user");
const { Calendar } = require("../models.js/calendar");
const { Event } = require("../models.js/event");
const auth = require("../middleware/auth");
const express = require("express");
const { Logger } = require("winston");
const router = express.Router();

router.get("/incoming", auth, async (req, res) => {
  try {
    const invites = await Invite.find({ recipientId: req.user._id });
    if (!invites) return res.status(404).send("You have no invites.");

    res.send(invites);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while retrieving incoming invites");
  }
});

router.post("/:inviteId/accept", auth, async (req, res) => {
  try {
    const inviteId = req.params.inviteId;

    const invite = await Invite.findById(inviteId);
    if (!invite) {
      return res.status(404).send("Invite not found");
    }

    invite.status = "accepted";
    await invite.save();

    const event = await Event.findById(invite.eventId);
    if (!event) {
      return res.status(404).send("Event not found");
    }

    const recipientEvent = new Event({
      ...event.toObject(),
      _id: undefined,
      userEvent: req.user._id,
    });

    await recipientEvent.save();

    res.send(recipientEvent);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while accepting the invite");
  }
});

router.post("/:inviteId/decline", auth, async (req, res) => {
  try {
    const inviteId = req.params.inviteId;

    const invite = await Invite.findById(inviteId);
    if (!invite) {
      return res.status(404).send("Invite not found");
    }

    invite.status = "declined";
    await invite.save();

    await Invite.findByIdAndDelete(inviteId);

    res.send("Invite declined and deleted");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while declining the invite");
  }
});

module.exports = router;
