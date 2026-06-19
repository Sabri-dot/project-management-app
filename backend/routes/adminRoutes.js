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

  getUserById,
  createUser,
  updateUser,
  deleteUser,

} = require("../controllers/adminController");
/* =========================
   USERS CRUD
========================= */

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