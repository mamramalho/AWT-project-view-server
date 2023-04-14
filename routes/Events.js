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

module.exports = router;
