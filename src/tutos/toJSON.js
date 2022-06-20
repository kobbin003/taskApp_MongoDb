import { json } from "express";

let room = {
  number: 23,
  toJSON() {
    return this.number;
  },
};

let meetup = {
  title: "conference",
  room,
};
// If an object has a toJSON method, 
// and then if we stringify it
// then the toJSON function gets called.
console.log(JSON.stringify(room));
console.log(JSON.stringify(meetup));
