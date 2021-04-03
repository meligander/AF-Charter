const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
   email: {
      type: String,
      required: true,
      unique: true,
   },
   password: {
      type: String,
      required: true,
   },
   name: {
      type: String,
      required: true,
   },
   lastname: {
      type: String,
      required: true,
   },
   id: {
      type: String,
      /* required: true, */
   },
   email: {
      type: String,
      required: true,
   },
   password: {
      type: String,
      required: true,
   },
   cel: {
      type: String,
   },
   type: {
      type: String,
      required: true,
   },
   address: {
      type: String,
   },
   dob: {
      type: Date,
   },
   sex: {
      type: String,
   },
   /*  img: {
      type: Object,
      default: {
         public_id: "",
         url: "",
      },
   }, */
   date: {
      type: Date,
      default: Date.now,
   },
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
