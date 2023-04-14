const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const db = require("./models");

//routes
const userRouter = require("./routes/Users");
app.use("/user", userRouter);
const calendarRouter = require("./routes/Calendar");
app.use("/calendar", calendarRouter);
const eventRouter = require("./routes/Events");
app.use("/event", eventRouter);
const inviteRouter = require("./routes/Invites");
app.use("/invite", inviteRouter);

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("Server is running on port 3001");
  });
});
