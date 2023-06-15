const express = require("express");
const router = express.Router();
const models = require("../models/index");
const authMiddleware = require("../authMiddleware");
const dd = require("dump-die");

router.use(authMiddleware);

router.get("/:id", async (req, res) => {
  const userId = req.user.id;
  const calendar_id = req.params.id;

  try {
    const calendar = await models.calendar.findOne({
      where: { id: calendar_id, userId: userId },
    });

    if (!calendar) {
      return res.status(404).json({ message: "Calendar not found" });
    }

    res.json(calendar);
  } catch (error) {
    console.error("Error retrieving calendar:", error);
    res.status(500).json({ message: "Error retrieving calendar" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    const calendar = await create({
      name,
      userId,
    });

    res.status(201).json(calendar);
  } catch (error) {
    console.error("Error creating calendar:", error);
    res.status(400).json({ message: "Error creating calendar" });
  }
});

module.exports = router;
