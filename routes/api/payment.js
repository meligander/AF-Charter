const express = require("express");
const router = express.Router();
const cors = require("cors");
const path = require("path");

require("dotenv").config({
   path: path.resolve(__dirname, "../../config/.env"),
});

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//Sending Email
const { sendEmail } = require("../../config/emailSender");

//Middleware
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

//Models
const Payment = require("../../models/Payment");

//@route    GET api/payment/:payment_id
//@desc     Get the info of a payment
//@access   Private
router.get("/:payment_id", [auth], async (req, res) => {
   try {
      let payment = await Payment.findOne({
         _id: req.params.payment_id,
      }).lean();

      if (!payment) {
         return res.status(400).json({ msg: "Payment not found" });
      }

      for (let x = 0; x < 2; x++) {
         const objectName = x === 1 ? "downpayment" : "balance";
         if (payment[objectName] && payment[objectName].type === "stripe") {
            const stripePayment = await stripe.paymentIntents.retrieve(
               payment[objectName].id,
               { apiKey: process.env.STRIPE_SECRET_KEY }
            );

            payment[objectName].id = stripePayment;
         }
      }

      res.json(payment);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    PUT api/payment/:payment_id
//@desc     Make a stripe payment
//@access   Private
router.put("/:payment_id", [auth, cors()], async (req, res) => {
   let { amount, id } = req.body;

   try {
      const stripePayment = await stripe.paymentIntents.create({
         amount: amount * 100,
         currency: "USD",
         description: "AF Charter",
         payment_method: id,
         confirm: true,
      });

      let payment;

      const fee =
         Math.round((amount * 0.029 + 0.3 + Number.EPSILON) * 100) / 100;

      if (stripePayment.status === "succeeded") {
         payment = await Payment.findOneAndUpdate(
            { _id: req.params.payment_id },
            {
               type: "stripe",
               id: stripePayment.id,
               status: "success",
               fee,
               date: new Date(),
            },
            { new: true }
         );

         sendEmail(
            req.user.email,
            "Receipt",
            `Thanks for choosing AF Charter!
   
            Your receipt for the charter downpayment is in the following Link
            <a href='${stripePayment.charges.data[0].receipt_url}'>Receipt</a>`
         );
      }

      if (!payment)
         return res.status(400).json({ msg: "The payment did not go through" });

      res.json(payment);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    PUT api/payment/cash/:payment_id
//@desc     Make a cash payment
//@access   Private & Admin
router.put("/cash/:payment_id", [auth, adminAuth], async (req, res) => {
   try {
      payment = await Payment.findOneAndUpdate(
         { _id: req.params.payment_id },
         {
            type: "cash",
            status: "success",
            date: new Date(),
         },
         { new: true }
      );

      if (!payment)
         return res.status(400).json({ msg: "The payment did not go through" });

      res.json(payment);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    PUT api/payment/cancel/:payment_id
//@desc     Cancel a payment
//@access   Private
router.put("/cancel/:payment_id", [auth, cors()], async (req, res) => {
   try {
      let payment = await Payment.findOne({
         _id: req.params.payment_id,
      });

      if (payment.type === "stripe") {
         await stripe.refunds.create({
            payment_intent: payment.downpayment.id,
         });

         sendEmail(
            req.user.email,
            "Receipt",
            `Your reservation payment has been canceled. 

         Your refund receipt is in the following Link
         <a href='${stripePayment.charges.data[0].receipt_url}'>Receipt</a>`
         );
      }

      payment = await Payment.findOneAndUpdate(
         { _id: payment._id },
         { status: "canceled" },
         { new: true }
      );

      res.json(payment);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    DELETE api/payment/:payment_id
//@desc     Delete payment
//@access   Private && Admin
router.delete("/:payment_id", [auth, adminAuth], async (req, res) => {
   try {
      //Remove payment
      await Payment.findOneAndRemove({
         _id: req.params.payment_id,
      });

      res.json({ msg: "payment deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

module.exports = router;
