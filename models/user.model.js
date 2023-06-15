const { DataTypes } = require("sequelize");
const sequelize = require("./index");
const logger = require("../logger");
const bcrypt = require("bcrypt");
const { authenticate } = require("passport");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      underscored: true,
    }
  );

  const createUser = async function (userData) {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(userData.password, salt);

    try {
      const newUser = await User.create({
        name: userData.name,
        email: userData.email,
        password: password,
      });

      const Calendar = sequelize.models.calendar;
      const newCalendar = await Calendar.create({ userId: newUser.id });

      return { user: newUser, calendar: newCalendar };
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  };
  User.createUser = createUser;

  const authenticate = async function (email, password) {
    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return { error: "Incorrect email" };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return { error: "Incorrect password" };
      }

      return { user };
    } catch (error) {
      logger.error(error.message);
      return { error: error };
    }
  };
  User.authenticate = authenticate;

  return User;
};
