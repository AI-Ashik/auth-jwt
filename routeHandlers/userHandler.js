const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { JWT_SECRET } = process.env;

const router = express.Router();
const userSchema = require("../schemas/userSchema");
const checkLogin = require("../middlewares/checkLogin");

// eslint-disable-next-line new-cap
const User = new mongoose.model("User", userSchema);

// Signup
router.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(200).json({
      message: "signup successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server side error!",
    });
  }
});

router.post("/login", checkLogin, async (req, res) => {
  try {
    const user = await User.find({ username: req.body.username });
    if (user && user.length > 0) {
      const isValidated = await bcrypt.compare(
        req.body.password,
        user[0].password
      );
      if (isValidated) {
        const token = jwt.sign(
          {
            username: user[0].username,
            // eslint-disable-next-line no-underscore-dangle
            userId: user[0]._id,
          },
          JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        res.status(200).json({
          "access token ": token,
          message: "login successful",
        });
      } else {
        res.status(401).json({
          error: "Authentiction failed",
        });
      }
    } else {
      res.status(401).json({
        error: "Authentiction failed",
      });
    }
  } catch (error) {
    res.status(401).json({
      error: "Authentiction failed",
    });
  }
});

module.exports = router;
