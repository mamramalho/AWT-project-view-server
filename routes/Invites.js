const express = require("express");
const router = express.Router();
const { Invites } = require("../models");

router.get("/", async (req, res) => {
  const listOfInvites = await Invites.findAll();
  res.json(listOfInvites);
});

router.post("/", async (req, res) => {
  const invite = req.body;
  await Invites.create(invite);
  res.json(invite);
});

module.exports = router;
