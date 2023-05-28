require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const passport = require("./passport");
const LocalStrategy = require("passport-local").Strategy;
const { Sequelize } = require("sequelize");
const authMiddleware = require("./authMiddleware");
const logger = require("./logger");

const sequelize = new Sequelize("AWTDB", "root", "password", {
  host: "127.0.0.1",
  dialect: "mysql",
});

const Users = require("./models/Users")(sequelize, Sequelize);
const Calendar = require("./models/Calendar")(sequelize, Sequelize);
const Events = require("./models/Events")(sequelize, Sequelize);

Users.associate({ Calendar });
Calendar.associate({ Users });
Events.associate({ Calendar });

app.use(cors());

app.use(express.json());
app.use(express.urlencoded());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

passport.debug = true;
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy({ usernameField: "email" }, Users.authenticate())
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Users.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

const userRouter = require("./routes/Users");
app.use("/user", userRouter);

const calendarRouter = require("./routes/Calendar");
app.use("/calendar", calendarRouter);

const eventRouter = require("./routes/Events");
app.use("/event", eventRouter);

const inviteRouter = require("./routes/Invites");
app.use("/invite", inviteRouter);

app.use(authMiddleware);

sequelize.sync().then(() => {
  app.listen(3001, () => {
    logger.info("Server is running on port 3001");
  });
});
