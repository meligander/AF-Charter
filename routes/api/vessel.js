const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { check, validationResult } = require("express-validator");

require("dotenv").config({
   path: path.resolve(__dirname, "../../config/.env"),
});

//Middleware
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

//Models
const Vessel = require("../../models/Vessel");
const Reservation = require("../../models/Reservation");

const folderPath = `${__dirname}../../../client/public`;

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
         ...(req.query.active !== undefined && { active: req.query.active }),
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

//@route    GET /api/vessel/:dateFrom/:dateTo/:reservation_id
//@desc     Get all the available vessels for a charter
//@access   Public
router.get("/:dateFrom/:dateTo/:reservation_id", async (req, res) => {
   let dateFrom = new Date(req.params.dateFrom);
   let dateTo = new Date(req.params.dateTo);

   try {
      let vessels = await Vessel.find({
         active: true,
      });

      const reservations = await Reservation.find({
         dateFrom: {
            $gte: new Date(dateFrom).setUTCHours(0, 0, 0),
            $lte: new Date(dateFrom).setUTCHours(23, 59, 59),
         },
      });

      //check => 8-10
      //reservation => 9-12
      for (let x = 0; x < reservations.length; x++) {
         if (
            req.params.reservation_id !== reservations[x]._id.toString() &&
            ((dateFrom > reservations[x].dateFrom &&
               dateFrom <= reservations[x].dateTo) ||
               (dateTo >= reservations[x].dateFrom &&
                  dateTo < reservations[x].dateTo))
         ) {
            vessels = vessels.filter(
               (vessel) =>
                  vessel._id.toString() !== reservations[x].vessel.toString()
            );
         }
      }

      res.json(vessels);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    POST /api/vessel/upload/:name
//@desc     Register vessel's main image
//@access   Private && Auth
router.post(
   "/upload-mainimg/:vessel_id/:name",
   [auth, adminAuth],
   async (req, res) => {
      if (req.params.name === "undefined") {
         return res
            .status(400)
            .json({ errors: [{ msg: "Name is required", param: "name" }] });
      }

      const newVessel = req.params.vessel_id === "undefined";

      const vessel =
         !newVessel && (await Vessel.findOne({ _id: req.params.vessel_id }));

      if (!vessel || vessel.mainImg.fileName === "")
         await fs.promises.mkdir(`${folderPath}/uploads/${req.params.name}`, {
            recursive: true,
         });

      const oldName = newVessel
         ? req.params.name
         : vessel.name.toLowerCase().replace(/\s/g, "-");

      const file = req.files.file;

      file.mv(
         `${folderPath}/uploads/${
            req.params.name !== oldName ? oldName : req.params.name
         }/${file.name}`,
         (err) => {
            if (err) {
               console.error(err);
               return res.status(500).send(err);
            }

            res.json("Ok");
         }
      );
   }
);

//@route    POST api/vessel/:vessel_id
//@desc     Create or update a vessel
//@access   Private && Auth
router.post(
   "/:vessel_id",
   [auth, adminAuth, check("brand", "Brand is required").not().isEmpty()],
   async (req, res) => {
      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      const {
         name,
         brand,
         year,
         peopleOnBoard,
         peopleSleep,
         prices,
         equipment,
         waterToys,
         active,
         img,
      } = req.body;

      const fileName = name.toLowerCase().replace(/\s/g, "-");

      //Build profile object
      let vesselFields = {
         name,
         brand,
         active,
         ...(year && { year }),
         ...(peopleOnBoard && { peopleOnBoard }),
         ...(peopleSleep && { peopleSleep }),
         ...(equipment.length > 0 && { equipment }),
         ...(waterToys.length > 0 && { waterToys }),
         ...(prices.length > 0 && { prices }),
         ...(img && {
            mainImg: {
               fileName: img,
               filePath: `/uploads/${fileName}/${img}`,
            },
         }),
      };

      try {
         let vessel;
         if (req.params.vessel_id !== "0") {
            //Update
            vessel = await Vessel.findOne({ _id: req.params.vessel_id });

            if (img && img !== vessel.mainImg.fileName)
               fs.unlinkSync(`${folderPath}${vessel.mainImg.filePath}`);

            if (vessel.name !== name) {
               if (vessel.mainImg && !img)
                  vesselFields.mainImg = {
                     fileName: vessel.mainImg.fileName,
                     filePath: `/uploads/${fileName}/${vessel.mainImg.fileName}`,
                  };
               if (vessel.images.length > 0) {
                  for (let x = 0; x < vessel.images.length; x++) {
                     vessel.images[
                        x
                     ].filePath = `/uploads/${fileName}/${vessel.images[x].fileName}`;
                  }
                  vesselFields.images = vessel.images;
               }
               const oldName = vessel.name.toLowerCase().replace(/\s/g, "-");

               if (
                  fileName !== oldName &&
                  fs.existsSync(`${folderPath}/uploads/${oldName}`)
               )
                  fs.renameSync(
                     `${folderPath}/uploads/${oldName}`,
                     `${folderPath}/uploads/${fileName}`
                  );
            }

            vessel = await Vessel.findOneAndUpdate(
               { _id: vessel._id },
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

//@route    PUT api/vessel/upload-images/:vessel_id
//@desc     Upload vessel images
//@access   Private && Auth
router.put("/upload-images/:vessel_id", [auth, adminAuth], async (req, res) => {
   try {
      let vessel = await Vessel.findOne({ _id: req.params.vessel_id });

      let files = req.files.file;

      let newImages = [...vessel.images];

      const folderName = vessel.name.toLowerCase().replace(/\s/g, "-");

      if (files.constructor !== Array) files = [files];

      for (let x = 0; x < files.length; x++) {
         if (!newImages.some((img) => img.fileName === files[x].name)) {
            await files[x].mv(
               `${folderPath}/uploads/${folderName}/${files[x].name}`,
               (err) => {
                  if (err) {
                     console.error(err);
                     return res.status(500).send(err);
                  } else {
                     console.log("Image Uploaded");
                  }
               }
            );
            newImages.push({
               fileName: files[x].name,
               filePath: `/uploads/${folderName}/${files[x].name}`,
            });
         }
      }

      vessel = await Vessel.findOneAndUpdate(
         { _id: vessel._id },
         { images: newImages }
      );

      res.json({ msg: "Images Uploaded" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    PUT api/vessel/delete-image/:vessel_id
//@desc     Delete one of the vessel images
//@access   Private && Auth
router.put("/delete-image/:vessel_id", [auth, adminAuth], async (req, res) => {
   try {
      const { fileName, filePath } = req.body;
      let vessel = await Vessel.findOne({ _id: req.params.vessel_id });

      vessel.images = vessel.images.filter((img) => img.fileName !== fileName);

      fs.unlinkSync(`${folderPath}${filePath}`);

      vessel = await Vessel.findOneAndUpdate(
         { _id: vessel._id },
         { images: vessel.images },
         { new: true }
      );

      res.json(vessel);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    DELETE api/vessel/:vessel_id
//@desc     Delete vessel
//@access   Private && Admin
router.delete("/:vessel_id", [auth, adminAuth], async (req, res) => {
   try {
      //Remove profile
      const reservations = await Reservation.find({
         vessel: req.params.vessel_id,
      });

      if (reservations.length > 0)
         return res.status(400).json({
            msg: "You can't delete a vessel that has reservations",
         });

      const vessel = await Vessel.findOneAndRemove({
         _id: req.params.vessel_id,
      });

      fs.rmdirSync(
         `${folderPath}/uploads/${vessel.name
            .toLowerCase()
            .replace(/\s/g, "-")}`,
         { recursive: true }
      );

      res.json({ msg: "Vessel deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

module.exports = router;
