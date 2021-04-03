const mongoose = require("mongoose");

const PayMethodSchema = new mongoose.Schema({
   customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
   },
   default: {
      type: Boolean,
      required: true,
   },
   nameOnCard: {
      type: String,
      required: true,
   },
   number: {
      type: Number,
      required: true,
   },
   expireMonth: {
      type: Date,
      required: true,
   },
   secretNumber: {
      type: Number,
      required: true,
   },
   date: {
      type: Date,
      default: Date.now,
   },
});

const PayMethod = mongoose.model("paymethod", PayMethodSchema);

module.exports = PayMethod;
