const User = require("../models/User");

module.exports = async function (req, res, next) {
   try {
      let user = await User.findOne({ _id: req.user.id });

      if (user.type !== "admin" && user.type !== "captain") {
         return res.status(400).json({
            msg: "Unauthorized User",
         });
      }
      next();
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Auth Error");
   }
};
