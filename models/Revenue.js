const mongoose = require("mongoose");

const RevenueSchema = new mongoose.Schema({
   availableMoney: {
      type: Number,
      required: true,
   },
   expences: {
      type: Number,
      required: true,
   },
   income: {
      type: Number,
      required: true,
   },
   date: {
      type: Date,
      default: Date.now,
   },
});

const Revenue = mongoose.model("revenue", RevenueSchema);

module.exports = Revenue;
