import mongoose from "mongoose";
import validator from "validator";
// create User Model
const User = mongoose.model("user", {
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: [1, "username should contain atleast one letter"],
  },
  password: {
    type: String,
    minLength: [6, "password length should be greater than 6"],
    required: true,
    trim: true,
    validate: function (value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error(
          "Choose another password![password must be other than the word /'password/']"
        );
      }
    },
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: function (value) {
      if (!validator.isEmail(value)) {
        throw new Error("please provide a valid email!");
      }
    },
  },
});

export default User;
