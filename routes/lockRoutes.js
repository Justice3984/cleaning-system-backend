// routes/lockRoutes.js
const express = require("express");
const router = express.Router();
const lockController = require("../controllers/lockController");

// Get all locks
router.get("/", lockController.getLocks);

// Unlock a lock
router.patch("/:lockId/unlock", lockController.unlockLock);

// Lock a lock again
router.patch("/:lockId/lock", lockController.lockLock);

module.exports = router;
