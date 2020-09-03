const express = require('express');
const { check } = require("express-validator");
const bcrypt = require('bcryptjs');


const db = require('../db/models')
const { User } = db;
const {asyncHandler, handleValidationErrors} = require("../utils");
const { getUserToken } = require('../auth')


const router = express.Router();





const validateUsername =
  check("username")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a username");
const validateEmailAndPassword = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a password."),
];

router.post(
  "/",
  validateUsername,
  validateEmailAndPassword,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const {
        username,
        email,
        password
    } = req.body;
    // to do: create the user
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({username, email, hashedPassword})
    const token = getUserToken(user);
    res.status(201).json({
      user: { id: user.id },
      token,
    });
  })
);

router.post(
    "/token",
    validateEmailAndPassword,
    asyncHandler(async (req, res, next) => {
      const { email, password } = req.body;
      const user = await User.findOne({
        where: {
          email,
        },
      });


      // password validation and error handling
      if (!user || !user.validatePassword(password)) {
        const err = new Error("Login failed");
        err.status = 401;
        err.title = "Login failed";
        err.errors = ["The provided credentials were invalid."];
        return next(err);
      }

      // token generation
      const token = getUserToken(user);
      res.json({ token, user: { id: user.id } });
    })
  );


module.exports = router;
