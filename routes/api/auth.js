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
const { sendEmail, sentToCompany } = require("../../config/emailSender");

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
      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) errors = errorsResult.array();

      const { email, password } = req.body;

      try {
         //See if user exists
         let user = await User.findOne({ email });

         if (!user) errors.push({ msg: "Invalid credentials" });
         else {
            /*
            //generate bycrypt password with '12345678'
            const salt = await bcrypt.genSalt(10);

             user.password = await bcrypt.hash("12345678", salt);
            console.log(user.password); */
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) errors.push({ msg: "Invalid credentials" });

            if (!user.active)
               errors.push({ msg: "I'm sorry, your account has been blocked" });
         }

         if (errors.length > 0) return res.status(400).json({ errors });

         //Return jsonwebtoken
         const payload = {
            user: {
               id: user._id,
               email: user.email,
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
      const {
         name,
         lastname,
         email,
         password,
         passwordConf,
         cel,
         img,
         address,
      } = req.body;

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) errors = errorsResult.array();

      const regex1 =
         /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
      const regex2 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/;

      if (email && !regex1.test(email))
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
            ...(address & { address }),
            type: "customer",
            cel: {
               countryCode: cel && cel.countryCode ? cel.countryCode : "",
               areaCode: cel && cel.areaCode ? cel.areaCode : "",
               phoneNumb: cel && cel.phoneNumb ? cel.phoneNumb : "",
            },
            img: {
               fileName: img ? img : "",
               filePath: img ? `/uploads/users/${img}` : "",
            },
         };

         const token = jwt.sign(data, process.env.JWT_SECRET, {
            expiresIn: "20m",
         });

         sendEmail(
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

   let data = {};

   try {
      data = jwt.verify(token, process.env.JWT_SECRET);
   } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: "Incorrect or Expired link" });
   }

   try {
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
            email: user.email,
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
      console.log(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
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
      } else {
         if (!user.active)
            return res
               .status(400)
               .json({ msg: "I'm sorry, your account has been blocked" });
      }

      const payload = {
         user: {
            id: user._id,
            email: user.email,
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
      } else {
         if (!user.active)
            return res
               .status(400)
               .json({ msg: "I'm sorry, your account has been blocked" });
      }

      const token = jwt.sign(
         { user: { id: user._id, email: user.email } },
         process.env.JWT_SECRET,
         {
            expiresIn: 2 * 60 * 60 /*1 hora */,
         }
      );

      res.json({ token });
   } catch (err) {
      console.log(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    POST api/auth/send-email
//@desc     Send an email to the company
//@access   Public
router.post(
   "/send-email",
   [
      check("name", "Name is required").not().isEmpty(),
      check("email", "Email is required").not().isEmpty(),
      check("message", "Message is required").not().isEmpty(),
   ],
   async (req, res) => {
      const { name, email, message } = req.body;

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) errors = errorsResult.array();

      const regex1 =
         /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

      if (email && !regex1.test(email))
         errors.push({ msg: "Invalid email", param: "email" });

      if (errors.length > 0) return res.status(400).json({ errors });

      try {
         sentToCompany(
            `Name: ${name} <br/>
            Email: ${email} <br/>
            Message: <br/>${message}`
         );

         res.json({ msg: "Email Sent" });
      } catch (err) {
         console.log(err.message);
         res.status(500).json({ msg: "Server Error" });
      }
   }
);

//@route    PUT /api/auth/password
//@desc     Send password update link
//@access   Public
router.put(
   "/password",
   [check("email", "Email is required").not().isEmpty()],
   async (req, res) => {
      const { email } = req.body;

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) errors = errorsResult.array();

      try {
         let user = await User.findOne({ email });

         if (email && !user)
            errors.push({ msg: "User with this email does not exist" });

         if (errors.length > 0) return res.status(400).json({ errors });

         const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET_PASSWORD,
            {
               expiresIn: "20m",
            }
         );

         await user.updateOne({ resetLink: token });

         sendEmail(
            email,
            "Password update",
            `Hello ${user.name} ${user.lastname}!

            We've received a request to change your password!
            Follow this link to complete your password update:
            <a href='${process.env.WEBPAGE_URI}resetpassword/${token}/'>Password Update Link</a>`
         );

         res.json({ msg: "Email sent" });
      } catch (err) {
         console.error(err.message);
         return res.status(500).json({ msg: "Server Error" });
      }
   }
);

//@route    PUT /api/auth/reset-password
//@desc     Reset password
//@access   Public
router.put(
   "/reset-password",
   [
      check(
         "password",
         "Please enter a password with 8 or more characters"
      ).isLength({ min: 8 }),
      check("passwordConf", "Password Confirmation is required")
         .not()
         .isEmpty(),
   ],
   async (req, res) => {
      const { resetLink, password, passwordConf } = req.body;

      if (!resetLink)
         return res.status(401).json({ msg: "Authentication error" });

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) errors = errorsResult.array();

      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/;

      if (passwordConf !== "" && password !== passwordConf)
         errors.push({
            msg: "Passwords don't match",
            param: "passwordConf",
         });

      if (!regex.test(password))
         errors.push({
            msg: "Password must contain an uppercase, a lower case and a numeric value",
            param: "password",
         });

      if (errors.length > 0) return res.status(400).json({ errors });

      try {
         jwt.verify(resetLink, process.env.JWT_SECRET_PASSWORD);
      } catch (err) {
         console.error(err.message);
         return res.status(401).json({ msg: "Incorrect or Expired link" });
      }

      try {
         let user = await User.findOne({ resetLink });

         if (!user)
            return res
               .status(400)
               .json({ msg: "User with this token does not exist" });

         const salt = await bcrypt.genSalt(10);

         let data = {
            password: "",
            resetLink: "",
         };

         data.password = await bcrypt.hash(password, salt);

         await user.updateOne(data);

         const token = jwt.sign(
            { user: { id: user._id } },
            process.env.JWT_SECRET,
            {
               expiresIn: 2 * 60 * 60 /*2 hora */,
            }
         );

         res.json({ user, token });
      } catch (err) {
         console.error(err.message);
         res.status(500).json({ msg: "Server Error" });
      }
   }
);

module.exports = router;
