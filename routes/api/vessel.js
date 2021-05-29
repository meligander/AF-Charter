const express = require("express");
const router = express.Router();
const path = require("path");
const { check, validationResult } = require("express-validator");

require("dotenv").config({
   path: path.resolve(__dirname, "../../config/.env"),
});

//Middleware
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

//Models
const Vessel = require("../../models/Vessel");

//@route    GET api/vessel/:vessel_id
//@desc     Get vessel information
//@access   Public
router.get("/:vessel_id", async (req, res) => {
   try {
      const vessel = await Vessel.findOne({
         _id: req.params.vessel_id,
      });

      if (!vessel) {
         return res.status(400).json({ msg: "Vessel not found" });
      }

      res.json(vessel);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET api/vessel
//@desc     Get all vessels
//@access   Public
router.get("/", async (req, res) => {
   try {
      const filter = {
         ...(req.query.year && { year: req.query.year }),
         ...(req.query.name && {
            name: { $regex: `.*${req.query.name}.*`, $options: "i" },
         }),
         ...(req.query.brand && {
            brand: { $regex: `.*${req.query.brand}.*`, $options: "i" },
         }),
      };

      const vessels = await Vessel.find(filter).sort({ brand: 1, name: 1 });

      if (vessels.length === 0) {
         return res.status(400).json({
            msg: "No vessel with those characteristics",
         });
      }

      res.json(vessels);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    POST api/vessel/:vessel_id
//@desc     Create or update a vessel
//@access   Private && Auth
router.post(
   "/:vessel_id",
   [
      auth,
      adminAuth,
      check("name", "Name is required").not().isEmpty(),
      check("brand", "Brand is required").not().isEmpty(),
      check("year", "Year is required").not().isEmpty(),
   ],
   async (req, res) => {
      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      const { name, brand, year, peopleOnBoard, peopleSleep, prices } =
         req.body;

      let images;

      if (req.files === undefined) images = [];
      else {
         const file = req.files.file;

         file.mv(
            `${__dirname}/client/${
               process.env.NODE_ENV === "production" ? "build" : "public"
            }/uploads/${file.name}`,
            (err) => {
               if (err) {
                  console.error(err);
                  return res.status(500).json({ msg: err });
               }
               images = [
                  {
                     fileName: file.name,
                     filePath: `/uploads/${file.name}`,
                     default: true,
                  },
               ];
            }
         );
      }

      //Build profile object
      const vesselFields = {
         name,
         brand,
         year,
         ...(peopleOnBoard && peopleOnBoard),
         ...(peopleSleep && peopleSleep),
         ...(images.length > 0 && { images }),
         ...(prices.length > 0 && { prices }),
      };

      try {
         let vessel;
         if (req.params.vessel_id !== "0") {
            //Update
            vessel = await Vessel.findOneAndUpdate(
               { _id: req.params.vessel_id },
               { $set: vesselFields },
               { new: true }
            );
         } else {
            //Create
            vessel = new Vessel(vesselFields);
            await vessel.save();
         }

         return res.json(vessel);
         //
      } catch (err) {
         console.error(err.message);
         res.status(500).json({ msg: "Server Error" });
      }
   }
);

//@route    DELETE api/vessel/:vessel_id
//@desc     Delete vessel
//@access   Private && Admin
router.delete("/:vessel_id", [auth, adminAuth], async (req, res) => {
   try {
      //Remove profile
      await Vessel.findOneAndRemove({ _id: req.params.vessel_id });

      res.json({ msg: "Vessel deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

module.exports = router;
