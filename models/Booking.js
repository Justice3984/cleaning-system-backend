const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    property: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Property", 
      required: true 
    },

    // For internal users (if needed later)
    guest: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // For Airbnb simulation
    guestName: { type: String },
    guestEmail: { type: String },

    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },

    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending"
    },

    // Temporary lock for this booking
    tempLock: { type: mongoose.Schema.Types.ObjectId, ref: "Lock" }
  },
  { timestamps: true }
);

// Auto-populate property (with host), guest, and tempLock
bookingSchema.pre(/^find/, function (next) {
  this.populate({
    path: "property",
    populate: { path: "host", select: "name email role" }
  })
  .populate("guest", "name email role")
  .populate("tempLock"); // populate lock details
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);

