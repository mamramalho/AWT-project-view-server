const { DataTypes } = require("sequelize");
const { Users } = require("./Users");

module.exports = (sequelize) => {
  const Calendar = sequelize.define(
    "Calendar",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    },
    { timestamps: false }
  );

  Calendar.associate = (models) => {
    Calendar.belongsTo(models.Users, {
      foreignKey: "userId",
    });
  };

  return Calendar;
};
