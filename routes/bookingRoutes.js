const express = require("express");
const auth = require("../middleware/auth")
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus
} = require("../controllers/bookingController");

const router = express.Router();

// Create booking (simulation or real guestId)
router.post("/", createBooking);

// Get all bookings
router.get("/", getBookings);

// Get single booking
router.get("/:bookingId", getBookingById);

// Update booking status
router.put("/:bookingId/status", updateBookingStatus);

module.exports = router;
