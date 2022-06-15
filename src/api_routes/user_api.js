import express from "express";
import User from "../models/Users.js";

const router = express.Router();

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
    // find if email is already taken
    const user_exists = await User.findOne({ email: user_document.email });
    if (user_exists) {
      return res.status(400).send({ msg: "this email is already taken!" });
    }
    // save the created document
    await user_document.save();
    res.status(201).send(user_document);
  } catch (error) {
    res.status(400).send(error);
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

// get users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
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

//get user by id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ msg: "User not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(err);
  }
  /**
   User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ msg: "User not found" });
      }
      // console.log(user);
      res.status(200).send(user);
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).send(err);
    });
   */
});

// update password or name
router.patch("/:id", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404).send({ msg: "user is not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});
export default router;
