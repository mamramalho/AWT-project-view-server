const { User } = require("../models.js/user");
const { Calendar } = require("../models.js/calendar");
const { Event } = require("../models.js/event");
const { Invite } = require("../models.js/invite");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.post("/create", auth, async (req, res) => {
  try {
    const event = new Event(req.body);
    event.userEvent = req.user._id;

    const calendar = await Calendar.find({ userCalendar: req.user._id });
    if (!calendar) {
      return res.status(400).send("Calendar not found");
    }

    event.calendarEvent = calendar._id;
    await event.save();

    res.send(event);
  } catch (error) {
    console.log(error);
    res.send("An error occurred on creating event");
  }
});

router.put("/:eventId/alter", auth, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { title, description, date } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(400).send("Event not found");

    event.title = title;
    event.description = description;
    event.date = date;
    await event.save();

    res.send(event);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while modifying the event");
  }
});

router.post("/:eventId/invite", auth, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { recipientEmail, message } = req.body;

    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) {
      return res.status(404).send("Recipient email not found");
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).send("Event not found");
    }

    const invite = new Invite({
      recipientId: recipient._id,
      recipientEmail,
      message,
    });

    await invite.save();

    // Send notification to recipient's email
    // Implement your logic for sending notifications here

    res.send(invite);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while sending the invite");
  }
});

router.delete("/:eventId/delete", auth, async (req, res) => {
  try {
    const eventId = req.params.eventId;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).send("Event not found");
    }

    await Event.findByIdAndRemove(eventId);

    res.send("Event deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while deleting the event");
  }
});

module.exports = router;
