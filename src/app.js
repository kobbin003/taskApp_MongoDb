import express from "express";

const app = express();

app.listen(3000,(err)=>{
if (err) throw err;
console.log("connection established!")
})