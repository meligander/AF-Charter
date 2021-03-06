const User = require("../models/User");

module.exports = async function (req, res, next) {
   try {
      let user = await User.findOne({ _id: req.user.id });

      if (user.type === "customer" || user.type === "mate") {
         return res.status(401).json({
            msg: "Unauthorized User",
         });
      }
      next();
   } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: "Server Auth Error" });
   }
};
