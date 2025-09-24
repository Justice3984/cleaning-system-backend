const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const bookingRoutes = require("./routes/bookingRoutes");
const taskRoutes = require("./routes/taskRoutes");
const lockRoutes = require("./routes/lockRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const webhookRoutes = require("./routes/webhookRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const userRoutes = require("./routes/userRoutes");
const simulateRoutes = require("./routes/simulates");

const app = express();

// Middleware
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Backend API is running 🚀");
});

app.use(cors({
  origin: "https://cleaning-system-one.vercel.app", // or your frontend domain
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true
}));



// Routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/locks", lockRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/webhook", webhookRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/simulate", simulateRoutes);

// Connect DB
connectDB();

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
