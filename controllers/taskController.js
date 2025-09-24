// controllers/taskController.js
const Task = require("../models/Task");
const Lock = require("../models/Lock");

// Create a cleaning task + lock access
exports.createCleaningTask = async (req, res) => {
  try {
    const { propertyId, assignedTo } = req.body;

    // Generate temp lock code for cleaner
    const cleanerCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const cleanerLock = new Lock({ propertyId, code: cleanerCode, status: "unlocked" });
    await cleanerLock.save();

    // Create task
    const task = new Task({
      propertyId,
      assignedTo,
      status: "pending",
      lockId: cleanerLock._id,
    });
    await task.save();

    res.status(201).json({ message: "Cleaning task created with lock access", task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo").populate("propertyId");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single task
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
      .populate("assignedTo")
      .populate("propertyId");
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update task status (e.g., completed)
exports.updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.status = req.body.status || task.status;
    await task.save();

    res.json({ message: "Task status updated", task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
