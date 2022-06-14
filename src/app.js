import express from "express";
import mongoose from "mongoose";
import { ServerApiVersion } from "mongodb";
import validator from "validator";
import connectDb from "./db/mongoose.js";
import router_tasks from "./api_routes/task_api.js";
import router_users from "./api_routes/user_api.js";

// create express-server
const app = express();
const port = process.env.PORT || 3000;

// connect to database:
connectDb();

// a built-in middleware to parse the json payloads.
app.use(express.json());

//Routes:
app.use("/tasks", router_tasks);
app.use("/users", router_users);

app.listen(port, (err) => {
  if (err) throw err;
  console.log("connection established!");
});
