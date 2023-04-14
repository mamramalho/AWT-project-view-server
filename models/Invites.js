const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const Invites = sequelize.define(
    "Invites",
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

  Invites.associate = (models) => {
    Invites.belongsTo(models.Users, {
      foreignKey: "users_id",
    });

    Invites.belongsTo(models.Events, {
      foreignKey: "events_id",
    });

    Invites.belongsTo(models.Events, {
      foreignKey: "calendar_id",
      through: "Calendar",
    });
  };

  return Invites;
};
