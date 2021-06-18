const express = require("express");
const router = express.Router();
const moment = require("moment");
const { check, validationResult } = require("express-validator");

//Middleware
const auth = require("../../middleware/auth");

//Models
const Reservation = require("../../models/Reservation");
const Day = require("../../models/Day");
const Payment = require("../../models/Payment");

//@route    GET api/reservation/:reservation_id
//@desc     Get the info of a reservation
//@access   Private
router.get("/:reservation_id", [auth], async (req, res) => {
   try {
      const reservation = await Reservation.findOne({
         _id: req.params.reservation_id,
      })
         .populate({
            path: "vessel",
         })
         .populate({
            path: "payment",
         })
         .populate({
            path: "crew.captain",
            model: "user",
            select: ["name", "lastname"],
         });

      if (!reservation) {
         return res.status(400).json({ msg: "Reservation not found" });
      }

      res.json(reservation);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET api/reservation
//@desc     Get all reservations
//@access   Private
router.get("/", [auth], async (req, res) => {
   try {
      const filter = {
         ...(req.query.customer && { customer: req.query.customer }),
         ...(req.query.vessel && { vessel: req.query.vessel }),
         ...(req.query.captain && { "crew.captain": req.query.captain }),
         ...((req.query.dateFrom || req.query.dateTo) && {
            dateFrom: {
               ...(req.query.dateFrom && {
                  $gte: new Date(req.query.dateFrom).setUTCHours(00, 00, 00),
               }),
               ...(req.query.dateTo && {
                  $lte: new Date(req.query.dateTo).setUTCHours(23, 59, 59),
               }),
            },
         }),
      };

      const reservations = await Reservation.find(filter)
         .sort({ dateFrom: 1 })
         .populate({
            path: "vessel",
         })
         .populate({
            path: "payment",
         })
         .populate({
            path: "crew.captain",
            model: "user",
            select: ["name", "lastname"],
         })
         .limit(req.query.limit && Number(req.query.limit));

      if (reservations.length === 0) {
         return res.status(400).json({
            msg: "No reservation with those characteristics",
         });
      }

      res.json(reservations);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    POST api/reservation/
//@desc     Make a reservation
//@access   Private
router.post(
   "/",
   [auth, [check("captain", "Captain is required").not().isEmpty()]],
   async (req, res) => {
      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) errors = errorsResult.array();

      if (errors.length > 0) return res.status(400).json({ errors });

      let { dateFrom, dateTo, customer, vessel, captain, charterValue } =
         req.body;

      dateFrom = new Date(dateFrom);
      dateTo = new Date(dateTo);

      const reservationFields = {
         dateFrom,
         dateTo,
         customer: customer._id,
         active: true,
         vessel,
         crew: {
            captain,
         },
      };

      const paymentFields = {
         charterValue,
         serviceFee: Math.floor(charterValue * 0.1),
         taxes:
            Math.round((charterValue * 0.0705 + Number.EPSILON) * 100) / 100,
         downpayment: {
            amount: 0,
         },
         balance: {
            amount: 0,
         },
      };

      paymentFields.total =
         paymentFields.charterValue +
         paymentFields.serviceFee +
         paymentFields.taxes;

      paymentFields.downpayment.amount =
         Math.round((paymentFields.total * 0.2 + Number.EPSILON) * 100) / 100;

      paymentFields.balance.amount =
         Math.round(
            (paymentFields.total -
               paymentFields.downpayment.amount +
               Number.EPSILON) *
               100
         ) / 100;

      const payment = new Payment(paymentFields);

      reservationFields.payment = payment._id;

      let reservation = new Reservation(reservationFields);

      try {
         await payment.save();
         await reservation.save();
         await removeAvailability(reservation);

         reservation = await Reservation.find()
            .sort({ $natural: -1 })
            .populate({
               path: "vessel",
            })
            .populate({
               path: "payment",
            })
            .populate({
               path: "crew.captain",
               model: "user",
               select: ["name", "lastname"],
            })
            .limit(1);

         return res.json(reservation[0]);
      } catch (err) {
         console.error(err.message);
         res.status(500).json({ msg: "Server Error" });
      }
   }
);

//@route    PUT api/reservation/
//@desc     Update a reservation
//@access   Private
router.put("/:reservation_id", [auth], async (req, res) => {
   let { dateFrom, dateTo, captain, mates, vessel } = req.body;

   dateFrom = dateFrom && new Date(dateFrom);
   dateTo = dateTo && new Date(dateTo);

   const reservationFields = {
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo }),
      ...(vessel && { vessel }),
      crew: {
         ...(captain && { captain }),
         ...(mates && mates.length > 0 && { mates }),
      },
   };

   try {
      const reservation = await Reservation.findOneAndUpdate(
         { _id: req.params.reservation_id },
         reservationFields,
         { new: true }
      )
         .populate({
            path: "vessel",
         })
         .populate({
            path: "payment",
         })
         .populate({
            path: "crew.captain",
            model: "user",
            select: ["name", "lastname"],
         });

      if (dateFrom && dateTo) {
         await addAvailability(reservation);
         await removeAvailability(reservation);
      }

      return res.json(reservation);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    PUT api/reservation/cancel/:reservation_id
//@desc     Cancel reservation
//@access   Private
router.put("/cancel/:reservation_id", [auth], async (req, res) => {
   try {
      //change reservation status
      const reservation = await Reservation.findOne({
         _id: req.params.reservation_id,
      });

      await addAvailability(reservation);
      await reservation.updateOne({ active: false });

      res.json({ msg: "Reservation canceled" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    DELETE api/reservation
//@desc     Delete reservations that have not been payed
//@access   Public
router.delete("/", async (req, res) => {
   try {
      const today = moment().utc();

      //Remove reservation
      const reservations = await Reservation.find({ active: true }).populate({
         path: "payment",
      });

      for (let x = 0; x < reservations.length; x++) {
         const date = moment(reservations[x].date).utc();
         if (
            !reservations[x].payment.downpayment.status &&
            (today - date) / 36e5 > 24
         ) {
            await Payment.findOneAndRemove({
               _id: reservations[x].payment._id,
            });
            const day = await Day.findOne({
               date: {
                  $gte: new Date(reservations[x].dateFrom).setUTCHours(0, 0, 0),
                  $lte: new Date(reservations[x].dateFrom).setUTCHours(
                     23,
                     59,
                     59
                  ),
               },
            });

            if (day.reservations.length === 1) await day.remove();
            else
               await day.updateOne({
                  reservations: day.reservations.filter(
                     (item) =>
                        item.toString() !== reservations[x]._id.toString()
                  ),
               });

            await reservations[x].remove();
         }
      }

      const oldDays = await Day.find({ date: { $lt: today } });

      for (let x = 0; x < oldDays.length; x++) oldDays[x].remove();

      res.json({ msg: "Reservations updated" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    DELETE api/reservation/:reservation_id
//@desc     Delete a reservation
//@access   Private
router.delete("/:reservation_id", [auth], async (req, res) => {
   try {
      //Remove reservation
      const reservation = await Reservation.findOne({
         _id: req.params.reservation_id,
      });

      await Payment.findOneAndDelete({ _id: reservation.payment });

      await addAvailability(reservation);
      await reservation.remove();

      res.json({ msg: "Reservation deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

const addAvailability = async (reservation) => {
   const day = await Day.findOne({
      date: {
         $gte: new Date(reservation.dateFrom).setUTCHours(0, 0, 0, 0),
         $lte: new Date(reservation.dateFrom).setUTCHours(0, 0, 0, 0),
      },
      vessel: reservation.vessel,
   });

   let availableHours = [...day.availableHours];

   let add = false;

   for (let x = 0; x < availableHours.length; x++) {
      if (reservation.dateTo.getUTCHours() + 1 === availableHours[x][0]) {
         availableHours[x][0] =
            reservation.dateFrom.getUTCHours() <= 9
               ? 8
               : reservation.dateFrom.getUTCHours();
         add = true;
         break;
      }
      if (reservation.dateFrom.getUTCHours() === availableHours[x][1] + 1) {
         if (reservation.dateTo.getUTCHours() > 18) availableHours[x][1] = 18;
         else {
            if (
               day.availableHours[x + 1] &&
               reservation.dateTo.getUTCHours() + 1 ===
                  day.availableHours[x + 1][0]
            ) {
               day.availableHours[x][1] = day.availableHours[x + 1][1];
               day.availableHours.splice(x + 1, 1);
            } else day.availableHours[x][1] = reservation.dateTo.getUTCHours();
         }
         add = true;
         break;
      }
   }
   if (!add)
      availableHours.push([
         reservation.dateFrom.getUTCHours(),
         reservation.dateTo.getUTCHours() > 18
            ? 18
            : reservation.dateTo.getUTCHours(),
      ]);

   let reservations = day.reservations.filter(
      (item) => item._id.toString() !== reservation._id.toString()
   );

   if (reservations.length === 0) await day.remove();
   else
      await day.updateOne({
         availableHours,
         reservations,
      });
};

const removeAvailability = async (reservation) => {
   const from = new Date(
      moment(reservation.dateFrom).format("YYYY-MM-DD[T00:00:00Z]")
   );

   let day = await Day.findOne({
      date: {
         $gte: from,
         $lte: new Date(
            moment(reservation.dateFrom).format("YYYY-MM-DD[T23:59:59Z]")
         ),
      },
      vessel: reservation.vessel,
   });

   let dayFields = {
      availableHours: !day ? [[8, 18]] : day.availableHours,
      date: from,
      vessel: reservation.vessel,
      reservations: !day
         ? [reservation._id]
         : [...day.reservations, reservation._id],
   };

   //[12,18]
   //18-22
   //[12-18]

   for (let x = 0; x < dayFields.availableHours.length; x++) {
      const from = dayFields.availableHours[x][0];
      let to = dayFields.availableHours[x][1];

      if (
         from <= reservation.dateFrom.getUTCHours() &&
         (to > reservation.dateTo.getUTCHours() ||
            reservation.dateTo.getUTCDate() >
               reservation.dateFrom.getUTCDate() ||
            to === 18)
      ) {
         if (
            reservation.dateTo.getUTCDate() ===
               reservation.dateFrom.getUTCDate() &&
            to - reservation.dateTo.getUTCHours() > 0
         ) {
            dayFields.availableHours.push([
               reservation.dateTo.getUTCHours() + 1,
               to,
            ]);
         }

         if (reservation.dateFrom.getUTCHours() - from > 1) {
            dayFields.availableHours[x][1] =
               reservation.dateFrom.getUTCHours() - 1;
         } else dayFields.availableHours.splice(x, 1);

         break;
      }
   }

   if (day) {
      await Day.findOneAndUpdate({ _id: day._id }, { $set: dayFields });
   } else {
      day = new Day(dayFields);
      await day.save();
   }
};

/* const hourDiff = (dateFrom, dateTo) => {
   const milliseconds = Math.abs(dateFrom - dateTo);
   const hours = milliseconds / 36e5;
   return hours;
}; */

module.exports = router;
