const { User } = require("../models.js/user");
const { Calendar } = require("../models.js/calendar");
const { Event } = require("../models.js/event");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.post("/create", auth, async (req, res) => {
  try {
    const event = new Event(req.body);
    event.userEvent = req.user._id;

    const calendar = await Calendar.findOne({ userCalendar: req.user._id });
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

router.put("/:eventId", auth, async (req, res) => {
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

router.delete("/:eventId", auth, async (req, res) => {
  try {
    const eventId = req.params.eventId;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).send("Event not found");
    }

    await event.remove();

    res.send("Event deleted");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while deleting the event");
  }
});

module.exports = router;
