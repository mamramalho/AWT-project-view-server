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
/* 
// server/routes/events.js

const express = require("express");
const router = express.Router();
const { Events, Users } = require("../models");
const authMiddleware = require("../authMiddleware");
const { Op } = require("sequelize");

router.use(authMiddleware);

// POST /events/invite
router.post("/invite", async (req, res) => {
  const { eventId, email } = req.body;
  const userId = req.user.id;

  try {
    // Check if the email is already in the database
    const invitedUser = await Users.findOne({ where: { email } });
    if (invitedUser) {
      // Check if the user is already invited to the event
      const event = await Events.findOne({
        where: { events_id: eventId },
        include: [{ model: Users }],
      });
      const invitedUsers = event.Users;
      const isAlreadyInvited = invitedUsers.some(
        (user) => user.email === email
      );

      if (isAlreadyInvited) {
        return res
          .status(400)
          .json({ message: "User is already invited to the event" });
      }

      // Invite the user to the event
      await event.addUser(invitedUser);
      return res.json({ message: "User invited successfully" });
    }

    return res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.error("Error inviting user:", error);
    res.status(500).json({ message: "Error inviting user" });
  }
});

module.exports = router;
 */

module.exports = router;
