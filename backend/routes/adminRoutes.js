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

module.exports =
  router;