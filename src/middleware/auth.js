import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/Users.js";
export const auth = async (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];
  // console.log("token", token);
  if (!token) {
    return res.status(500).send({ errormsg: "User not Authorised" });
  }
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    // const user = await User.findById(decoded.id).populate('tasks');
    // res.status(200).send(user);
    if (!user) {
      throw new Error("User not found!");
    }
    req.user = user;
    // console.log("auth working!", decoded);
  } catch (error) {
    // console.log(error);
    res.status(401).send({ errormsg: "User not Authorised" });
  }
  // console.log("auth working!", token);
  next();
};
