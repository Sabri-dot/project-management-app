const express = require("express");

const router = express.Router();

const verifyToken = require(
  "../middleware/authMiddleware"
);

const {
  addComment,
  getTaskComments,
  updateComment,
  deleteComment,
} = require(
  "../controllers/commentController"
);

router.post(
  "/",
  verifyToken,
  addComment
);

router.get(
  "/:taskId",
  verifyToken,
  getTaskComments
);

router.put(
  "/:id",
  verifyToken,
  updateComment
);

router.delete(
  "/:id",
  verifyToken,
  deleteComment
);

module.exports = router;