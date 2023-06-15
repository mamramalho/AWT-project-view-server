const { DataTypes } = require("sequelize");
const sequelize = require("./index");

module.exports = (sequelize, DataTypes) => {
  const Calendar = sequelize.define(
    "calendar",
    {},
    {
      timestamps: false,
    }
  );
  return Calendar;
};
