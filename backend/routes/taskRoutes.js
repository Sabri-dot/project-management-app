const express = require("express");

const router = express.Router();

const verifyToken = require(
  "../middleware/authMiddleware"
);

const {
  getMyTasks,
  getAllTasks,
  getProjectTasks,
  markTaskAsDone,
  startTask
} = require(
  "../controllers/taskController"
);
router.get(
  "/mytasks",
  verifyToken,
  getMyTasks
);

router.get(
  "/all",
  verifyToken,
  getAllTasks
);

router.get(
  "/project/:projectId",
  verifyToken,
  getProjectTasks
);

router.patch(
  "/:id/done",
  verifyToken,
  markTaskAsDone
);
router.patch(
  "/:id/start",
  verifyToken,
  startTask
);
module.exports = router;