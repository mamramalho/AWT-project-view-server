const express = require("express");
const router = express.Router();
const { Events } = require("../models");

router.get("/", async (req, res) => {
  const listOfEvents = await Events.findAll();
  res.json(listOfEvents);
});

router.post("/", async (req, res) => {
  const event = req.body;
  await Events.create(event);
  res.json(event);
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

/* router.get("/", async (req, res) => {
  const userId = req.user.id; // Assuming you have a user object with an ID property
  const listOfEvents = await Events.findAll({ where: { userId } });
  res.json(listOfEvents);
});

router.post("/", async (req, res) => {
  const userId = req.user.id; // Assuming you have a user object with an ID property
  const event = { ...req.body, userId };
  await Events.create(event);
  res.json(event);
}); */

module.exports = router;
