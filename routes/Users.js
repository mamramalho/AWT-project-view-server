const express = require("express");
const router = express.Router();
const { Users, Calendar } = require("../models");
const bcrypt = require("bcrypt");
const passport = require("passport");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (name && email && password) {
      const newUser = await Users.createUser({ name, email, password });
      await Calendar.create({ name: "My Calendar", UserId: newUser.id });

      return res.status(201).json(newUser);
    }

    res.status(400).json({ message: "Invalid user registration data" });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ message: "Error during user registration" });
  }
});

router.post("/login", passport.authenticate("local"), async (req, res) => {
  try {
    const userId = req.user.id;

    res.redirect(`/calendar/${userId}`);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error during login" });
  }
});

module.exports = router;
