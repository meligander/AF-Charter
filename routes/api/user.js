const express = require("express");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const fs = require("fs");
const moment = require("moment");

//Middleware
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

//Model
const User = require("../../models/User");
const Reservation = require("../../models/Reservation");

//@route    GET /api/user
//@desc     Get all user || with filter
//@access   Private & Admin
router.get("/", [auth, adminAuth], async (req, res) => {
   try {
      let users = [];

      if (Object.entries(req.query).length === 0) {
         users = await User.find().sort({ lastname: 1, name: 1 });
      } else {
         let filter = {
            type: !req.query.type
               ? { $ne: "customer" }
               : req.query.type === "captain"
               ? {
                    $in: ["captain", "admin&captain"],
                 }
               : req.query.type,
            ...(req.query.name && {
               name: { $regex: `.*${req.query.name}.*`, $options: "i" },
            }),
            ...(req.query.email && {
               email: { $regex: `.*${req.query.email}.*`, $options: "i" },
            }),
            ...(req.query.lastname && {
               lastname: { $regex: `.*${req.query.lastname}.*`, $options: "i" },
            }),
            ...(req.query.active && { active: req.query.active }),
         };

         users = await User.find(filter)
            .select("-password")
            .sort({ lastname: 1, name: 1 });
      }

      if (users.length === 0) {
         return res.status(400).json({
            msg: "No users with those characteristics",
         });
      }
      res.json(users);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    GET /api/user/:id
//@desc     Get a user
//@access   Private
router.get("/:id", [auth], async (req, res) => {
   try {
      const user = await User.findOne({ _id: req.params.id }).select(
         "-password"
      );

      if (!user) {
         return res.status(400).json({ msg: "User Not Found" });
      }

      res.json(user);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    GET /api/user/:dateFrom/:dateTo/:reservation_id
//@desc     Get all the available captains for a charter
//@access   Public
router.get("/:dateFrom/:dateTo/:reservation_id", async (req, res) => {
   let dateFrom = new Date(req.params.dateFrom);
   let dateTo = new Date(req.params.dateTo);

   try {
      let users = await User.find({
         type: { $in: ["captain", "admin&captain"] },
         active: true,
      }).select("-password");

      const reservations = await Reservation.find({
         dateFrom: {
            $gte: new Date(dateFrom).setUTCHours(0, 0, 0),
            $lte: new Date(dateFrom).setUTCHours(23, 59, 59),
         },
      });

      //check => 8-10
      //reservation => 9-12
      for (let x = 0; x < reservations.length; x++) {
         const isReserv = req.params.reservation_id
            ? req.params.reservation_id !== reservations[x]._id.toString()
            : true;
         if (
            reservations[x].crew &&
            reservations[x].crew.captain &&
            isReserv &&
            ((dateFrom > reservations[x].dateFrom &&
               dateFrom <= reservations[x].dateTo) ||
               (dateTo >= reservations[x].dateFrom &&
                  dateTo < reservations[x].dateTo))
         ) {
            users = users.filter(
               (user) =>
                  user._id.toString() !==
                  reservations[x].crew.captain.toString()
            );
         }
      }

      res.json(users);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    POST /api/user/upload
//@desc     Register user's image
//@access   Public
router.post("/upload-img", async (req, res) => {
   if (req.files === null) {
      return res.status(400).json({ msg: "No file uploaded" });
   }

   const file = req.files.file;

   file.mv(
      `${__dirname}../../../client/public/uploads/users/${file.name}`,
      (err) => {
         if (err) {
            console.error(err);
            return res.status(500).send(err);
         }

         res.json("Ok");
      }
   );
});

//@route    PUT /api/user/:id
//@desc     Register or Update a user
//@access   Private
router.put(
   "/:id",
   [
      auth,
      check("name", "Name is required").not().isEmpty(),
      check("lastname", "Lastame is required").not().isEmpty(),
   ],
   async (req, res) => {
      const { name, lastname, email, cel, type, address, dob, active, img } =
         req.body;

      let user;

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) errors = errorsResult.array();

      const regex1 =
         /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

      try {
         let salt;

         if (req.params.id === "0") {
            if (!email)
               errors.push({ msg: "Email is required", param: "email" });

            if (!regex1.test(email))
               errors.push({ msg: "Invalid email", param: "email" });

            user = await User.findOne({ email });

            if (user)
               errors.push({ msg: "User already exists", param: "email" });

            salt = await bcrypt.genSalt(10);
         }

         if (errors.length > 0) return res.status(400).json({ errors });

         let data = {
            name,
            lastname,
            active,
            type,
            cel,
            address,
            dob,
            ...(req.params.id === "0" && {
               password: await bcrypt.hash(user.password, salt),
            }),
            ...(img && {
               img: { fileName: img, filePath: `/uploads/users/${img}` },
            }),
         };

         if (req.params.id === "0") {
            user = new User(data);
            user.save();
         } else {
            user = await User.findOne({ _id: req.user.id });
            if (img)
               fs.unlinkSync(
                  `${__dirname}../../../client/public${user.img.filePath}`
               );

            user = await User.findOneAndUpdate(
               { _id: user._id },
               { $set: data },
               { new: true }
            );
         }

         res.json(user);
      } catch (err) {
         console.error(err.message);
         return res.status(500).send("Server Error");
      }
   }
);

//@route    DELETE /api/user/:id
//@desc     Delete a user
//@access   Private && Admin
router.delete("/:id/:type", [auth, adminAuth], async (req, res) => {
   try {
      //Remove user
      await User.findOneAndRemove({ _id: req.params.id });

      res.json({ msg: "User deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }
});

module.exports = router;
