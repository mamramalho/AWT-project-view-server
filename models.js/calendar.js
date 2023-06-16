const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const calendarSchema = new Schema({
  userCalendar: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

const Calendar = mongoose.model("calendar", calendarSchema);

module.exports = { Calendar };
