const express =
  require("express");

const router =
  express.Router();

const verifyToken =
  require("../middleware/authMiddleware");

const adminMiddleware =
  require("../middleware/adminMiddleware");

/* USERS + DASHBOARD */

const {
  getAllUsers,
  getAllTasks,
  getAdminDashboard,

  getUserById,
  createUser,
  updateUser,
  deleteUser,

} = require(
  "../controllers/adminController"
);

/* PROJECTS */

const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require(
  "../controllers/projectController"
);

/* =========================
   USERS CRUD
========================= */

router.get(
  "/users",
  verifyToken,
  adminMiddleware,
  getAllUsers
);

router.get(
  "/users/:id",
  verifyToken,
  adminMiddleware,
  getUserById
);

router.post(
  "/users",
  verifyToken,
  adminMiddleware,
  createUser
);

router.put(
  "/users/:id",
  verifyToken,
  adminMiddleware,
  updateUser
);

router.delete(
  "/users/:id",
  verifyToken,
  adminMiddleware,
  deleteUser
);

/* =========================
   PROJECTS CRUD
========================= */

router.get(
  "/projects",
  verifyToken,
  adminMiddleware,
  getAllProjects
);

router.get(
  "/projects/:id",
  verifyToken,
  adminMiddleware,
  getProjectById
);

router.post(
  "/projects",
  verifyToken,
  adminMiddleware,
  createProject
);

router.put(
  "/projects/:id",
  verifyToken,
  adminMiddleware,
  updateProject
);

router.delete(
  "/projects/:id",
  verifyToken,
  adminMiddleware,
  deleteProject
);

/* =========================
   TASKS
========================= */

router.get(
  "/tasks",
  verifyToken,
  adminMiddleware,
  getAllTasks
);

/* =========================
   DASHBOARD
========================= */

router.get(
  "/dashboard",
  verifyToken,
  adminMiddleware,
  getAdminDashboard
);

module.exports =
  router;