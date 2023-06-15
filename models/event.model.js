const { DataTypes } = require("sequelize");
const sequelize = require("./index");

module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define("event", {
    events_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    active: {
      type: DataTypes.TINYINT(1),
      defaultValue: "1",
    },
    description: {
      type: DataTypes.STRING(150),
    },
    reminderCount: {
      type: DataTypes.TIME,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  });
  return Event;
};
