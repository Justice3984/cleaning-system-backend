// routes/simulateWebhookRoutes.js
const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Property = require("../models/Property");
const Lock = require("../models/Lock");
const Notification = require("../models/Notification");
const User = require("../models/User");
const WebhookLog = require("../models/webhook");

// Helper functions
function randomGuestName() {
  const firstNames = ["John", "Jane", "Alice", "Bob", "Eve", "Charlie"];
  const lastNames = ["Smith", "Doe", "Johnson", "Drown", "Williams", "Davis"];
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

function randomGuestEmail(name) {
  const domains = ["example.com", "test.com", "mail.com"];
  const emailName = name.toLowerCase().replace(" ", ".");
  return `${emailName}@${domains[Math.floor(Math.random() * domains.length)]}`;
}

function randomDates() {
  const start = new Date();
  start.setDate(start.getDate() + Math.floor(Math.random() * 10));
  const end = new Date(start);
  end.setDate(end.getDate() + 1 + Math.floor(Math.random() * 5));
  return { checkInDate: start, checkOutDate: end };
}

// Generate temporary lock code
function generateLockCode() {
  return "LOCK-" + Math.floor(100000 + Math.random() * 900000); // 6-digit code
}

// routes/simulateWebhookRoutes.js
router.post("/simulate-booking", async (req, res) => {
  try {
    // Pick a random property
    const propertyCount = await Property.countDocuments();
    if (propertyCount === 0) {
      return res.status(404).json({ message: "No properties available" });
    }

    const randomIndex = Math.floor(Math.random() * propertyCount);
    const property = await Property.findOne().skip(randomIndex).populate("host");

    // Generate random guest & dates
    const guestName = randomGuestName();
    const guestEmail = randomGuestEmail(guestName);
    const { checkInDate, checkOutDate } = randomDates();

    // Create booking
    const booking = await Booking.create({
      property: property._id,
      guestName,
      guestEmail,
      checkInDate,
      checkOutDate,
      status: "confirmed"
    });

    // Create temporary lock
    const tempLock = await Lock.create({
      property: property._id,
      code: generateLockCode(),
      status: "locked",
      validFrom: checkInDate,
      validUntil: checkOutDate
    });

    booking.tempLock = tempLock._id;
    await booking.save();

    // Log webhook
    await WebhookLog.create({
      eventType: "booking.created",
      payload: { bookingId: booking._id, guestName, guestEmail, lockCode: tempLock.code }
    });

    // Notify host
    if (property.host && property.host._id) {
    await Notification.create({
    userId: property.host._id,
    message: `New booking created for your property: ${property.name} (Guest: ${guestName})`,
    type: "booking",
    read: false
  });
}

    res.status(201).json({
      message: "Simulated booking created",
      booking,
      lockCode: tempLock.code,
      property: property.name
    });

    // Auto checkout after 5s
    setTimeout(async () => {
      booking.status = "completed";
      await booking.save();

      tempLock.status = "unlocked";
      await tempLock.save();

    await Notification.create({
    userId: property.host._id,
    message: `Guest ${guestName} checked out from ${property.name}. Cleaning scheduled.`,
    type: "checkout",
    read: false
    });

      const staff = await User.findOne({ role: "staff" });
    if (staff) {
      await Notification.create({
      userId: staff._id,
      message: `Cleaning task assigned for ${property.name}`,
      type: "task",
      read: false
  });
}
    }, 10000);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
