const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const bookingRoutes = require("./routes/bookingRoutes");
const taskRoutes = require("./routes/taskRoutes");
const lockRoutes = require("./routes/lockRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const webhookRoutes = require("./routes/webhookRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const userRoutes = require("./routes/userRoutes");
const simulateRoutes = require("./routes/simulates")

const app = express();
app.use(express.json());
app.use(cors())

// Routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/locks", lockRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/webhook", webhookRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/simulate", simulateRoutes)

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/rental_app")
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

// Server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});






