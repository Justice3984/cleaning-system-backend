// controllers/lockController.js
const Notification = require("../models/Notification");
const Lock = require("../models/Lock");
const Property = require("../models/Property");

// Get all locks
exports.getLocks = async (req, res) => {
  try {
    const locks = await Lock.find().populate('property');
    res.json(locks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update lock status (used by unlockLock and lockLock)
exports.updateLockStatus = async (req, res) => {
  try {
    const { lockId } = req.params;
    const { status } = req.body;

    if (!["locked", "unlocked"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const lock = await Lock.findByIdAndUpdate(
      lockId,
      { status },
      { new: true }
    ).populate({ path: "property", populate: { path: "host" } }); // populate host via property

    if (!lock) {
      return res.status(404).json({ message: "Lock not found" });
    }

    // Notify host
    await Notification.create({
      user: lock.property.host._id,
      message: `Lock ${lock._id} status changed to ${status}`,
      type: "lock"
    });

    res.json(lock);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Unlock lock (guest or cleaner)
exports.unlockLock = async (req, res) => {
  req.body.status = "unlocked";
  await exports.updateLockStatus(req, res);
};

// Lock lock again
exports.lockLock = async (req, res) => {
  req.body.status = "locked";
  await exports.updateLockStatus(req, res);
};
