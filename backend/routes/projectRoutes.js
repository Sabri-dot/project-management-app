const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  getMyProjects,
  getMyProjectTasks,
  getProjectMembers,
   getUsers,
  getMyProjectDetails
} = require("../controllers/projectController");
const {
  createProject,
  updateProject,
  deleteProject,
  addProjectMember
} = require("../controllers/projectController");

const isProjectManager = require("../middleware/isProjectManager");
/* =========================
   GET MY PROJECTS
========================= */
router.get(
  "/myprojects",
  verifyToken,
  getMyProjects
);
router.get(
  "/users",
  verifyToken,
  isProjectManager,
  getUsers
);
/*============================
      GET PM PROJECT DETAILS
============================*/
router.get(
  "/:id",
  verifyToken,
  getMyProjectDetails
);
/* =========================
   GET MY TASKS IN PROJECT
========================= */
router.get(
  "/:id/mytasks",
  verifyToken,
  getMyProjectTasks
);

/* =========================
   GET PROJECT MEMBERS
========================= */
router.get(
  "/:id/members",
  verifyToken,
  getProjectMembers
);

router.post(
  "/",
  verifyToken,
  isProjectManager,
  createProject
);

router.put(
  "/:id",
  verifyToken,
  isProjectManager,
  updateProject
);

router.delete(
  "/:id",
  verifyToken,
  isProjectManager,
  deleteProject
);

router.post(
  "/:id/members",
  verifyToken,

  addProjectMember
);
module.exports = router;