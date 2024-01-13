const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const todoSchema = require("../schemas/todoSchema");

// eslint-disable-next-line new-cap
const Todo = new mongoose.model("Todo", todoSchema);

// GET ACTIVE TODOS
router.get("/active", async (req, res) => {
  const todo = new Todo();
  const data = await todo.findActive();
  res.status(200).json({
    data,
  });
});

// GET ACTIVE TODOS with callback
router.get("/active-callback", (req, res) => {
  const todo = new Todo();
  todo.findActiveCallback((err, data) => {
    res.status(200).json({
      data,
    });
  });
});

// GET ACTIVE TODOS
router.get("/js", async (req, res) => {
  const data = await Todo.findByJS();
  res.status(200).json({
    data,
  });
});

// GET TODOS BY LANGUAGE
router.get("/language", async (req, res) => {
  const data = await Todo.find().byLanguage("react");
  res.status(200).json({
    data,
  });
});

// GET A TODO by ID
router.get("/:id", async (req, res) => {
  try {
    const data = await Todo.find({ _id: req.params.id });
    res.status(200).json({
      result: data,
      message: "Success",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error!",
    });
  }
});

// POST A TODO
router.post("/", async (req, res) => {
  try {
    const newTodo = new Todo(req.body);
    await newTodo.save();
    res.status(200).json({
      message: "Todo was inserted successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "There was a server side error!",
    });
  }
});

// POST MULTIPLE TODO
router.post("/all", async (req, res) => {
  try {
    await Todo.insertMany(req.body);
    res.status(200).json({
      message: "Todos were inserted successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "There was a server side error!",
    });
  }
});

// PUT TODO
router.put("/:id", async (req, res) => {
  try {
    const result = await Todo.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          status: "active",
        },
      },
      {
        new: true,
        useFindAndModify: false,
      }
    );

    if (result) {
      res.status(200).json({
        message: "Todo was updated successfully!",
      });
    } else {
      res.status(404).json({
        error: "Todo not found!",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "There was a server side error!",
    });
  }
});

// DELETE TODO
router.delete("/:id", async (req, res) => {
  try {
    const result = await Todo.deleteOne({ _id: req.params.id });

    if (result.deletedCount > 0) {
      res.status(200).json({
        message: "Todo was deleted successfully!",
      });
    } else {
      res.status(404).json({
        error: "Todo not found!",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "There was a server side error!",
    });
  }
});

module.exports = router;
