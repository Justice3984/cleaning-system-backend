// routes/propertyRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const propertyController = require("../controllers/propertyController");

// Create a new property
router.post("/",auth, propertyController.createProperty);

// Get all properties
router.get("/", propertyController.getProperties);

module.exports = router;
