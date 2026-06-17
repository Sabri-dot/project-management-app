const express = require("express");

const router =
  express.Router();

const verifyToken =
  require(
    "../middleware/authMiddleware"
  );

const upload =
  require(
    "../middleware/upload"
  );

const {
  uploadAttachment,
  getTaskAttachments,
  deleteAttachment,
} = require(
  "../controllers/attachmentController"
);

router.post(
  "/",
  verifyToken,
  upload.single("file"),
  uploadAttachment
);

router.get(
  "/:taskId",
  verifyToken,
  getTaskAttachments
);

router.delete(
  "/:id",
  verifyToken,
  deleteAttachment
);

module.exports = router;