const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

/**
 * This route handles user registration
 */
router.post("/register", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const gender = req.body.gender || "U";
  const profilePictureId = req.body.profilePictureId || 1;
  const roleId = "2";
  const firstName = req.body.firstName
  const lastName = req.body.lastName

  const registerEntity = await authController.register({
    email,
    password,
    gender,
    profilePictureId,
    roleId,
    firstName,
    lastName
  });

  res.status(200).json(registerEntity);
});

/**
 * This route handles user login
 */
router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const loginEntity = await authController.login({
    email,
    password,
  });

  res.status(200).json(loginEntity);
});

/**
 * This route handles sending reset passwords
 */
router.post("/forgotpassword", async (req, res) => {
  const email = req.body.email;

  const passwordReset = await authController.passwordReset({ email });

  res.status(200).json(passwordReset);
});

module.exports = router;
