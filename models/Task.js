// models/Task.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // staff/worker
  taskType: { type: String, enum: ["cleaning", "maintenance"], required: true },
  status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
  photos: [{ type: String }],  
  scheduledAt: { type: Date, required: true },
  lock: { type: mongoose.Schema.Types.ObjectId, ref: "Lock" } })

module.exports = mongoose.model("Task", taskSchema);
