const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const models = require("../models/index");
const dd = require("dump-die");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (name && email && password) {
      const existingUser = await models.user.findOne({
        where: { email },
      });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const newUser = await models.user.createUser(req.body);

      const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.status(201).json({ user: newUser, token });
    }

    return res.status(400).json({ message: "Invalid user registration data" });
  } catch (error) {
    return res.status(500).json({ message: "Error during user registration" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await models.user.authenticate(email, password);

    if (user.error) {
      return res.status(500).json({ message: user.error });
    }

    const secretKey = process.env.JWT_SECRET;
    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1h" });

    return res.status(200).json({ user, token });
  } catch (error) {
    return res.status(500).json({ message: "Error during login" });
  }
});

module.exports = router;
