import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  description: { type: String, required: [true, "description is required"] },
  completed: { type: Boolean, default: false },
});
// create a Task model and schema in a same code
const Task = mongoose.model("task", taskSchema);

export default Task;
