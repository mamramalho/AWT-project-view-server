const express = require("express");
const router = express.Router();
const { Events } = require("../models");

router.get("/", async (req, res) => {
  try {
    const userId = req.user.id; // Assuming the user object with ID is available in req.user
    const listOfEvents = await Events.findAll({ where: { userId } });
    res.json(listOfEvents);
  } catch (error) {
    console.error("Error retrieving events:", error);
    res.status(500).json({ message: "Failed to retrieve events" });
  }
});

router.delete("/:eventId", async (req, res) => {
  const eventId = req.params.eventId;
  try {
    const event = await Events.findByPk(eventId);
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

router.post("/", async (req, res) => {
  const { title, description, date } = req.body;
  const formattedDate = new Date(date).toISOString().split("T")[0];

  try {
    const userId = req.user.id; // Assuming the user ID is provided in the request body
    const newEvent = await Events.create({
      title,
      description,
      date: formattedDate,
      userId,
    });
    res.status(201).json(newEvent);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error creating event" });
  }
});

router.put("/:eventId", async (req, res) => {
  const { eventId } = req.params;
  const { title, description, date } = req.body;
  const formattedDate = new Date(date).toISOString().split("T")[0];

  try {
    const event = await Events.findByPk(eventId);
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
