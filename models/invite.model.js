const { DataTypes } = require("sequelize");
const sequelize = require("./index");

module.exports = (sequelize, DataTypes) => {
  const Invite = sequelize.define(
    "invite",
    {
      invites_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
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
