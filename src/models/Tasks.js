import mongoose from "mongoose";
// import User from './Users.js'
const taskSchema = new mongoose.Schema(
  {
    description: { type: String, required: [true, "description is required"] },
    completed: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "user" },
  },
  {
    timestamps: true,
  }
);
// create a Task model and schema in a same code
const Task = mongoose.model("task", taskSchema);

export default Task;
