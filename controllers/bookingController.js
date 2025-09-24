const Booking = require("../models/Booking");
const Property = require("../models/Property");
const Notification = require("../models/Notification");
const Lock = require("../models/Lock");
const Task = require("../models/Task");

// Create booking (supports both registered user and simulation)
exports.createBooking = async (req, res) => {
  try {
    const { propertyId, guestId, guestName, guestEmail, checkInDate, checkOutDate } = req.body;

    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      return res.status(400).json({ message: "Check-out must be after check-in" });
    }

    const booking = new Booking({
      property: propertyId,
      guest: guestId || null, // registered guest
      guestName: guestName || null, // simulation
      guestEmail: guestEmail || null,
      checkInDate,
      checkOutDate,
      status: "pending"
    });

    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate({ path: "property", populate: { path: "host" } })
      .populate("guest");

    if (!populatedBooking?.property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // 🔑 Create lock for guest
    const lockCode = "GUEST-" + Math.floor(1000 + Math.random() * 9000);
    await Lock.create({
      property: populatedBooking.property._id,
      booking: populatedBooking._id,
      code: lockCode,
      status: "unlocked",
      validFrom: checkInDate,
      validto: checkOutDate
    });

    // 🔔 Notify host
    try {
      await Notification.create({
        user: populatedBooking.property.host._id,
        message: `New booking for ${populatedBooking.property.name}. Guest code: ${lockCode}`,
        type: "booking"
      });
    } catch (notifyErr) {
      console.error("Notification failed:", notifyErr.message);
    }

    res.status(201).json({ booking: populatedBooking, lockCode });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({ path: "property", populate: { path: "host" } })
      .populate("guest");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single booking
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate({ path: "property", populate: { path: "host" } })
      .populate("guest");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    )
      .populate({ path: "property", populate: { path: "host" } })
      .populate("guest");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Handle status changes
    if (status === "confirmed") {
      await Notification.create({
        user: booking.property.host._id,
        message: `Booking ${booking._id} confirmed for ${booking.property.name}`,
        type: "booking"
      });
    }

    if (status === "completed") {
      // Lock the guest's lock code
      await Lock.updateMany(
        { booking: bookingId },
        { status: "locked" }
      );

      // Assign cleaning task
      await Task.create({
        property: booking.property._id,
        booking: booking._id,
        type: "cleaning",
        assignedTo: null, // can later auto-assign staff
        status: "pending"
      });

      await Notification.create({
        user: booking.property.host._id,
        message: `Booking ${booking._id} completed. Cleaning task created for ${booking.property.name}.`,
        type: "task"
      });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
