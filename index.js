require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const authMiddleware = require("./authMiddleware");
const logger = require("./logger");
const db = require("./models");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(authMiddleware);

const userRouter = require("./routes/user.router");
app.use("/user", userRouter);

const calendarRouter = require("./routes/calendar.router");
app.use("/calendar", calendarRouter);

const eventRouter = require("./routes/event.router");
app.use("/event", eventRouter);

const inviteRouter = require("./routes/invite.router");
app.use("/invite", inviteRouter);

db.sequelize.sync({ force: "true" }).then(() => {
  app.listen(3001, () => {
    logger.info("Server is running on port 3001");
  });
});
