const { User, validate } = require("../models.js/user");
const { Calendar } = require("../models.js/calendar");
const { Event } = require("../models.js/event");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email is already registered");
    }

    const user = new User(req.body);
    const calendar = new Calendar();
    calendar.userCalendar = user._id;

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    await calendar.save();

    res.send({ user, calendar });
  } catch (error) {
    console.log(error);
    res.send("An error occurred on register");
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -__v");
    res.send(user);
  } catch (error) {
    console.log(error);
    res.send("An error occurred while logging in");
  }
});

router.get("/calendar", auth, async (req, res) => {
  try {
    const calendars = await Calendar.find({ userCalendar: req.user._id });

    res.send(calendars);
  } catch (error) {
    console.log(error);
    res.send("An error occurred while getting calendar");
  }
});

router.get("/events", auth, async (req, res) => {
  try {
    const events = await Event.find({ userEvent: req.user._id });

    res.send(events);
  } catch (error) {
    console.log(error);
    res.send("An error occurred while getting events");
  }
});

module.exports = router;
