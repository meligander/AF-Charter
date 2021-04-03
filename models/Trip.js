const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
   reservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "reservation",
      required: true,
   },
   payment: {
      amount: {
         type: Number,
         required: true,
      },
      method: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "paymethod",
      },
      date: {
         type: Date,
         default: Date.now,
      },
   },
   discrepancies: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "discrepancy",
      },
   ],
   manifest: [
      {
         name: {
            type: String,
            required: true,
         },
         address: {
            type: String,
            required: true,
         },
         phone: {
            type: String,
            required: true,
         },
         dateVisa: {
            type: Date,
         },
      },
   ],
});

const Trip = mongoose.model("trip", TripSchema);

module.exports = Trip;
