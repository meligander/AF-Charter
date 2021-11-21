const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

//Middleware
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

//Models
const Maintenance = require("../../models/Maintenance");

//@route    GET api/maintenance/:maintenance_id
//@desc     Get maintenance information
//@access   Private && Admin
router.get("/:maintenance_id", [auth, adminAuth], async (req, res) => {
   try {
      const maintenance = await Maintenance.findOne({
         _id: req.params.maintenance_id,
      });

      if (!maintenance) {
         return res.status(400).json({ msg: "Maintenance not found" });
      }

      res.json(maintenance);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET api/maintenance/job-number/:vessel_id
//@desc     Get last job number of maintenance for a vessel
//@access   Private && Admin
router.get("/job-number/:vessel_id", [auth, adminAuth], async (req, res) => {
   try {
      const number = await Maintenance.find({
         vessel: req.params.vessel_id,
      })
         .sort({ $natural: -1 })
         .limit(1);

      let jobNumber;
      if (number[0]) jobNumber = Number(number[0].jobNumber) + 1;
      else jobNumber = 1;

      res.json(jobNumber);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET /api/maintenance
//@desc     get all maintenances with filter
//@access   Private && Auth
router.get("/", [auth, adminAuth], async (req, res) => {
   try {
      const filter = {
         ...(req.query.vessel && { vessel: req.query.vessel }),
         ...(req.query.jobNumber && { jobNumber: req.query.jobNumber }),
         ...(req.query.system && { system: req.query.system }),
         ...(req.query.type && { type: req.query.type }),
         ...((req.query.dateFrom || req.query.dateTo) && {
            openDate: {
               ...(req.query.dateFrom && {
                  $gte: new Date(req.query.dateFrom).setUTCHours(00, 00, 00),
               }),
               ...(req.query.dateTo && {
                  $lte: new Date(req.query.dateTo).setUTCHours(23, 59, 59),
               }),
            },
         }),
         closeDate:
            req.query.closed === "true"
               ? { $exists: true }
               : { $exists: false },
      };

      let maintenances = await Maintenance.find(filter)
         .sort({ openDate: 1 })
         .populate({
            path: "vessel",
         });

      if (maintenances.length === 0) {
         return res
            .status(400)
            .json({ msg: "No maintenance with those characteristics" });
      }

      res.json(maintenances);
   } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: "Server Error" });
   }
});

//@route    PUT /api/maintenance/:maintenance_id
//@desc     Register or update maintenance
//@access   Private && Admin
router.put(
   "/:maintenance_id",
   [
      auth,
      adminAuth,
      check("jobNumber", "Job Number is required").not().isEmpty(),
      check("vessel", "Vessel is required").not().isEmpty(),
      check("issue", "Issue is required").not().isEmpty(),
   ],
   async (req, res) => {
      const {
         jobNumber,
         newNumber,
         vessel,
         system,
         type,
         houlout,
         timeToDetect,
         paymentToDetect,
         mechanicToDetect,
         issue,
         mechanicToFix,
         maintenance,
         tempFix,
         permFix,
         timeToFix,
         paymentToFix,
      } = req.body;

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) errors = errorsResult.array();

      try {
         let maintenanceItem = {};

         if (!newNumber) {
            const checkNumber = await Maintenance.findOne({
               vessel,
               jobNumber,
            });

            if (!checkNumber)
               errors.push({
                  msg: "There's no maintenance with that job number.",
                  param: "jobNumber",
               });
         }

         if (errors.length > 0) return res.status(400).json({ errors });

         const maintenanceFields = {
            jobNumber,
            vessel,
            system,
            type,
            houlout,
            timeToDetect,
            paymentToDetect,
            mechanicToDetect: mechanicToDetect !== "" ? mechanicToDetect : null,
            issue,
            mechanicToFix: mechanicToFix !== "" ? mechanicToFix : null,
            maintenance,
            tempFix,
            permFix,
            timeToFix,
            paymentToFix,
         };

         if (req.params.maintenance_id === "0") {
            maintenanceItem = new Maintenance(maintenanceFields);
            await maintenanceItem.save();

            maintenanceItem = await Maintenance.findOne({
               _id: maintenanceItem._id,
            }).populate({
               path: "vessel",
            });
         } else {
            maintenanceItem = await Maintenance.findOneAndUpdate(
               {
                  _id: req.params.maintenance_id,
               },
               maintenanceFields,
               { new: true }
            ).populate({
               path: "vessel",
            });
         }

         res.json(maintenanceItem);
      } catch (err) {
         console.error(err.message);
         return res.status(500).json({ msg: "Server Error" });
      }
   }
);

//@route    PUT /api/maintenance/close/:maintenance_id
//@desc     Close or reopen maintenance
//@access   Private && Admin
router.put("/close/:maintenance_id", [auth, adminAuth], async (req, res) => {
   const { closeDate } = req.body;

   try {
      maintenanceItem = await Maintenance.findOneAndUpdate(
         {
            _id: req.params.maintenance_id,
         },
         { closeDate: closeDate ? new Date() : null },
         { new: true }
      ).populate({
         path: "vessel",
      });

      res.json(maintenanceItem);
   } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: "Server Error" });
   }
});

//@route    DELETE /api/maintenance/:id
//@desc     Delete a maintenance
//@access   Private && Admin
router.delete("/:maintenance_id", [auth, adminAuth], async (req, res) => {
   try {
      await Maintenance.findOneAndRemove({
         _id: req.params.maintenance_id,
      });

      res.json({ msg: "Maintenance deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

module.exports = router;
