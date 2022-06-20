import express from "express";
import connectDb from "./db/mongoose.js";
import tasksRouter from "./api_routes/task_api.js";
import usersRouter from "./api_routes/user_api.js";
import loginRouter from "./api_routes/login_api.js";
import mongoose from "mongoose";
import User from "./models/Users.js";
import Task from "./models/Tasks.js";
// create express-server
const app = express();
const port = process.env.PORT || 3000;

// connect to database:
connectDb();

// a built-in middleware to parse the json payloads.
app.use(express.json());

//middleware
// app.use((req, res, next) => {
//   res.status(503).send("Service is temporarily unavailable!");
//   // next();
// });
//Routes:
app.use("/user", loginRouter);
app.use("/users", usersRouter);
app.use(tasksRouter);

app.listen(port, (err) => {
  if (err) throw err;
  console.log("connection established!");
});

async function main() {
  const user = await User.findById("62aeaf70e50fba5985feda1b")
    .populate("tasks");
  // const task = await Task.findById("62b028a333aa4af03697f221").populate("user");
  console.log(user);
}

// main();
