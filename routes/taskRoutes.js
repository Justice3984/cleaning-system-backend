const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// Get all tasks
router.get("/", taskController.getTasks);

// Get single task
router.get("/:taskId", taskController.getTaskById);

// Update task status (cleaner marks as completed)
router.patch("/:taskId/status", taskController.updateTaskStatus);

module.exports = router;
