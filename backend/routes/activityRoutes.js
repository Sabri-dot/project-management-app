const express = require("express");

const router = express.Router();

const verifyToken = require(
  "../middleware/authMiddleware"
);

const {
  getMyActivities,
} = require(
  "../controllers/activityController"
);

router.get(
  "/myactivities",
  verifyToken,
  getMyActivities
);

module.exports = router;