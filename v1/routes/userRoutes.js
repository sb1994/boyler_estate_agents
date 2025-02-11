// server/routes/v1/userRoutes.js
const express = require("express");
const {
  createAdminUser,
  createEmployee,
  loginUser,
} = require("../contollers/userController");
const router = express.Router();

//login user
router.post("/login", loginUser);
router.get("/", (req, res) => {
  res.status(200).send("Version 1 - List of Users");
});

router.post("/admin", createAdminUser);

module.exports = router;
