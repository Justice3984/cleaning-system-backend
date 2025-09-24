// controllers/propertyController.js
const Property = require("../models/Property");
const Lock = require("../models/Lock");

// Create a new property + base lock
exports.createProperty = async (req, res) => {
  try {
    // use the logged-in user ID from JWT
    const hostId = req.user.id;  

    // spread req.body but override/add host
    const property = new Property({
      ...req.body,
      host: hostId
    });

    await property.save();

    // Create a base lock for this property
    const baseLock = new Lock({
      property: property._id,
      code: "BASE-" + Math.floor(1000 + Math.random() * 9000),
      status: "locked"
    });
    await baseLock.save();

    res.status(201).json({ property, lock: baseLock });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Get all properties
exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate("host", "name email");
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
