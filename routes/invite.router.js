const express = require("express");
const router = express.Router();
const models = require("../models/index");
const authMiddleware = require("../authMiddleware");
const dd = require("dump-die");

router.use(authMiddleware);

router.get("/", async (req, res) => {
  const listOfInvites = await models.invite.findAll();
  res.json(listOfInvites);
});

router.post("/", async (req, res) => {
  const invite = req.body;
  await create(invite);
  res.json(invite);
});

module.exports = router;
