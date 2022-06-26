import express from "express";
import multer from "multer";
import { auth } from "../middleware/auth.js";
import User from "../models/Users.js";
import sharp from "sharp";
const router = express.Router();
// const storage = multer.memoryStorage();
const upload = multer({
  // storage,
  // dest: "uploads/avatar",
  limits: { fileSize: 1000000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image!"));
    }
    cb(undefined, true);
  },
});

// upload user's profile-pic
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

    // req.user.avatar = req.file.buffer;
    req.user.avatar = buffer;
    // await req.user.save();
    res.status(200).send(req.user);
  },
  (error, req, res, next) => {
    console.error(error.stack);
    res.status(400).send({ error: error.message });
  }
);

// delete user's profile pic
router.delete(
  "/users/me/avatar",
  auth,
  async (req, res) => {
    const user = req.user;
    user.avatar = null;
    await user.save();
    res.status(200).send(user);
  },
  (error, req, res, next) => {
    console.error(error.stack);
    res.status(400).send({ error: error.message });
  }
);

//get user's profile pic:
router.get(
  "/users/me/avatar",
  auth,
  async (req, res) => {
    const user = req.user;
    // res.set("Content-Type", "image/png");
    res.status(200).send({ profilePic: user.avatar });
  },
  (error, req, res, next) => {
    console.error(error.stack);
    res.status(400).send({ error: error.message });
  }
);

export default router;
