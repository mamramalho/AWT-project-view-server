const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter(function (file) {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach(function (file) {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.calendar = require("./calendar.model.js")(sequelize, Sequelize);
db.event = require("./event.model.js")(sequelize, Sequelize);
db.invite = require("./invite.model.js")(sequelize, Sequelize);

db.user.hasOne(db.calendar, { as: "calendar" });
db.user.hasMany(db.event, { as: "event" });
db.user.hasMany(db.invite, { as: "invite" });
db.calendar.hasMany(db.event, { as: "event" });
db.event.hasMany(db.invite, { as: "invite" });
db.calendar.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
});
db.event.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
});
db.invite.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
});
db.event.belongsTo(db.calendar, {
  foreignKey: "calendarId",
  as: "calendar",
});
db.invite.belongsTo(db.event, {
  foreignKey: "eventId",
  as: "event",
});

module.exports = db;
