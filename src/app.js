import express from "express";
import mongoose from "mongoose";
import { ServerApiVersion } from "mongodb";
import validator from "validator";
import connectDb from "./db/mongoose.js";
import tasksRouter from "./api_routes/task_api.js";
import usersRouter from "./api_routes/user_api.js";

// create express-server
const app = express();
const port = process.env.PORT || 3000;

// connect to database:
connectDb();

// a built-in middleware to parse the json payloads.
app.use(express.json());

//Routes:
app.use("/users", usersRouter);
app.use(tasksRouter);

app.listen(port, (err) => {
  if (err) throw err;
  console.log("connection established!");
});
