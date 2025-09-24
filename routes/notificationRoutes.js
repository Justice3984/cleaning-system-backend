const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const authMiddleware = require("../middleware/auth");

// All routes are now secured, userId comes from token
router.get("/", authMiddleware, notificationController.getUserNotifications);
router.get("/unread-count", authMiddleware, notificationController.getUnreadCount);
router.get("/:id", authMiddleware, notificationController.getNotificationById);
router.put("/:id/read", authMiddleware, notificationController.markAsRead);

module.exports = router;
