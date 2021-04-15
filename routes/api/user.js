const express = require("express");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const router = express.Router();

//Middleware
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

//Model
const User = require("../../models/User");

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
router.get("/:id", async (req, res) => {
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

//@route    POST /api/user
//@desc     Register user
//@access   Public
router.post(
   "/",
   [
      check("name", "Name is required").not().isEmpty(),
      check("lastname", "Lastame is required").not().isEmpty(),
      check("email", "Email is required").not().isEmpty(),
      check("type", "The type is required").not().isEmpty(),
      check(
         "password",
         "Please enter a password with 8 or more characters"
      ).isLength({ min: 8 }),
   ],
   async (req, res) => {
      const {
         name,
         lastname,
         email,
         id,
         password,
         cel,
         type,
         address,
         dob,
         img,
      } = req.body;

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      var regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
      if (email && !regex.test(email))
         return res.status(400).json({
            value: email,
            msg: "Invalid email",
            params: "email",
            location: "body",
         });

      try {
         //See if users exists
         if (email) {
            user = await User.findOne({ email });

            if (user)
               return res.status(400).json({ msg: "User already exists" });
         }

         let data = {
            name,
            lastname,
            password,
            email,
            type,
            ...(cel && { cel }),
            ...(id && { id }),
            ...(address && { address }),
            ...(dob && { dob }),
            ...(img && { img }),
         };

         user = new User(data);

         //Encrypt password -- agregarlo a cuando se cambia el password
         const salt = await bcrypt.genSalt(10);

         user.password = await bcrypt.hash(user.password, salt);

         await user.save();

         user = await User.find()
            .sort({ $natural: -1 })
            .select("-password")
            .limit(1);
         user = user[0];

         res.json(user);
      } catch (err) {
         console.error(err.message);
         return res.status(500).send("Server Error");
      }
   }
);

//@route    PUT /api/user/:id
//@desc     Update a user
//@access   Private
router.put(
   "/:id",
   [
      auth,
      check("name", "El nombre es necesario").not().isEmpty(),
      check("lastname", "El apellido es necesario").not().isEmpty(),
   ],
   async (req, res) => {
      const { name, lastname, id, active, cel, type, address, dob } = req.body;

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      try {
         let user = await User.find({ _id: req.user.id });

         let data = {
            name,
            lastname,
            active,
            type,
            ...(cel ? { cel } : !cel && user.cel && { cel: "" }),
            ...(id ? { id } : !id && user.id && { id: "" }),
            ...(address
               ? { address }
               : !address && user.address && { address: "" }),
            ...(dob ? { dob } : !dob && user.dob && { dob: "" }),
         };

         user = await User.findOneAndUpdate(
            { _id: user._id },
            { $set: data },
            { new: true }
         );

         res.json(user);
      } catch (err) {
         console.error(err.message);
         return res.status(500).send("Server Error");
      }
   }
);

//@route    PUT /api/user/credentials/:id
//@desc     Update user's credentials
//@access   Private
/* router.put("/credentials/:id", auth, async (req, res) => {
   const { password, password2, email } = req.body;
   try {
      const oldCredentials = await User.findOne({ _id: req.params.id });

      if (!password && email === oldCredentials.email)
         return res.status(400).json({
            msg: "Modifique alguno de los datos para poder guardar los cambios",
         });

      if ((password !== "" || password2 !== "") && password !== password2)
         return res
            .status(400)
            .json({ msg: "Las contraseñas deben coincidir" });

      //See if users exists
      if (email) {
         user = await User.findOne({ email });
         if (user && user.id !== req.user.id && user.email !== email)
            return res
               .status(400)
               .json({ msg: "Ya existe un usuario con ese mail" });
      }

      let data = {
         ...(email
            ? { email }
            : !email && oldCredentials.email && { email: "" }),
      };

      if (password) {
         if (password.length < 6) {
            return res
               .status(400)
               .json({ msg: "La contraseña debe contener 6 carácteres o más" });
         }

         //Encrypt password -- agregarlo a cuando se cambia el password
         const salt = await bcrypt.genSalt(10);

         data.password = await bcrypt.hash(password, salt);
      }

      user = await User.findOneAndUpdate(
         { _id: req.params.id },
         { $set: data },
         { new: true }
      )
         .select("-password")
         .populate({ path: "town", select: "name" })
         .populate({ path: "neighbourhood", select: "name" })
         .populate({ path: "children", select: "-password" });

      if ((email && password) || email !== oldCredentials.email) {
         if (password && email !== oldCredentials.email)
            emailSender(
               email,
               "Cambio de credenciales",
               `El email y la constraseña se han modificado correctamente. 
               Desde ahora en más utilice este email para poder ingresar a nuestra página web.`
            );
         else {
            if (password)
               emailSender(
                  email,
                  "Cambio de contraseña",
                  "Se ha modificado correctamente la constraseña para poder ingresar a nuestra página web."
               );
            else {
               if (oldCredentials.email === "")
                  newUserEmail(oldCredentials.type, email);
               else
                  emailSender(
                     email,
                     "Cambio de email",
                     `Ahora puede ingresar a nuestra página web utilizando este email.`
                  );
            }
         }
      }

      res.json(user);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
}); */

//@route    DELETE /api/user/:id
//@desc     Delete a user
//@access   Private && Admin
router.delete("/:id/:type", [auth], async (req, res) => {
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
