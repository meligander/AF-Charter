const mongoose = require("mongoose");

const DiscrepancySchema = new mongoose.Schema({
   //before-during-after
   time: {
      type: String,
      required: true,
   },
   reservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "reservation",
   },
   vessel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vessel",
   },
   description: {
      type: String,
      required: true,
   },
   date: {
      type: Date,
      default: Date.now,
   },
});

const Discrepancy = mongoose.model("discrepancy", DiscrepancySchema);

module.exports = Discrepancy;
