const { DataTypes } = require("sequelize");
const sequelize = require("./index");

module.exports = (sequelize, DataTypes) => {
  const Invite = sequelize.define(
    "invite",
    {
      title: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(150),
      },
    },
    { timestamps: false }
  );
  return Invite;
};
