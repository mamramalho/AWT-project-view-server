const { User } = require("../models.js/user");
const { Calendar } = require("../models.js/calendar");
const { Event } = require("../models.js/event");
const { Invite } = require("../models.js/invite");
const auth = require("../middleware/auth");
const express = require("express");
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

    const event = invite.eventInfo;

    const recipientEvent = new Event({
      title: event.title,
      description: event.description,
      date: event.date,
      userEvent: req.user._id,
    });

    await recipientEvent.save();
    await Invite.findByIdAndRemove(inviteId);

    res.send(recipientEvent);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while accepting the invite");
  }
});

router.delete("/:inviteId/decline", auth, async (req, res) => {
  try {
    const inviteId = req.params.inviteId;

    const invite = await Invite.findById(inviteId);
    if (!invite) {
      return res.status(404).send("Invite not found");
    }

    await Invite.findByIdAndRemove(inviteId);

    res.send("Invite deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while deleting the invite");
  }
});

module.exports = router;
