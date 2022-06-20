import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";
//create schema
const userSchema = new mongoose.Schema(
  {
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
      unique: true,
      lowercase: true,
      validate: function (value) {
        if (!validator.isEmail(value)) {
          throw new Error("please provide a valid email!");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//.use virtuals:
userSchema.virtual("tasks", {
  ref: "task", //name of the model
  localField: "_id",
  foreignField: "user", //field name in the task for users
});

//. add a "static method" to the modelschema:
//[static method: method on the model.]

userSchema.static("findByCredentials", async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    // return res.status(400).send({ msg: "user with this email not found!" });
    // console.log("unable to login!");
    throw new Error("unable to login!");
  }
  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    // return res.status(401).send({ msg: "authentication error" });
    throw new Error("unable to login!");
  }
  return user;
});

//. add a "instance method" to the modelschema:
//[instance method: method on the document.]
userSchema.methods.generateAuthToken = async function () {
  // console.log("authtoken generating!");
  const user = this;
  //.this-> this document
  const secretKey = process.env.JWT_SECRET;
  const token = await jwt.sign(
    { id: user._id },
    secretKey,
    { expiresIn: "1week" },
    { algorithm: "RS256" }
  );
  // add token to the instance of the model viz. the document
  user.tokens.push({ token });
  await user.save();

  return token;
};

userSchema.methods.getPublicProfile = function (tokenArg) {
  const user = this;
  /**
  //destructuring:
  const { name, email, tokens } = user;
  //filter token
  const userToken = tokens.filter((token) => token.token === tokenArg);
  return { name, email, userToken: userToken[0] };
   */
  // destructuring:
  const { name, email } = user;
  return { name, email };
};
userSchema.methods.toJSON = function (tokenArg) {
  const user = this;

  // destructuring:
  const { name, email } = user;
  return { name, email };
};

// userSchema.statics.findByCredentials = async function (email, password) {
//   const user = await User.findOne({ email });
//   if (!user) {
//     // return res.status(400).send({ msg: "user with this email not found!" });
//     throw new Error("unable to login!");
//   }
//   const passwordMatches = await bcrypt.compare(password, user.password);
//   if (!passwordMatches) {
//     // return res.status(401).send({ msg: "authentication error" });
//   }
//   return user;
// };

userSchema.pre("save", async function (next) {
  const user = this; // this-> document
  //.isModified:- to make it work only when the password path is modified, which happens when a user is being created or is being modified.
  if (user.isModified("password")) {
    //. we could have done this inside the route, but it will be against the rule of DRY-code
    const saltRounds = 8;
    user.password = await bcrypt.hash(user.password, saltRounds);
  }
  // console.log("just before saving!");
  next();
});
// create User Model
const User = mongoose.model("user", userSchema);

export default User;
