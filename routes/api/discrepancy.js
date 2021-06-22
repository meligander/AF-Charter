const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

//Middleware
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

//Models
const Discrepancy = require("../../models/Discrepancy");
const Maintenance = require("../../models/Maintenance");

//@route    GET /api/discrepancy
//@desc     get all discrepancies for a reservation
//@access   Private && Auth
router.get("/:reservation_id", [auth, adminAuth], async (req, res) => {
   try {
      let discrepancies = await Discrepancy.find({
         reservation: req.params.reservation_id,
      }).sort({ date: 1 });

      res.json(discrepancies);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    POST /api/discrepancy
//@desc     Save discrepancy
//@access   Private && Admin
router.post(
   "/:reservation_id/:vessel_id",
   [
      auth,
      adminAuth,
      check("time", "Time is required").not().isEmpty(),
      check("description", "Description is required").not().isEmpty(),
   ],
   async (req, res) => {
      const { _id, time, description, maintenance } = req.body;

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) errors = errorsResult.array();

      if (errors.length > 0) return res.status(400).json({ errors });

      const checkForValidMongoDbID = new RegExp("^[0-9a-fA-F]{24}$");

      let discrepancy = {};

      try {
         if (checkForValidMongoDbID.test(_id))
            discrepancy = await Discrepancy.findOne({ _id });

         if ((!discrepancy || !discrepancy.maintenance) && maintenance) {
            const number = await Maintenance.find({
               vessel: req.params.vessel_id,
            })
               .sort({ $natural: -1 })
               .limit(1);

            let jobNumber;
            if (number[0]) jobNumber = Number(number[0].jobNumber) + 1;
            else jobNumber = 1;

            const maintenance = new Maintenance({
               jobNumber,
               issue: description,
               vessel: req.params.vessel_id,
            });

            await maintenance.save();
            discrepancy.maintenance = maintenance;
         } else {
            if (discrepancy && discrepancy.maintenance && !maintenance) {
               await Maintenance.findOneAndDelete({
                  _id: discrepancy.maintenance,
               });
               discrepancy.maintenance = undefined;
            }
         }

         const discrepancyFields = {
            time: time,
            description: description,
            reservation: req.params.reservation_id,
            maintenance: discrepancy.maintenance,
         };

         if (!checkForValidMongoDbID.test(_id)) {
            discrepancy = new Discrepancy(discrepancyFields);
            await discrepancy.save();
         } else {
            discrepancy = await Discrepancy.findOneAndUpdate(
               { _id },
               { $set: discrepancyFields },
               { new: true }
            );
         }

         res.json(discrepancy);
      } catch (err) {
         console.error(err.message);
         return res.status(500).send("Server Error");
      }
   }
);

//@route    DELETE /api/discrepancy/:id
//@desc     Delete a discrepancy and its maintenance
//@access   Private && Admin
router.delete("/:discrepancy_id", [auth, adminAuth], async (req, res) => {
   try {
      const discrepancy = await Discrepancy.findOneAndRemove({
         _id: req.params.discrepancy_id,
      });

      if (discrepancy.maintenance)
         await Maintenance.findOneAndDelete({ _id: discrepancy.maintenance });

      res.json({ msg: "Discrepancy deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }
});

module.exports = router;
