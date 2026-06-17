const express = require("express");

const {
  register,
  login,
  getProfile,
} = require("../controllers/authController");
const verifyToken =
  require("../middleware/authMiddleware");
const router = express.Router();
router.post("/login", login);
router.post(
  "/register",
  register
);

module.exports = router;
router.get(
  "/profile",
  verifyToken,
  getProfile
);