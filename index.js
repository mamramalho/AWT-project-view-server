require("dotenv").config();
const invites = require("./routes/invites");
const events = require("./routes/events");
const users = require("./routes/users");
const auth = require("./routes/auth");
const connection = require("./db");
const express = require("express");
const app = express();

connection();

app.use(express.json());

app.use("/user", users);
app.use("/auth", auth);
app.use("/event", events);
app.use("/invite", invites);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log("Listening on port 8080..."));
