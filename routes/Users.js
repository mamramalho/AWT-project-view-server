const express = require("express");
const router = express.Router();
const { Users } = require("../models");

router.get("/", async (req, res) => {
  const listOfUsers = await Users.findAll();
  res.json(listOfUsers);
});

router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await Users.create({
      name,
      email,
      password,
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error creating user" });
  }
});

module.exports = router;
