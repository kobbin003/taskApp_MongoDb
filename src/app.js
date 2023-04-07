import express from "express";
import connectDb from "./db/mongoose.js";
import tasksRouter from "./api_routes/task_api.js";
import usersRouter from "./api_routes/user_api.js";
import loginRouter from "./api_routes/login_api.js";
import docRouter from "./api_routes/docs_api.js";
import User from "./models/Users.js";
import * as url from "url";
import * as path from "path";
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
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const directoryToServe = path.join(__dirname, "../client");

app.use(express.static(directoryToServe));
//Routes:
app.get("/", (req, res) => {
  res.send({ pass: true });
});
app.use("/user", loginRouter);
app.use("/users", usersRouter);
app.use(tasksRouter);
app.use("/", docRouter);
app.use("/hello","HELLO USER");
app.listen(port, (err) => {
  if (err) throw err;
  console.log("connection established!");
  console.log(`Server is up on port ${port}`);
});

async function main() {
  const user = await User.findById("62aeaf70e50fba5985feda1b").populate(
    "tasks"
  );
  // const task = await Task.findById("62b028a333aa4af03697f221").populate("user");
  console.log(user);
}

// main();
