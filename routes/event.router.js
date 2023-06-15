const express = require("express");
const router = express.Router();
const axios = require("axios");
const dd = require("dump-die");
const models = require("../models/index");
const authMiddleware = require("../authMiddleware");

router.use(authMiddleware);

router.post("/create", async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const formattedDate = new Date(date).toISOString().split("T")[0];

    if (title && description && date) {
      const existingEvent = await models.event.findOne({
        where: { title, description, date: formattedDate },
      });

      if (existingEvent) {
        return res.status(400).json({ message: "Event already exists" });
      }

      const newEvent = await create({
        title,
        description,
        date: formattedDate,
      });

      return res.status(201).json(newEvent);
    }

    return res.status(400).json({ message: "Invalid event creation data" });
  } catch (error) {
    return res.status(400).json({ message: "Error during event creation" });
  }
});

router.get("/", async (req, res) => {
  try {
    const calendarID = req.calendar.id;
    const token = req.headers.authorization;

    const response = await axios.get(
      `http://localhost:3001/events?calendar_id=${calendarID}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const listOfEvents = response.data;
    res.json(listOfEvents);
  } catch (error) {
    console.error("Error retrieving events:", error);
    res.status(500).json({ message: "Failed to retrieve events" });
  }
});

router.delete("/:eventId", async (req, res) => {
  const eventId = req.params.eventId;
  try {
    const event = await models.event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    await event.destroy();
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Failed to delete event" });
  }
});

router.put("/:eventId", async (req, res) => {
  const { eventId } = req.params;
  const { title, description, date } = req.body;
  const formattedDate = new Date(date).toISOString().split("T")[0];

  try {
    const event = await models.event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await event.update({
      title,
      description,
      date: formattedDate,
    });

    res.json(event);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Failed to update event" });
  }
});

module.exports = router;
