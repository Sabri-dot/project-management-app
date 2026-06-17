const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  getMyNotifications,
  markNotificationAsRead,
  deleteNotification
} = require("../controllers/notificationController");

router.get("/", verifyToken, getMyNotifications);

router.patch("/:id/read", verifyToken, markNotificationAsRead);

router.delete("/:id", verifyToken, deleteNotification);

module.exports = router;