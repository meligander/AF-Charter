const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
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
   downpayment: {
      type: Object,
      amount: {
         type: Number,
         required: true,
      },
      type: {
         type: String,
      },
      id: {
         type: String,
      },
      status: {
         type: String,
      },
      date: {
         type: Date,
      },
   },
   balance: {
      type: Object,
      amount: {
         type: Number,
      },
      type: {
         type: String,
      },
      id: {
         type: String,
      },
      status: {
         type: String,
      },
      date: {
         type: Date,
      },
   },
});

const Payment = mongoose.model("payment", PaymentSchema);

module.exports = Payment;
