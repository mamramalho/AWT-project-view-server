const express = require("express");
const router = express.Router();
const { Users } = require("../models");

router.post("/", async (req, res) => {
  const { name, email, password, repeatPassword } = req.body;

  if (password !== repeatPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  const existingUser = await Users.findOne({ where: { email } });
  if (existingUser) {
    return res
      .status(400)
      .json({ error: "User with this email already exists" });
  }

  const newUser = await Users.create({ name, email, password });
  res.json(newUser);
});

module.exports = router;
