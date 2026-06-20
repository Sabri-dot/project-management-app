const express =
  require("express");

const router =
  express.Router();

const verifyToken =
  require("../middleware/authMiddleware");

const adminMiddleware =
  require("../middleware/adminMiddleware");

  const uploadAvatar =
  require("../middleware/upload");
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
  getProjectDetails,
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

/* NOTIFICATIONS */

const {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
} = require(
  "../controllers/AdminNotificationController"
);

/* ATTACHMENTS */

const {
  getAllAttachments,
  getAttachmentById,
  createAttachment,
  updateAttachment,
  deleteAttachment,
} = require(
  "../controllers/AdminAttachmentController"
);

/* ACTIVITY LOGS */

const {
  getAllActivityLogs,
  getActivityLogById,
  createActivityLog,
  updateActivityLog,
  deleteActivityLog,
} = require(
  "../controllers/AdminActivityLogController"
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
  uploadAvatar.single("avatar"),
  createUser
);

router.put(
  "/users/:id",
  verifyToken,
  adminMiddleware,
  uploadAvatar.single("avatar"),
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
  "/projects/details/:id",
  verifyToken,
  adminMiddleware,
  getProjectDetails
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
   NOTIFICATIONS CRUD
========================= */

router.get(
  "/notifications",
  verifyToken,
  adminMiddleware,
  getAllNotifications
);

router.get(
  "/notifications/:id",
  verifyToken,
  adminMiddleware,
  getNotificationById
);

router.post(
  "/notifications",
  verifyToken,
  adminMiddleware,
  createNotification
);

router.put(
  "/notifications/:id",
  verifyToken,
  adminMiddleware,
  updateNotification
);

router.delete(
  "/notifications/:id",
  verifyToken,
  adminMiddleware,
  deleteNotification
);
/* =========================
   ATTACHMENTS CRUD
========================= */

router.get(
  "/attachments",
  verifyToken,
  adminMiddleware,
  getAllAttachments
);

router.get(
  "/attachments/:id",
  verifyToken,
  adminMiddleware,
  getAttachmentById
);

router.post(
  "/attachments",
  verifyToken,
  adminMiddleware,
  createAttachment
);

router.put(
  "/attachments/:id",
  verifyToken,
  adminMiddleware,
  updateAttachment
);

router.delete(
  "/attachments/:id",
  verifyToken,
  adminMiddleware,
  deleteAttachment
);
/* =========================
   ACTIVITY LOGS CRUD
========================= */

router.get(
  "/activity-logs",
  verifyToken,
  adminMiddleware,
  getAllActivityLogs
);

router.get(
  "/activity-logs/:id",
  verifyToken,
  adminMiddleware,
  getActivityLogById
);

router.post(
  "/activity-logs",
  verifyToken,
  adminMiddleware,
  createActivityLog
);

router.put(
  "/activity-logs/:id",
  verifyToken,
  adminMiddleware,
  updateActivityLog
);

router.delete(
  "/activity-logs/:id",
  verifyToken,
  adminMiddleware,
  deleteActivityLog
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