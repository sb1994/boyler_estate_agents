const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path"); // Import the path module

const { PERMISSIONS } = require("../config/permissions");
const { isEmpty } = require("../utils/utils");
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if ([email, password].some(isEmpty)) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!" });
    }

    const user = await User.findOne({ email }).select("+password");
    console.log(user);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.SECRET,
      {
        expiresIn: "30d",
      }
    );

    // Return the token and user data
    res.json({
      token,
      user: {
        id: user._id,
        role: user.role,
      },
    });
    // res.json({ msg: "no token" });

    // res.status(200).json({ msg: "user logged in" });
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
};
// Create a non-employee user (Admin or Buyer)
const createAdminUser = async (req, res) => {
  try {
    const { fName, lName, email, password, roles } = req.body;

    if ([fName, lName, email, password, roles].some(isEmpty)) {
      res
        .status(400)
        .json({ success: false, message: "All fields are required!" });
    }

    // Ensure only "admin" or "buyer" roles are allowed in this function
    if (
      !roles ||
      !Array.isArray(roles) ||
      roles.some((role) => role !== "admin")
    ) {
      res
        .status(400)
        .json({ message: "Use the admin role property to create an admin" });
    }

    let existingUser = await User.findOne({ email });
    if (existingUser !== null) {
      res
        .status(500)
        .json({ msg: "User already exists please add a new email" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      console.log(roles);

      const createdUser = await new User({
        email,
        lName,
        fName,
        password: hashedPassword,
        role: roles,
        accountActive: true,
      });

      const savedUser = await createdUser.save();

      res.status(201).json({
        msg: "user can be created",
        success: true,
        fName: savedUser.fName,
        lName: savedUser.lName,
        _id: savedUser._id,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Create an employee
const createEmployee = async (req, res) => {
  try {
    const { name, email, auth0Id, jobRole, salary, bonus } = req.body;

    // Ensure job role, salary, and bonus are provided
    if (!jobRole || salary === undefined || bonus === undefined) {
      return res.status(400).json({
        message: "Employees must have a job role, salary, and bonus.",
      });
    }

    const user = new User({
      name,
      email,
      auth0Id,
      roles: ["employee"],
      jobRole,
      salary,
      bonus,
      permissions: [
        PERMISSIONS.VIEW_PROPERTIES, // Employees may have default permissions
      ],
    });

    await user.save();
    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("jobRole");
    res.json({ success: true, data: users });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Other user functions remain unchanged
module.exports = {
  createAdminUser,
  createEmployee,
  getAllUsers,
  loginUser,
};
