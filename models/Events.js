module.exports = (sequelize, DataTypes) => {
  const Events = sequelize.define("Events", {
    events_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATE,
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

  Events.associate = (models) => {
    Events.belongsTo(models.Calendar, {
      foreignKey: "calendar_id",
    });
  };

  return Events;
};
