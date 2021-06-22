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
   active: {
      type: Boolean,
      default: false,
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
   downpayment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "payment",
      required: true,
   },
   balance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "payment",
      required: true,
   },
   crew: {
      type: Object,
      captain: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "user",
      },
      mates: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
         },
      ],
   },
   charterValue: {
      type: Number,
      required: true,
   },
   //or proccessing fee
   serviceFee: {
      type: Number,
      required: true,
   },
   taxes: {
      type: Number,
      required: true,
   },
   total: {
      type: Number,
      required: true,
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
         cel: {
            type: Object,
            countryCode: { type: Number },
            areaCode: { type: Number },
            phoneNumb: { type: Number },
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
