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
   active: {
      type: Boolean,
      default: false,
   },
   name: {
      type: String,
      required: true,
   },
   lastname: {
      type: String,
      required: true,
   },
   cel: {
      type: Object,
      countryCode: { type: Number },
      areaCode: { type: Number },
      phoneNumb: { type: Number },
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
   img: {
      type: Object,
      fileName: { type: String, required: true },
      filePath: { type: String, required: true },
   },
   resetLink: {
      type: String,
      default: "",
   },
   date: {
      type: Date,
      default: Date.now,
   },
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
