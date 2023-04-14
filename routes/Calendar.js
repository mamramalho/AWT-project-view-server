const express = require("express");
const router = express.Router();
const { Calendar } = require("../models");

router.get("/", async (req, res) => {
  const listOfCalendar = await Calendar.findAll();
  res.json(listOfCalendar);
});

router.post("/", async (req, res) => {
  const calendar = req.body;
  await Calendar.create(calendar);
  res.json(calendar);
});

module.exports = router;
