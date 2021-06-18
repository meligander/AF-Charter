const express = require("express");
const router = express.Router();
const moment = require("moment");

//Middleware
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

//Models
const Day = require("../../models/Day");

//@route    GET api/day/:vessel_id/:date/:time/:reservation_id
//@desc     Get day availability
//@access   Public
router.get("/:vessel_id/:date/:time/:from/:to", async (req, res) => {
   try {
      let availableHours = [];
      const pastDate = new Date(req.params.date);
      let day = await Day.findOne({
         date: {
            $gte: pastDate,
            $lte: pastDate,
         },
         vessel: req.params.vessel_id,
      }).populate({
         path: "vessel",
         model: "vessel",
         select: "prices",
      });

      const lowest =
         req.params.time !== "0"
            ? req.params.time
            : day
            ? day.vessel.prices.sort((a, b) => a.time - b.time)[0].time
            : 2;

      if (!day) {
         day = {
            availableHours: [[8, 18]],
         };
      }

      if (
         req.params.from !== "0" &&
         moment(req.params.from).format("MM-DD-YYYY") ===
            moment(day.date).utc().format("MM-DD-YYYY")
      ) {
         const originalDateFrom = moment(req.params.from).utc();
         const originalDateTo = moment(req.params.to).utc();
         let add = false;

         for (let x = 0; x < day.availableHours.length; x++) {
            if (originalDateTo.hours() + 1 === day.availableHours[x][0]) {
               day.availableHours[x][0] =
                  originalDateFrom.hours() <= 9 ? 8 : originalDateFrom.hours();
               add = true;
               break;
            }
            if (originalDateFrom.hours() === day.availableHours[x][1] + 1) {
               if (originalDateTo.hours() > 18) day.availableHours[x][1] = 18;
               else {
                  if (
                     day.availableHours[x + 1] &&
                     originalDateTo.hours() + 1 === day.availableHours[x + 1][0]
                  ) {
                     day.availableHours[x][1] = day.availableHours[x + 1][1];
                     day.availableHours.splice(x + 1, 1);
                     x--;
                  } else day.availableHours[x][1] = originalDateTo.hours();
               }
               add = true;
               break;
            }
         }

         if (!add)
            day.availableHours.push([
               originalDateFrom.hours(),
               Number(originalDateTo.format("H")) > 18
                  ? 18
                  : Number(originalDateTo.format("H")),
            ]);
      }

      for (let x = 0; x < day.availableHours.length; x++) {
         let from = day.availableHours[x][0];
         const to = day.availableHours[x][1];

         while (from <= 18) {
            if (to - from >= lowest || to === 18) {
               availableHours.push(from);
            }
            from++;
         }
      }

      res.json({ availableHours, day });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET api/day/:vessel_id/:month/:year/:time/:reservation_id
//@desc     Get unavailability of a month
//@access   Public
router.get("/month/:vessel_id/:month/:year/:time/:date", async (req, res) => {
   try {
      const monthDays = getDaysInMonth(req.params.month, req.params.year);
      let unavailableDates = [];
      const date =
         req.params.date !== "0" &&
         moment(req.params.date).utc().format("YYYY-MM-DD");

      const days = await Day.find({
         date: {
            $gte: new Date(req.params.year, req.params.month, 1, 00, 00, 00),
            $lte: new Date(
               req.params.year,
               req.params.month,
               monthDays,
               23,
               59,
               59
            ),
         },
         vessel: req.params.vessel_id,
      }).populate({
         path: "vessel",
         model: "vessel",
         select: "prices",
      });

      const lowest =
         req.params.time !== "0"
            ? req.params.time
            : days[0]
            ? days[0].vessel.prices.sort((a, b) => a.time - b.time)[0].time
            : 2;

      for (let x = 0; x < days.length; x++) {
         const dayDate = moment(days[x].date).utc().format("YYYY-MM-DD");

         if (
            days[x].availableHours.length === 0 &&
            (!date || (date && date !== dayDate))
         )
            unavailableDates.push(days[x].date);
         else {
            let pass = true;
            for (let y = 0; y < days[x].availableHours.length; y++) {
               if (
                  days[x].availableHours[y][1] - days[x].availableHours[y][0] >=
                     lowest ||
                  days[x].availableHours[y][1] !== 18 ||
                  (date && date === dayDate)
               ) {
                  pass = false;
                  break;
               }
            }
            if (pass && (!date || (date && date !== dayDate)))
               unavailableDates.push(days[x].date);
         }
      }

      res.json(unavailableDates);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    POST api/day/:vessel_id/:date
//@desc     Disable a date
//@access   Private && Admin
router.post("/:vessel_id/:date", [auth, adminAuth], async (req, res) => {
   try {
      const date = new Date(req.params.date);
      let day = await Day.findOne({
         date: {
            $gte: date,
            $lte: date,
         },
         vessel: req.params.vessel_id,
      });

      if (day) {
         return res
            .status(400)
            .json({ msg: "There are reservations on this date" });
      }

      const dayFields = (day = {
         availableHours: [],
         date,
         vessel: vessel_id,
         reservations: [],
      });

      day = new Day(dayFields);
      day.save();

      res.json({ msg: "Date disabled" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    DELETE api/day/:vessel_id/:date
//@desc     Enable a date after it being disabled
//@access   Private && Admin
router.delete("/:vessel_id/:date", [auth, adminAuth], async (req, res) => {
   try {
      await Day.findOneAndDelete({
         date: {
            $gte: date,
            $lte: date,
         },
         vessel: req.params.vessel_id,
      });

      res.json({ msg: "Date Enabled" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

const getDaysInMonth = (month, year) => {
   return new Date(year, month + 1, 0).getDate();
};

module.exports = router;
