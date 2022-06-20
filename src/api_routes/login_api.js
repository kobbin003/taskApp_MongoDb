import express from "express";
import User from "../models/Users.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { auth } from "../middleware/auth.js";
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // const user = await User.findOne({ email });
    // if (!user) {
    //   return res.status(400).send({ msg: "user with this email not found!" });
    // }
    // const passwordMatches = await bcrypt.compare(password, user.password);
    // if (!passwordMatches) {
    //   return res.status(401).send({ msg: "authentication error" });
    // }
    const user = await User.findByCredentials(email, password);
    // console.log(user);
    // create authorization token
    const token = await user.generateAuthToken();
    // const secretKey = process.env.JWT_SECRET;
    // const token = await jwt.sign(
    //   { id: user._id },
    //   secretKey,
    //   { expiresIn: "1week" },
    //   { algorithm: "RS256" }
    // );
    // console.log("getpublicProfile", user.getPublicProfile(token));
    // res.status(200).send({ user: user.getPublicProfile(token), token });
    res.status(200).send({ user, token });
  } catch (error) {
    // console.log(error);
    res.status(400).send(error.message);
  }
});

// router.post("/signUp", async (req, res) => {
//   const { email, password, name } = req.body;
//   try {
//     const user = new User({ email, password, name });
//     await user.save();
//   } catch (error) {}
// });

// sign out a specific user:
router.post("/logout", auth, async (req, res) => {
  const user = req.user;
  try {
    user.tokens = user.tokens.filter((token) => token.token !== user.token);
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send();
  }
});
// sign out all user:
router.post("/logoutall", auth, async (req, res) => {
  const user = req.user;
  try {
    user.tokens = [];
    await user.save();
    res.status(200).send({ msg: "User logged out!" });
  } catch (error) {
    res.status(500).send(error);
  }
});
export default router;
