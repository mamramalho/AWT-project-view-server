require("dotenv").config();
const invites = require("./routes/invites");
const events = require("./routes/events");
const users = require("./routes/users");
const auth = require("./routes/auth");
const connection = require("./db");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

connection();

app.use(express.json());
app.use(
  cors({
    exposedHeaders: "x-auth-token", // Allow the "x-auth-token" header to be exposed
  })
);

app.get("/user/", function (req, res, next) {
  res.json({ msg: "This is CORS-enabled for all origins!" });
});

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-auth-token"
  );
  next();
});

app.use("/user", users);
app.use("/auth", auth);
app.use("/event", events);
app.use("/invite", invites);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log("Listening on port 8080..."));
