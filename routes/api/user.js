const express = require("express");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const router = express.Router();

//@route    GET /api/user
//@desc     Get all user || with filter
//@access   Public
router.get("/", async (req, res) => {
   try {
      let users = [];

      if (Object.entries(req.query).length === 0) {
         users = await User.find().sort({ lastname: 1, name: 1 });
      } else {
         let filter = {
            ...(req.query.type && { type: req.query.type }),
            ...(req.query.name && {
               name: { $regex: `.*${req.query.name}.*`, $options: "i" },
            }),
            ...(req.query.lastname && {
               lastname: { $regex: `.*${req.query.lastname}.*`, $options: "i" },
            }),
         };

         users = await User.find(filter)
            .select("-password")
            .populate({
               path: "children",
               model: "user",
               select: "-password",
            })
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
//@access   Private && Admin
/* router.post(
   "/",
   [
      auth,
      adminAuth,
      check("name", "El nombre es necesario").not().isEmpty(),
      check("lastname", "El apellido es necesario").not().isEmpty(),
      check("type", "Debe seleccionar un tipo de usuario").not().isEmpty(),
   ],
   async (req, res) => {
      let studentnumber = 1;
      const {
         name,
         lastname,
         email,
         tel,
         cel,
         type,
         dni,
         town,
         neighbourhood,
         address,
         dob,
         discount,
         chargeday,
         birthprov,
         birthtown,
         sex,
         degree,
         school,
         salary,
         children,
         description,
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
            msg: "El mail es inválido",
            params: "email",
            location: "body",
         });

      try {
         //See if users exists
         if (email) {
            user = await User.findOne({ email });

            if (user)
               return res
                  .status(400)
                  .json({ msg: "Ya existe un usuario con ese mail" });
         }

         const number = await User.find({ type: "student" })
            .sort({ $natural: -1 })
            .limit(1);

         if (number[0]) {
            studentnumber = Number(number[0].studentnumber) + 1;
         }

         let data = {
            name,
            lastname,
            password: "12345678",
            email,
            tel,
            cel,
            type,
            dni,
            town,
            neighbourhood,
            address,
            dob,
            discount,
            chargeday,
            birthprov,
            birthtown,
            sex,
            degree,
            school,
            salary,
            description,
         };

         if (type === "student") {
            data = {
               ...data,
               studentnumber,
            };
         }
         if (type === "guardian") {
            let childrenList = [];
            for (let x = 0; x < children.length; x++) {
               childrenList.push(children[x]._id);
            }
            data = {
               ...data,
               children: childrenList,
            };
         }

         user = new User(data);

         //Encrypt password -- agregarlo a cuando se cambia el password
         const salt = await bcrypt.genSalt(10);

         user.password = await bcrypt.hash(user.password, salt);

         await user.save();

         if (email) newUserEmail(type, email);

         user = await User.find()
            .sort({ $natural: -1 })
            .select("-password")
            .populate({ path: "town", select: "name" })
            .populate({ path: "neighbourhood", select: "name" })
            .populate({ path: "children", select: "-password" })
            .limit(1);
         user = user[0];

         res.json(user._id);
      } catch (err) {
         console.error(err.message);
         return res.status(500).send("Server Error");
      }
   }
); */

//@route    PUT /api/user/:id
//@desc     Update a user
//@access   Private
/* router.put(
   "/:id",
   [
      auth,
      check("name", "El nombre es necesario").not().isEmpty(),
      check("lastname", "El apellido es necesario").not().isEmpty(),
   ],
   async (req, res) => {
      const {
         name,
         lastname,
         tel,
         cel,
         type,
         dni,
         town,
         neighbourhood,
         address,
         dob,
         discount,
         chargeday,
         birthprov,
         birthtown,
         sex,
         degree,
         school,
         salary,
         children,
         description,
         active,
         img,
      } = req.body;

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      try {
         let imgObject = {
            public_id: "",
            url: "",
         };

         let user = await User.findOne({ _id: req.params.id });

         if (img.public_id !== user.img.public_id) {
            if (user.img.public_id !== "") deletePictures(user.img);
            const uploadResponse = await cloudinaryUploader.uploader.upload(
               img,
               {
                  upload_preset: "english-center",
               }
            );
            imgObject = {
               public_id: uploadResponse.public_id,
               url: uploadResponse.secure_url,
            };
         }

         if (!active) await inactivateUser(user._id, type, false);

         let data = {
            name,
            lastname,
            active,
            sex,
            ...(tel ? { tel } : !tel && user.tel && { tel: "" }),
            ...(cel ? { cel } : !cel && user.cel && { cel: "" }),
            ...(type && { type }),
            ...(dni ? { dni } : !dni && user.dni && { dni: "" }),
            ...(town ? { town } : !town && user.town && { town: "" }),
            ...(neighbourhood
               ? { neighbourhood }
               : !neighbourhood && user.neighbourhood && { neighbourhood: "" }),
            ...(address
               ? { address }
               : !address && user.address && { address: "" }),
            ...(dob ? { dob } : !dob && user.dob && { dob: "" }),
            ...(discount
               ? { discount }
               : !discount && user.discount && { discount: "" }),
            ...(chargeday
               ? { chargeday }
               : !chargeday && user.chargeday && { chargeday: "" }),
            ...(birthprov
               ? { birthprov }
               : !birthprov && user.birthprov && { birthprov: "" }),
            ...(birthtown
               ? { birthtown }
               : !birthtown && user.birthtown && { birthtown: "" }),
            ...(degree ? { degree } : !tel && user.tel && { tel: "" }),
            ...(school ? { school } : !school && user.school && { school: "" }),
            ...(salary ? { salary } : !salary && user.tel && { tel: "" }),
            ...(children
               ? { children }
               : !children && user.children.length > 0 && { children: [] }),
            ...(description
               ? { description }
               : !description && user.description && { description: "" }),
            ...(imgObject.public_id !== "" && { img: imgObject }),
         };

         if (discount && discount !== user.discount) {
            const date = new Date();
            const month = date.getMonth() + 1;
            const yearl = date.getFullYear();

            let enrollments = await Enrollment.find({
               student: req.params.id,
               year: { $in: [yearl, yearl + 1] },
            }).populate({ path: "category", model: "category" });

            for (let x = 0; x < enrollments.length; x++) {
               let installments = await Installment.find({
                  enrollment: enrollments[x]._id,
                  value: { $ne: 0 },
                  ...(enrollments[x].year === yearl && {
                     number: { $gte: month },
                  }),
               });
               let value = enrollments[x].category.value;
               let half = value / 2;

               if (discount && discount !== 0) {
                  const disc = (value * discount) / 100;
                  value = Math.round((value - disc) / 10) * 10;
                  half = value / 2;
               }

               for (let y = 0; y < installments.length; y++) {
                  if (installments[y].number === 0 || installments[y].halfPayed)
                     continue;

                  await Installment.findOneAndUpdate(
                     { _id: installments[y]._id },
                     {
                        value: installments[y].number === 3 ? half : value,
                        expired: false,
                     }
                  );
               }
            }
         }

         await User.findOneAndUpdate({ _id: user._id }, { $set: data });

         res.json({ msg: "User Updated" });
      } catch (err) {
         console.error(err.message);
         return res.status(500).send("Server Error");
      }
   }
); */

//@route    PUT /api/user/credentials/:id
//@desc     Update user's credentials
//@access   Private
/* router.put("/credentials/:id", auth, async (req, res) => {
   const { password, password2, email } = req.body;

   var regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
   if (email && !regex.test(email))
      return res.status(400).json({
         value: email,
         msg: "El mail es inválido",
         params: "email",
         location: "body",
      });

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
