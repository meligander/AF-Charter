const mongoose = require("mongoose");

const ExpenceSchema = new mongoose.Schema({
   vessel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vessel",
      required: true,
   },
   reservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "reservation",
   },
   type: {
      type: String,
      required: true,
   },
   description: {
      type: String,
   },
   amout: {
      type: Number,
      required: true,
   },
   date: {
      type: Date,
      default: Date.now,
   },
});

const Expence = mongoose.model("expence", ExpenceSchema);

module.exports = Expence;
