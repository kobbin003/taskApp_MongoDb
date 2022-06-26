import mongoose from "mongoose";
import { ServerApiVersion } from "mongodb";
import validator from "validator";
import "dotenv/config";
// the uri
const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const uri = `mongodb+srv://${username}:${password}@cluster0.ibgdcyq.mongodb.net/?retryWrites=true&w=majority`;

// connect to mongoose
async function connectDb() {
  try {
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });
    console.log("db connected!");
  } catch (error) {
    console.log("db connection could not be established!", error);
  }
}

export default connectDb;
/* -------------------------------------------------------------------------- */
/*
const user = new User({
  name: "s",
  password: "passsix",
  email: "isemail@xx.com",
});

user
  .save()
  .then((result) => {
    console.log("result", result);
    console.log("user", user);
  })
  .catch((err) => console.log("error", err));
*/
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */

// const task = new Task({
//   description: "xx",
// });

// task
//   .save()
//   .then(() => console.log(task))
//   .catch((err) => console.log("ERROR!", err));

/* -------------------------------------------------------------------------- */
// Task.find()
//   .then((result) => console.log(result))
//   .catch((err) => console.log(err));
