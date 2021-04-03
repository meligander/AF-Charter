const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
   dateFrom: {
      type: Date,
      required: true,
   },
   dateTo: {
      type: Date,
      required: true,
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
   downpayment: {
      type: Number,
      required: true,
   },
   payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "paymethod",
      required: true,
   },
   total: {
      type: Number,
      required: true,
   },
   date: {
      type: Date,
      default: Date.now,
   },
});

const Reservation = mongoose.model("reservation", ReservationSchema);

module.exports = Reservation;
