const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

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

  Users.authenticate = async function (email, password, done) {
    try {
      const user = await this.findOne({ where: { email } });
      if (!user) {
        return done(null, false, { message: "Incorrect email or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return done(null, false, { message: "Incorrect email or password" });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  };

  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await Users.findOne({ where: { email } });

          if (!user) {
            return done(null, false, {
              message: "Incorrect email or password",
            });
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            return done(null, false, {
              message: "Incorrect email or password",
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await Users.findByPk(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  return Users;
};
