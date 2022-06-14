import express from "express";
import mongoose from "mongoose";
import validator from "validator";
import Task from "../models/Tasks.js";
const router = express.Router();

// create a task
router.post("/", async (req, res) => {
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
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).send(tasks);
  } catch (error) {
    res.status(400).send(err);
  }
});

//select a task by id
router.get("/:id", async (req, res) => {
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
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const updated_note = req.body;
  try {
    const task = await Task.findByIdAndUpdate(id, updated_note, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      return res.status(404).send({ msg: "Task not found" });
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// //delete a task
// router.delete("/:id", (req, res) => {});

export default router;
