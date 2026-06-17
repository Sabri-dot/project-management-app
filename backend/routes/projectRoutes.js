const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  getMyProjects,
  getMyProjectTasks,
  getProjectMembers
} = require("../controllers/projectController");

/* =========================
   GET MY PROJECTS
========================= */
router.get(
  "/myprojects",
  verifyToken,
  getMyProjects
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

module.exports = router;