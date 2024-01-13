const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const todoHandler = require("./routeHandlers/todoHandler");
const userHandler = require("./routeHandlers/userHandler");

// express app initialization
const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// database connection with mongoose
mongoose
  .connect("mongodb://localhost/todos", {})
  .then(() => console.log("connection successful"))
  .catch((err) => console.log(err));

// application routes
app.use("/todo", todoHandler);
app.use("/user", userHandler);

// default error handler
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  return res.status(500).json({ error: err });
};

app.use(errorHandler);

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
