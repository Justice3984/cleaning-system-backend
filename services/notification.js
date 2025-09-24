// services/notificationService.js
const Notification = require("../models/Notification");

// simulate email sending (we can hook into Nodemailer later)
exports.sendNotification = async (recipient, message, type = "in-app") => {
  console.log(` Sending ${type} notification to ${recipient}: ${message}`);

  const notif = new Notification({
    recipient,
    message,
    type,
    status: "sent"
  });

  await notif.save();
  return notif;
};
