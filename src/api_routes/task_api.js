import express from "express";
import Task from "../models/Tasks.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();

// create a task
router.post("/tasks/", auth, async (req, res) => {
  const task = req.body;
  const userId = req.user.id;
  const task_document = new Task({ ...task, user: userId });
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

//select all tasks of the user based on given queries
// GET /tasks?completed=<boolean>
// GET /tasks?limit=<number>&skip=<number>
//GET /tasks?sort=description:desc
router.get("/tasks/", auth, async (req, res) => {
  // const completed =
  //   (req.query.completed && req.query.completed === "true") ? true : false;

  let completed;
  if (req.query.completed) {
    completed = req.query.completed === "true";
  }
  const sort = {};
  if (req.query.sort) {
    const sortBy = req.query.sort.split(":");
    sort[sortBy[0]] = sortBy[1] === "desc" ? -1 : 1;
  }
  try {
    // const tasks = await Task.find({ user: req.user._id });
    // res.status(200).send(tasks);

    // OR [ALTERNATIVE SOLUTION] using populate:
    // foreign field:       , localfield:
    await req.user.populate({
      path: "tasks",
      match: { completed },
      select: "description completed user -_id",
      options: {
        limit: req.query.limit,
        skip: req.query.skip,
        sort,
      },
    });
    res.status(200).send(req.user.tasks);
  } catch (error) {
    res.status(400).send(error);
  }
});

//select a task by id
router.get("/tasks/:id", auth, async (req, res) => {
  const taskId = req.params.id;
  try {
    // const task = await Task.findOne({ _id: taskId});
    const task = await Task.findOne({ _id: taskId, user: req.user._id });

    //
    if (!task) {
      return res.status(404).send();
    }
    // await task.populate("user").execPopulate();

    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// // update a task
router.patch("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
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
    const task = await Task.findOne({ _id, user: req.user._id });
    // console.log("task found", task);
    if (!task) {
      return res.status(404).send();
    }
    Object.assign(task, updatedTask);
    await task.save();
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// //delete a task
router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    // const task = await Task.findByIdAndDelete(id);
    const task = await Task.findOneAndDelete({ _id, user: req.user._id });
    if (!task) {
      res.status(404).send();
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send();
  }
});

export default router;
