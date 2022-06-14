import mongoose from "mongoose";

// create a Task model and schema in a same code
const Task = mongoose.model("task", {
  description: { type: String, required: [true, "description is required"] },
  completed: { type: Boolean, default: false },
});

export default Task;
