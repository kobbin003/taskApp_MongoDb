import {MongoClient, ServerApiVersion } from "mongodb";
const uri =
  "mongodb+srv://kobin:3IHWIh5Vqdc90rjt@cluster0.ibgdcyq.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// client.connect((err) => {
//   if (err) throw err;
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   console.log("mongodb atlas connected");
//   client.close();
// });

// create the run()
async function connectDatabase() {
  try {
    await client.connect();
    console.log("mongo database CONNECTED!");
    // // create a database:
    const testDb = client.db("testDb");
    // // create a collection:
    // const testCollection = testDb.collection("testCollection");
    ////create a document:
    // const testDocument1 = {
    //   prop1: "prop1",
    // };
    // // insert the document
    // const p = await testCollection.insertOne(testDocument1);
    //read the document
    // const r = await testCollection.find({
    //   prop1: "prop1",
    // });
    // await testDb.collection("testCollection").insertMany([{ prop2: "prop2" }, { prop3: "prop3" }]);
    const propz = await testDb
      .collection("testCollection")
      .find({ prop2: "prop2" })
      .toArray();

    console.log("this is the doument:", JSON.stringify(propz));
  } catch (err) {
    console.log("this is the error we are getting", err);
  } finally {
    await client.close();
    console.log("mongo database CLOSED!");
  }
}

// run the run()
connectDatabase().catch(console.dir);
