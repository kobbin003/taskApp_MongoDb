import express from "express";
import Task from "../models/Tasks.js";

const router = express.Router();

// create a task
router.post("/tasks/", async (req, res) => {
  const task = req.body;
  const task_document = new Task(task);
  try {
    await task_document.save();
    res.status(201).send(task_document);
  } catch (error) {
    res.status(400).send(error);
  }
  /**
 task_document
    .save()
    .then(() => {
      res.status(201).send(task_document);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
 */
});

//select all tasks
router.get("/tasks/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).send(tasks);
  } catch (error) {
    res.status(400).send(err);
  }
});

//select a task by id
router.get("/tasks/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).send({ msg: "Task not found" });
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(err);
  }
});

// // update a task
router.patch("/tasks/:id", async (req, res) => {
  const id = req.params.id;
  const updatedTask = req.body;
  // check if update is valid:
  const allowedUpdates = ["description", "completed"];
  const updatedNoteFields = Object.keys(updatedTask);
  const isValidOperation = updatedNoteFields.every((field) =>
    allowedUpdates.includes(field)
  );
  if (!isValidOperation) {
    return res
      .status(400)
      .send({ msg: "updates are allowed only for description and completed" });
  }
  try {
    // const task = await Task.findByIdAndUpdate(id, updatedTask, {
    //   new: true,
    //   runValidators: true,
    // });
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).send({ msg: "Task not found" });
    }
    Object.assign(task, updatedTask);
    await task.save();
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// //delete a task
router.delete("/tasks/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      res.status(404).send({ msg: "Task not found!" });
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
