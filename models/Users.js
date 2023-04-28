const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "Users",
    {
      users_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
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
      hooks: {
        beforeSave: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );

  Users.associate = (models) => {
    Users.hasOne(models.Calendar, {
      foreignKey: "users_id",
      onDelete: "CASCADE",
    });
  };

  Users.createUser = async function (userData) {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(userData.password, salt);

    return this.create({
      name: userData.name,
      email: userData.email,
      password: password,
    });
  };

  return Users;
};
