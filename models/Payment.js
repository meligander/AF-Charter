const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
   amount: {
      type: Number,
      required: true,
   },
   payment: {
      type: String,
      required: true,
   },
   fee: {
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
});

const Payment = mongoose.model("payment", PaymentSchema);

module.exports = Payment;
