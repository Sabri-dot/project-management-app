const express = require("express");

const router = express.Router();

const {
  getProfile,
  updateProfile,
  uploadAvatar,
  changePassword,
} = require("../controllers/userController");

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const uploadAvatarMiddleware =
  require("../middleware/upload");

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

router.put(
  "/profile",
  authMiddleware,
  updateProfile
);

router.post(
  "/avatar",
  authMiddleware,
  uploadAvatarMiddleware.single("avatar"),
  uploadAvatar
);

router.put(
  "/change-password",
  authMiddleware,
  changePassword
);

module.exports = router;