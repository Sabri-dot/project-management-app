const express = require("express");
const router = express.Router();

const verifyToken =
  require("../middleware/authMiddleware");

const adminMiddleware =
  require("../middleware/adminMiddleware");

const {
  getAllComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
} = require(
  "../controllers/adminCommentController"
);

router.get(
  "/",
  verifyToken,
  adminMiddleware,
  getAllComments
);

router.get(
  "/:id",
  verifyToken,
  adminMiddleware,
  getCommentById
);

router.post(
  "/",
  verifyToken,
  adminMiddleware,
  createComment
);

router.put(
  "/:id",
  verifyToken,
  adminMiddleware,
  updateComment
);

router.delete(
  "/:id",
  verifyToken,
  adminMiddleware,
  deleteComment
);

module.exports = router;