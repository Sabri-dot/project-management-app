const express =
  require("express");

const router =
  express.Router();

const verifyToken =
  require("../middleware/authMiddleware");

const adminMiddleware =
  require("../middleware/adminMiddleware");

const {
  getAllUsers,
  getAllProjects,
  getAllTasks,
  getAdminDashboard,
} = require(
  "../controllers/adminController"
);

router.get(
  "/users",
  verifyToken,
  adminMiddleware,
  getAllUsers
);

router.get(
  "/projects",
  verifyToken,
  adminMiddleware,
  getAllProjects
);

router.get(
  "/tasks",
  verifyToken,
  adminMiddleware,
  getAllTasks
);
router.get(
  "/dashboard",
  verifyToken,
  adminMiddleware,
  getAdminDashboard
);

module.exports =
  router;