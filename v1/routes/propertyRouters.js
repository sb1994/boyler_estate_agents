const express = require("express");
const router = express.Router();
const {
  createProperty,
  getAllProperties,
  getPropertyById,
  deleteProperty,
  updateProperty,
} = require("../contollers/propertyController");

router.post("/", createProperty);
router.get("/", getAllProperties);
router.get("/:id", getPropertyById);
router.put("/:id", updateProperty);
router.delete("/:id", deleteProperty);

module.exports = router;
