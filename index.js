const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: "18469576cd2c92ae2c59ca32ac5132682f8b00472d76d16fe41a1126892a36b6",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

const authMiddleware = require("./middlewares/authMiddleware");
const db = require("./models");

const userRouter = require("./routes/Users");
app.use("/user", userRouter);
const calendarRouter = require("./routes/Calendar");
app.use("/calendar", calendarRouter);
const eventRouter = require("./routes/Events");
app.use("/event", authMiddleware, eventRouter);
const inviteRouter = require("./routes/Invites");
app.use("/invite", inviteRouter);

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("Server is running on port 3001");
  });
});
