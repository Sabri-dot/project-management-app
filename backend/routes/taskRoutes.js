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
  startTask,
   getProjectAllTasks,
    createTask
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
router.post(
  "/",
  verifyToken,
  createTask
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
router.get(
  "/project/:projectId/all",
  verifyToken,
  getProjectAllTasks
);
module.exports = router;