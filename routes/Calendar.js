const express = require("express");
const router = express.Router();
const { Calendar } = require("../models");

router.get("/", async (req, res) => {
  const user_id = req.user.id;
  try {
    const listOfCalendar = await Calendar.findAll({
      where: { user_id: user_id },
    });
    res.json(listOfCalendar);
  } catch (error) {
    console.error("Error retrieving calendars:", error);
    res.status(500).json({ message: "Error retrieving calendars" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const user_id = req.user.id;

    const calendar = await Calendar.create({
      name,
      user_id,
    });

    res.status(201).json(calendar);
  } catch (error) {
    console.error("Error creating calendar:", error);
    res.status(400).json({ message: "Error creating calendar" });
  }
});

module.exports = router;
