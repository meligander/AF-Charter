const express = require("express");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const router = express.Router();
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
            type: req.query.type ? req.query.type : { $ne: "customer" },
            ...(req.query.name && {
               name: { $regex: `.*${req.query.name}.*`, $options: "i" },
            }),
            ...(req.query.lastname && {
               lastname: { $regex: `.*${req.query.lastname}.*`, $options: "i" },
            }),
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

//@route    GET /api/user/available-captain/:dateFrom/:dateTo
//@desc     Get all the captains availability for a charter
//@access   Public
router.get("/:dateFrom/:dateTo", async (req, res) => {
   let dateFrom = moment(new Date(req.params.dateFrom));
   let dateTo = moment(new Date(req.params.dateTo));

   dateFrom = new Date(dateFrom.format("YYYY-MM-DD[T]HH:mm:SS[Z]"));
   dateTo = new Date(dateTo.format("YYYY-MM-DD[T]HH:mm:SS[Z]"));

   try {
      let users = await User.find({
         type: { $in: ["captain", "admin&captain"] },
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
         if (
            reservations[x].crew &&
            reservations[x].crew.captain &&
            ((dateFrom > reservations[x].dateFrom &&
               dateFrom <= reservations[x].dateTo) ||
               (dateTo >= reservations[x].dateFrom &&
                  dateTo < reservations[x].dateTo))
         ) {
            users = users.filter(
               (user) => user._id.toString() !== reservations[x].crew.captain
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
      const { name, lastname, email, cel, type, address, dob, active } =
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
            ...(type && { type }),
            ...(req.params.id === "0" && {
               password: await bcrypt.hash("12345678", salt),
               email,
            }),
            cel,
            address,
            dob,
         };

         console.log(data);

         if (req.params.id === "0") {
            user = new User(data);
            user.save();
         } else {
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
