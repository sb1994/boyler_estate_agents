const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { default: mongoose } = require("mongoose");

require("dotenv").config();

// Mongo DB Connections
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response) => {
    console.log("MongoDB Connection Succeeded.");
  })
  .catch((error) => {
    console.log("Error in DB connection: " + error);
  });

// Middleware Connections
app.use(cors());
app.use(express.json());

//test route

app.get("/api/v1/test", (req, res) => {
  res.status(201).json({ msg: "Hello World" });
});

// Connection
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("App running in port: " + PORT);
});
