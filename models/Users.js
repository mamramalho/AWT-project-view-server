const bcrypt = require("bcrypt");
const logger = require("../logger");

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "Users",
    {
      id: {
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
    }
  );

  Users.associate = (models) => {
    Users.hasOne(models.Calendar, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };

  Users.createUser = async function (userData) {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(userData.password, salt);

    try {
      const user = await Users.create({
        name: userData.name,
        email: userData.email,
        password: password,
      });

      const Calendar = sequelize.models.Calendar;
      await Calendar.create({ userId: user.id });

      return user;
    } catch (error) {
      throw error;
    }
  };

  Users.authenticate = async function (email, password) {
    try {
      const user = await Users.findOne({ where: { email } });

      if (!user) {
        return { error: "Incorrect email" };
      }

      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
      );
      logger.info({ email, password, user, isPasswordValid: isPasswordValid });

      if (!isPasswordValid) {
        return { error: "Incorrect password" };
      }

      return { user };
    } catch (error) {
      return { error };
    }
  };

  return Users;
};
