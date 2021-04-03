const mongoose = require("mongoose");

const MaintencanceSchema = new mongoose.Schema({
   vessel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vessel",
      required: true,
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

const Maintenance = mongoose.model("maintenance", MaintencanceSchema);

module.exports = Maintenance;
