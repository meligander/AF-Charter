const mongoose = require("mongoose");

const DaySchema = new mongoose.Schema({
   date: {
      type: Date,
      require: true,
   },
   availableHours: [
      [
         {
            type: Number,
         },
      ],
   ],
   vessel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vessel",
   },
   reservations: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "reservation",
      },
   ],
});

const Day = mongoose.model("day", DaySchema);

module.exports = Day;
