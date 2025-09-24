// controllers/webhookController.js
const Notification = require("../models/Notification");
const Booking = require("../models/Booking");
const User = require("../models/User");
const WebhookLog = require("../models/webhook");
const Lock = require("../models/Lock");

exports.airbnbWebhook = async (req, res) => {
  try {
    const event = req.body;

    // Log the webhook for auditing/debugging
    await WebhookLog.create({
      eventType: event.type,
      payload: event
    });

    if (event.type === "booking.checkout") {
      const { bookingId } = event.data;

      // Find booking & populate property + host
      const booking = await Booking.findById(bookingId).populate({
        path: "property",
        populate: { path: "host" }
      });

      if (!booking || !booking.property || !booking.property.host) {
        return res.status(404).json({ message: "Booking or host not found" });
      }

      const hostId = booking.property.host._id;

      // ✅ Notify host
      await Notification.create({
        user: hostId,
        message: `Guest checked out from ${booking.property.name}. Cleaning scheduled.`,
        type: "checkout"
      });

      // ✅ Notify staff (simulate task assignment)
      const staff = await User.findOne({ role: "staff" });
      if (staff) {
        await Notification.create({
          user: staff._id,
          message: `Cleaning task assigned for ${booking.property.name}`,
          type: "task"
        });
      }

      // ✅ Lock / expire guest lock
      await Lock.updateMany(
        { property: booking.property._id, validUntil: booking.checkOutDate },
        { status: "locked" }
      );

      // ✅ Update booking status
      booking.status = "completed";
      await booking.save();
    }

    res.status(200).json({ message: "Webhook processed" });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ message: err.message });
  }
};
