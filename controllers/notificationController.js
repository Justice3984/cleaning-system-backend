const Notification = require("../models/Notification");

// Get all notifications for the logged-in user
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id; // from token
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single notification by ID (must belong to the user)
exports.getNotificationById = async (req, res) => {
  try {
    const userId = req.user.id;
    const notification = await Notification.findOne({ _id: req.params.id, userId });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found or not yours" });
    }

    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark notification as read (must belong to the user)
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const notification = await Notification.findOne({ _id: req.params.id, userId });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found or not yours" });
    }

    notification.read = true;
    await notification.save();

    res.json({ message: "Notification marked as read", notification });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get unread count for logged-in user
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await Notification.countDocuments({ userId, read: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
