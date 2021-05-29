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
      required: true,
   },
   peopleOnBoard: {
      type: Number,
   },
   peopleSleep: {
      type: Number,
   },
   equipment: {
      type: Array,
   },
   images: [
      {
         type: Object,
         fileName: { type: String, required: true },
         filePath: { type: String, required: true },
      },
   ],
   mainImg: {
      type: Object,
      fileName: { type: String, required: true },
      filePath: { type: String, required: true },
   },
   prices: [
      {
         type: Object,
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
