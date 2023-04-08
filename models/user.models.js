const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
     
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minLength: 6,
      required: true,
    },
    resetLink: {
        type: String,
        default: ''
    },
    otp: {
        type: String,
        default: ''
    }
  },
  {
    collection: "user_info",
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("User", userSchema);
