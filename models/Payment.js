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
      payStripe: {
         type: String,
      },
      status: {
         type: String,
      },
      date: {
         type: Date,
         default: Date.now,
      },
   },
   finalPayment: {
      type: Object,
      amount: {
         type: Number,
         required: true,
      },
      payMethod: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "paymethod",
      },
      date: {
         type: Date,
         default: Date.now,
      },
   },
});

const Payment = mongoose.model("payment", PaymentSchema);

module.exports = Payment;
