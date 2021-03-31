const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

const router = express.Router();

require("dotenv").config({
   path: path.resolve(__dirname, "../../config/.env"),
});

//Middleware
const auth = require("../../middleware/auth");

//Models
const User = require("../../models/User");

//@route    GET api/auth
//@desc     Get logged user's info
//@access   Private
router.get("/", auth, async (req, res) => {
   try {
      const user = await User.findById(req.user.id).select("-password");
      res.json(user);
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
   }
});

//@route    POST api/auth
//@desc     Authenticate user & get token
//@access   Public
router.post(
   "/",
   [
      check("email", "Please include a valid email").isEmail(),
      check("password", "Pasword is required").exists(),
   ],
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      try {
         //See if user exists
         let user = await User.findOne({ email });

         if (!user) {
            return res
               .status(400)
               .json({ errors: [{ msg: "Invalid credentials" }] });
         }

         const isMatch = await bcrypt.compare(password, user.password);

         if (!isMatch) {
            return res
               .status(400)
               .json({ errors: [{ msg: "Invalid credentials" }] });
         }

         //Return jsonwebtoken
         const payload = {
            user: {
               id: user.id,
            },
         };

         jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 1 * 60 * 60 /*1 hora */ },
            (err, token) => {
               if (err) throw err;
               res.json({ token });
            }
         );
      } catch (err) {
         console.log(err.message);
         res.status(500).send("Server error");
      }
   }
);

module.exports = router;
