import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

//create schema
const userSchema = new mongoose.Schema({
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

// middleware[middleware should be added before compiling the 'model']
userSchema.pre("save", async function (next) {
  const user = this;
  //.isModified:- to make it work only when the password path is modified, which happens when a user is being created or is being modified.
  if (user.isModified("password")) {
    //. we could have done this inside the route, but it will be against the rule of DRY-code
    const saltRounds = 8;
    user.password = await bcrypt.hash(user.password, saltRounds);
  }
  console.log("just before saving!");
  next();
});
// create User Model
const User = mongoose.model("user", userSchema);

export default User;
