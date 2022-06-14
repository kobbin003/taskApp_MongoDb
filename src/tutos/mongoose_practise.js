import mongoose from "mongoose";
import { ServerApiVersion } from "mongodb";

const uri =
  "mongodb+srv://kobin:3IHWIh5Vqdc90rjt@cluster0.ibgdcyq.mongodb.net/?retryWrites=true&w=majority";

// main().catch((err) => console.log(err));

// async function main() {
//   await
// }
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// CREATE SCHEMA
const kittySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});
// ADD A METHOD-FIELD TO THE SCHEMA:
// NOTE: methods must be added to the schema before compiling it with mongoose.model()
kittySchema.methods.speak = function speak() {
  const greetings = this.name
    ? "My name is " + this.name
    : "I don't have a name";
  console.log(greetings);
};
// CREATE MODEL:
// A model is a class with which we construct documents
const kittenModel = mongoose.model("kitten", kittySchema);

// CREATE A DOCUMENT:
// const tito = new kittenModel({ name: "tito" });
//   console.log("cat list", tito);
//   console.log("cat id", tito._id);
// using the method:
// tito.speak();

// SAVE IT TO MONGODB:
// await tito.save();

// LIST ALL THE CATS:
const kittens = await kittenModel.find();
console.log(kittens);
