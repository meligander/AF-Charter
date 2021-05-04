const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
   dateFrom: {
      type: Date,
      required: true,
   },
   dateTo: {
      type: Date,
   },
   customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
   },
   vessel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vessel",
      required: true,
   },
   crew: {
      type: Object,
      captain: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "user",
         required: true,
      },
      mates: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
         },
      ],
   },
   manifest: [
      {
         type: Object,
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
   date: {
      type: Date,
      default: Date.now,
   },
});

const Reservation = mongoose.model("reservation", ReservationSchema);

module.exports = Reservation;
