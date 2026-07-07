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
    createTask,
    getProjectManagerAllTasks,
    getTaskFormData,
    updateTask,
    deleteTask,
} = require(
  "../controllers/taskController"
);
router.get(
  "/mytasks",
  verifyToken,
  getMyTasks
);
router.get(
  "/project-manager/all",
  verifyToken,
  getProjectManagerAllTasks
);

router.get(
  "/all",
  verifyToken,
  getAllTasks
);
router.get(
  "/form-data",
  verifyToken,
  getTaskFormData
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
router.put(
  "/:id",
  verifyToken,
  updateTask
);

router.delete(
  "/:id",
  verifyToken,
  deleteTask
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