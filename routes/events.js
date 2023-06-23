const { User } = require("../models.js/user");
const { Calendar } = require("../models.js/calendar");
const { Event } = require("../models.js/event");
const { Invite } = require("../models.js/invite");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const { sendEmail } = require("../emailUtils");
const cron = require("node-cron");

router.post("/create", auth, async (req, res) => {
  try {
    const { title, date, description, address, latitude, longitude } = req.body;
    const event = new Event({
      title,
      date,
      description,
      userEvent: req.user._id,
    });

    if (address) {
      event.address = address;
    }

    if (latitude && longitude) {
      event.latitude = latitude;
      event.longitude = longitude;
    }

    const calendar = await Calendar.findOne({ userCalendar: req.user._id });
    if (!calendar) {
      return res.status(400).send("Calendar not found");
    }

    event.calendarEvent = calendar._id;
    await event.save();

    res.send(event);
  } catch (error) {
    console.log(error);
    res.send("An error occurred while creating the event");
  }
});

router.put("/:eventId/alter", auth, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { title, description, date } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(400).send("Event not found");

    event.title = title;
    event.description = description;
    event.date = date;
    await event.save();

    res.send(event);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while modifying the event");
  }
});

router.post("/:eventId/invite", auth, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { recipientEmail, message } = req.body;

    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) {
      return res.status(404).send("Recipient email not found");
    }

    const event = await Event.findById(eventId).populate("userEvent");
    if (!event) {
      return res.status(404).send("Event not found");
    }

    const existingInvite = await Invite.findOne({
      eventId,
      recipientId: recipient._id,
    });
    if (existingInvite) {
      return res
        .status(400)
        .send("Recipient has already been invited to this event");
    }

    const sender = event.userEvent;
    if (!sender) {
      return res.status(404).send("Sender not found");
    }
    const invite = new Invite({
      recipientId: recipient._id,
      recipientEmail,
      message,
      senderName: sender.name,
      eventInfo: {
        title: event.title,
        description: event.description,
        date: event.date,
      },
    });

    await invite.save();

    const emailSubject = `You have been invited to an event: ${event.title}`;
    const emailContent = `
      <h2>Invitation</h2>
      <p>${invite.senderName} has invited you to the following event:</p>
      <h3>${event.title}</h3>
      <p>${event.description}</p>
      <p>Date: ${event.date}</p>
      <p>${invite.message}</p>
    `;
    await sendEmail(recipientEmail, emailSubject, emailContent);

    res.send(invite);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while sending the invite");
  }
});

router.delete("/:eventId/delete", auth, async (req, res) => {
  try {
    const eventId = req.params.eventId;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).send("Event not found");
    }

    await Event.findByIdAndRemove(eventId);

    res.send("Event deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while deleting the event");
  }
});

router.get("/send-notification", auth, async (req, res) => {
  try {
    const events = await Event.find({
      date: { $gte: new Date().toISOString(), $lte: new Date().toISOString() },
    }).populate("userEvent");

    for (const event of events) {
      const users = await User.find({ _id: event.userEvent });

      for (const user of users) {
        const recipientEmail = user.email;
        const subject = "Event Reminder";
        const message = `Dear ${user.name},\n\nThis is a reminder that you have an upcoming event: ${event.title}. It will take place on ${event.date}.\n\nRegards,\nThe Event Team`;

        sendEmail(recipientEmail, subject, message);
      }
    }

    res.status(200).send("Email notifications sent successfully.");
  } catch (error) {
    console.error("Error sending email notifications:", error);
    res
      .status(500)
      .send("An error occurred while sending email notifications.");
  }
});

cron.schedule("0 9 * * *", () => {
  router.get("/send-notification");
});

module.exports = router;
