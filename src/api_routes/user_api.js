import express from "express";
import { auth } from "../middleware/auth.js";
import Task from "../models/Tasks.js";
import User from "../models/Users.js";
import nodemailer from "nodemailer";
import {
  sendWelcomeEmail,
  sendCancelEmail,
} from "../email/emailMsg.js";
const router = express.Router();

// async function sendWelcomeEmail() {
//   return "asyncfunction";
// }

//create a user
router.post("/", async (req, res) => {
  const user = req.body;

  // create user document
  const user_document = new User(user);

  /*
  //desctructuring user
  const { password } = user;
  //hash a password
  const saltRounds = 8;
  // bcrypt.hash(password, saltRounds).then((hash) => {
  //   user_document.password = hash;
  // });
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  user_document.password = hashedPassword;
  */

  try {
    const infoId = await sendWelcomeEmail();
    console.log("infoId", infoId);
    //send a welcome greeting

    // find if email is already taken
    //.[not required with unique:true]
    /**
     * const user_exists = await User.findOne({ email: user_document.email });
    if (user_exists) {
      return res.status(400).send({ msg: "this email is already taken!" });
    }
     */

    // save the created document
    await user_document.save();
    //generate token
    const token = await user_document.generateAuthToken();
    // console.log("getpublicProfile", user_document.getPublicProfile(token));
    res
      .status(201)
      .send({ user: user_document.getPublicProfile(token), token });
  } catch (error) {
    res.status(400).send(error.message);
  }
  /**
   user_document
    .save()
    .then(() => {
      res.status(201).send(user_document);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
   */
});

// get all users
router.get("/all", async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).send(user);
    // .send(user.map((usr) => usr.getPublicProfile(usr.tokens[0])));
  } catch (error) {
    res.status(500).send(error);
  }
});

// get user's profile
router.get("/me", auth, async (req, res) => {
  const user = req.user;
  res.status(200).send(user);
  // try {
  //   const users = await User.find();
  //   res.status(200).send(users);
  // } catch (error) {
  //   // res.status(500).send(error);
  //   res.status(500);
  //   //"error message has been handled in the auth.js"
  // }
  /**
   User.find()
    .then((data) => {
      // console.log(data);
      res.status(200).send(data);
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).send(err);
    });
   */
});

// //get user by id
// router.get("/:id", auth, async (req, res) => {
//   const user = req.user;
//   res.status(200).send(user);
//   /**
//    *
//    * const id = req.params.id;
//   try {
//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).send({ msg: "User not found" });
//     }
//     res.status(200).send(user);
//   } catch (error) {
//     res.status(500).send(err);
//   }
//    */
//   /* -------------------------------------------------------------------------- */
//   /**
//    User.findById(id)
//     .then((user) => {
//       if (!user) {
//         return res.status(404).send({ msg: "User not found" });
//       }
//       // console.log(user);
//       res.status(200).send(user);
//     })
//     .catch((err) => {
//       // console.log(err);
//       res.status(500).send(err);
//     });
//    */
// });

//update user profile
router.patch("/me", auth, async (req, res) => {
  // const user = req.user;
  const userUpdates = req.body;
  // send error message if wrong updates(other than name and password) are patched
  const allowedUpdates = ["name", "password", "avatar"];
  const allowedUpdatesFromUserUpdates = Object.keys(userUpdates);

  // operation is valid only if the userUpdates includes allowedUpdates viz. 'name' and 'password'
  const isValidOperation = allowedUpdatesFromUserUpdates.every((userFields) =>
    allowedUpdates.includes(userFields)
  );
  if (!isValidOperation) {
    return res
      .status(400)
      .send({ msg: "updates for name and password are only allowed" });
  }
  try {
    const user = req.user;
    Object.assign(user, userUpdates);
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send();
  }
});
// update password or name
router.patch("/:id", auth, async (req, res) => {
  const id = req.params.id;
  const userUpdates = req.body;
  // send error message if wrong updates(other than name and password) are patched
  const allowedUpdates = ["name", "password"];
  const allowedUpdatesFromUserUpdates = Object.keys(userUpdates);

  // operation is valid only if the userUpdates includes allowedUpdates viz. 'name' and 'password'
  const isValidOperation = allowedUpdatesFromUserUpdates.every((userFields) =>
    allowedUpdates.includes(userFields)
  );
  if (!isValidOperation) {
    return res
      .status(400)
      .send({ msg: "updates for name and password are only allowed" });
  }
  try {
    //Model.findByIdAndUpdate bypasses middleware.  so better to do this in "traditional approach"
    // const user = await User.findByIdAndUpdate(id, userUpdates, {
    //   new: true,
    //   runValidators: true,
    // });
    const user = await User.findById(id);
    if (!user) {
      res.status(404).send({ msg: "user not found" });
    }
    Object.assign(user, userUpdates);
    await user.save();
    res.status(200).send(user);
    // const user_by_id = await User.findById(id);
    // const user_by_email = await User.findOne({ email: userUpdates.email });
    // // alllow only if the id and email are related
    // if (user_by_id && user_by_email) {
    //   user_by_id.name = userUpdates.name;
    //   user_by_id.password = userUpdates.password;
    //   await user_by_id.save();
    //   res.status(200).send(user_by_id);
    // } else {
    //   res.status(404).send({ msg: "user not found" });
    // }
  } catch (error) {
    res.status(400).send(error);
  }
});

//delete a user
router.delete("/me", auth, async (req, res) => {
  // const id = req.params.id;
  // const id = req.user.id;
  try {
    // const user = await User.findByIdAndDelete(id);
    // if (!user) {
    //   res.status(404).send({ msg: "user is not found" });
    // }
    await req.user.remove();
    // delete user:
    const infoId = await sendCancelEmail();
    console.log("infoId-2", infoId);

    res.status(200).send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});
export default router;
