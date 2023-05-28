const express = require("express");
const router = express.Router();
const { Users, Calendar } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("../passport");
const LocalStrategy = require("passport-local").Strategy;
require("dotenv").config({ path: "../.env" });
const logger = require("../logger");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await Users.findOne({ where: { email } });
        if (!user) {
          return done(null, false, { message: "Incorrect email" });
        }

        const isPasswordValid = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (!isPasswordValid) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
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

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (name && email && password) {
      const existingUser = await Users.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await Users.createUser({
        name,
        email,
        password: hashedPassword,
      });

      const secretKey = process.env.JWT_SECRET;
      const token = jwt.sign({ userId: newUser.id }, secretKey, {
        expiresIn: "1h",
      });

      return res.status(201).json({ user: newUser, token });
    }

    return res.status(400).json({ message: "Invalid user registration data" });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: "Error during user registration" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.authenticate(email, password);
    //logger.info(user);

    const secretKey = process.env.JWT_SECRET;
    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1h" });

    return res.status(200).json({ user, token });
  } catch (error) {
    //logger.error(error);
    return res.status(500).json({ message: "Error during login" });
  }
});

module.exports = router;
