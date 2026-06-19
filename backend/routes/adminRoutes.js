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

/* PROJECT MEMBERS */

const {
  getAllProjectMembers,
  getProjectMemberById,
  createProjectMember,
  deleteProjectMember,
} = require(
  "../controllers/projectMemberController"
);

/* TASKS  */

const {
  getAdminTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

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
   PROJECT MEMBERS CRUD
========================= */

router.get(
  "/project-members",
  verifyToken,
  adminMiddleware,
  getAllProjectMembers
);

router.get(
  "/project-members/:id",
  verifyToken,
  adminMiddleware,
  getProjectMemberById
);

router.post(
  "/project-members",
  verifyToken,
  adminMiddleware,
  createProjectMember
);

router.delete(
  "/project-members/:id",
  verifyToken,
  adminMiddleware,
  deleteProjectMember
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

router.get(
  "/tasks/:id",
  verifyToken,
  adminMiddleware,
  getTaskById
);

router.post(
  "/tasks",
  verifyToken,
  adminMiddleware,
  createTask
);

router.put(
  "/tasks/:id",
  verifyToken,
  adminMiddleware,
  updateTask
);

router.delete(
  "/tasks/:id",
  verifyToken,
  adminMiddleware,
  deleteTask
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