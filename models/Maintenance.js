const mongoose = require("mongoose");

const MaintencanceSchema = new mongoose.Schema({
   jobNumber: {
      type: Number,
      required: true,
   },
   vessel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vessel",
      required: true,
   },
   system: {
      type: String,
      required: true,
      //Electric, Engeneering, Auxiliary, Fire System, Sewer
   },
   type: {
      type: String,
      required: true,
      //Mayor, Restrictive, Disabling, Minor
   },
   houlout: {
      type: Boolean,
   },
   openDate: {
      type: Date,
      default: Date.now,
   },
   timeToDetect: {
      type: String,
   },
   paymentToDetect: {
      type: Number,
   },
   mechanicToDetect: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
   },
   issue: {
      type: String,
   },
   mechanicToFix: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
   },
   maintenance: {
      type: String,
   },
   tempFix: {
      type: Boolean,
   },
   permFix: {
      type: Boolean,
   },
   timeToFix: {
      type: String,
   },
   paymentToFix: {
      type: Number,
   },
   closeDate: {
      type: Date,
   },
});

const Maintenance = mongoose.model("maintenance", MaintencanceSchema);

module.exports = Maintenance;
