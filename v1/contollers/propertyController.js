const Property = require("../models/Property");
const logger = require("../utils/logger"); // Winston Logger

/**
 * @desc Create a Property
 * @route POST /api/properties
 * @access Private (Agent/Admin)
 */
const createProperty = async (req, res) => {
  try {
    const property = new Property({ ...req.body, listedBy: req.body.listedBy });
    await property.save();
    logger.info(`Property created: ${property._id} by ${req.body.listedBy}`);
    res
      .status(201)
      .json({ message: "Property created successfully", property: req.body });
  } catch (error) {
    logger.error(`Error creating property: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error creating property", error: error.message });
  }
};

/**
 * @desc Get All Properties
 * @route GET /api/properties
 * @access Public
 */
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (error) {
    logger.error(`Error fetching properties: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error fetching properties", error: error.message });
  }
};

/**
 * @desc Get Single Property by ID
 * @route GET /api/properties/:id
 * @access Public
 */
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    res.status(200).json(property);
  } catch (error) {
    logger.error(`Error fetching property ${req.params.id}: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error fetching property", error: error.message });
  }
};

/**
 * @desc Update a Property
 * @route PUT /api/properties/:id
 * @access Private (Only Owner Agent/Admin)
 */
const updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    // Allow only listing agent or admin to update
    if (
      req.user.roles.includes("agent") &&
      property.listedBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "You can only update your own listings" });
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    logger.info(`Property updated: ${req.params.id} by ${req.user._id}`);
    res
      .status(200)
      .json({ message: "Property updated successfully", property });
  } catch (error) {
    logger.error(`Error updating property ${req.params.id}: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error updating property", error: error.message });
  }
};

/**
 * @desc Delete a Property
 * @route DELETE /api/properties/:id
 * @access Private (Only Owner Agent/Admin)
 */
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    if (
      req.user.roles.includes("agent") &&
      property.listedBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "You can only delete your own listings" });
    }

    await Property.findByIdAndDelete(req.params.id);
    logger.info(`Property deleted: ${req.params.id} by ${req.user._id}`);
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting property ${req.params.id}: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error deleting property", error: error.message });
  }
};

module.exports = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};
