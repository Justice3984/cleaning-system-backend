const mongoose = require("mongoose");

const webhookLogSchema = new mongoose.Schema({
  eventType: { type: String, required: true },
  payload: { type: Object, required: true },
  receivedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("WebhookLog", webhookLogSchema);
