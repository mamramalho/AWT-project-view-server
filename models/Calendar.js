const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Calendar = sequelize.define(
    "Calendar",
    {
      calendar_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    { timestamps: false }
  );

  Calendar.associate = (models) => {
    Calendar.belongsTo(models.Users, {
      foreignKey: "users_id",
    });
  };

  return Calendar;
};
