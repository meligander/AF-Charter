const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
const { check, validationResult } = require("express-validator");

const router = express.Router();

require("dotenv").config({
   path: path.resolve(__dirname, "../../config/.env"),
});

const client = new OAuth2Client(process.env.GOOGLE_CLIENTID);

//Sending Email
const emailSender = require("../../config/emailSender");

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
      res.status(500).json({ msg: "Server Error" });
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
               id: user._id,
            },
         };

         const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 2 * 60 * 60 /*1 hora */,
         });

         res.json({ token });
      } catch (err) {
         console.log(err.message);
         res.status(500).json({ msg: "Server Error" });
      }
   }
);

//@route    POST /api/auth/signup
//@desc     User sign up
//@access   Public
router.post(
   "/signup",
   [
      check("name", "Name is required").not().isEmpty(),
      check("lastname", "Lastame is required").not().isEmpty(),
      check("email", "Email is required").not().isEmpty(),
      check(
         "password",
         "Please enter a password with 8 or more characters"
      ).isLength({ min: 8 }),
      check("passwordConf", "Password Confirmation is required")
         .not()
         .isEmpty(),
   ],
   async (req, res) => {
      const { name, lastname, email, password, passwordConf, cel, img } =
         req.body;

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) errors = errorsResult.array();

      const regex1 =
         /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
      const regex2 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/;

      if (!regex1.test(email))
         errors.push({ msg: "Invalid email", param: "email" });

      try {
         //See if users exists
         user = await User.findOne({ email });

         if (user) errors.push({ msg: "User already exists", param: "email" });

         if (passwordConf !== "" && password !== passwordConf)
            errors.push({
               msg: "Passwords don't match",
               param: "passwordConf",
            });

         if (!regex2.test(password))
            errors.push({
               msg: "Password must contain an uppercase, a lower case and a numeric value",
               param: "password",
            });

         if (errors.length > 0) return res.status(400).json({ errors });

         const data = {
            name,
            lastname,
            password,
            email,
            type: "customer",
            ...(cel && { cel }),
            ...(img && {
               img: { fileName: img, filePath: `/uploads/users/${img}` },
            }),
         };

         const token = jwt.sign(data, process.env.JWT_SECRET, {
            expiresIn: "20m",
         });

         emailSender(
            email,
            "Account activation",
            `Welcome ${name} ${lastname}!

            Thanks for signing up with AF Charter!
            You must follow this link to activate your account:
            <a href='${process.env.WEBPAGE_URI}activation/${token}/'>Activation Link</a>`
         );

         res.json({ msg: "Email sent" });
      } catch (err) {
         console.error(err.message);
         res.status(500).json({ msg: "Server Error" });
      }
   }
);

//@route    POST /api/auth/activation
//@desc     User's account activation
//@access   Public
router.post("/activation", async (req, res) => {
   const { token } = req.body;

   if (token) {
      try {
         const data = jwt.verify(token, process.env.JWT_SECRET);

         let user = new User(data);
         const salt = await bcrypt.genSalt(10);

         user.password = await bcrypt.hash(user.password, salt);

         const existingUser = await User.findOne({ email: user.email });

         if (!existingUser) {
            await user.save();

            user = await User.find()
               .sort({ $natural: -1 })
               .select("-password")
               .limit(1);
            user = user[0];
         }

         const payload = {
            user: {
               id: user._id,
            },
         };

         const newToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 2 * 60 * 60 /*1 hora */,
         });

         res.json({
            user: !existingUser ? user : existingUser,
            token: newToken,
         });
      } catch (err) {
         console.error(err.message);
         res.status(500).json({ msg: "Incorrect or Expired link" });
      }
   } else res.status(500).json({ msg: "Something went wrong" });
});

//@route    POST api/auth/facebooklogin
//@desc     Login with Facebook
//@access   Public
router.post("/facebooklogin", async (req, res) => {
   const { userID, accessToken } = req.body;

   try {
      let urlGraphFbk = `https://graph.facebook.com/v2.11/${userID}/?fields=id,first_name,last_name,email,picture&access_token=${accessToken}`;

      const response = await axios.get(urlGraphFbk);

      let user = await User.findOne({ email: response.data.email });

      if (!user) {
         let data = {
            name: response.data.first_name,
            lastname: response.data.last_name,
            email: response.data.email,
            password: response.data.id + process.env.JWT_SECRET,
            type: "customer",
            active: true,
            img: {
               fileName: "Facebook",
               filePath: response.data.picture.data.url,
            },
         };

         user = new User(data);

         //Encrypt password -- agregarlo a cuando se cambia el password
         const salt = await bcrypt.genSalt(10);

         user.password = await bcrypt.hash(user.password, salt);

         await user.save();
      }

      const payload = {
         user: {
            id: user._id,
         },
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
         expiresIn: 2 * 60 * 60 /*1 hora */,
      });

      res.json({ token });
   } catch (err) {
      console.log(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    POST api/auth/googlelogin
//@desc     Login with Google
//@access   Public
router.post("/googlelogin", async (req, res) => {
   const { tokenId } = req.body;

   try {
      const response = await client.verifyIdToken({
         idToken: tokenId,
         audience: process.env.GOOGLE_CLIENTID,
      });

      const dataUser = response.payload;

      let user = await User.findOne({ email: dataUser.email });

      if (!user) {
         let data = {
            name: dataUser.given_name,
            lastname: dataUser.family_name,
            email: dataUser.email,
            password: dataUser.sub + process.env.JWT_SECRET,
            type: "customer",
            active: true,
            img: {
               fileName: "Google",
               filePath: dataUser.picture,
            },
         };

         user = new User(data);

         //Encrypt password -- agregarlo a cuando se cambia el password
         const salt = await bcrypt.genSalt(10);

         user.password = await bcrypt.hash(user.password, salt);

         await user.save();
      }

      const payload = {
         user: {
            id: user._id,
         },
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
         expiresIn: 2 * 60 * 60 /*1 hora */,
      });

      res.json({ token });
   } catch (err) {
      console.log(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

module.exports = router;
