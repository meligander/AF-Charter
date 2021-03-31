const mongoose = require("mongoose");

const VesselSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
   },
   brand: {
      type: String,
      required: true,
   },
   year: {
      type: Number,
      /* required: true, */
   },
   peopleOnBoard: {
      type: Number,
   },
   peopleSleep: {
      type: Number,
   },
   prices: [
      {
         time: {
            type: String,
            required: true,
         },
         price: {
            type: Number,
            required: true,
         },
      },
   ],
   date: {
      type: Date,
      default: Date.now,
   },
});

const Vessel = mongoose.model("vessel", VesselSchema);

module.exports = Vessel;
