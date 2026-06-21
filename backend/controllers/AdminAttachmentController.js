const db = require("../config/db");

/* =========================
   GET ALL ATTACHMENTS
========================= */

const getAllAttachments = (req, res) => {
  db.query(
  `
  SELECT
    a.*,
    t.title AS task_title,
    p.title AS project_title,
    u.full_name AS uploaded_by_name
  FROM attachments a
  LEFT JOIN tasks t ON a.task_id = t.id
  LEFT JOIN projects p ON t.project_id = p.id
  LEFT JOIN users u ON a.uploaded_by = u.id
  ORDER BY a.created_at DESC
  `,
  (err, result) => {
    if (err) return res.status(500).json(err);
  const fixedResult = result.map((a) => ({
  ...a,
  file_url: a.file_url.replace(/\\/g, "/"),
}));

res.json(fixedResult);
  }
);
};

/* =========================
   GET ATTACHMENT BY ID
========================= */

const getAttachmentById = (req, res) => {
  const attachmentId = req.params.id;

  db.query(
    `
    SELECT
      a.*,
      t.title AS task_title,
      u.full_name AS uploaded_by_name
    FROM attachments a
    LEFT JOIN tasks t
      ON a.task_id = t.id
    LEFT JOIN users u
      ON a.uploaded_by = u.id
    WHERE a.id = ?
    `,
    [attachmentId],
    (err, result) => {
      if (err)
        return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(404).json({
          message: "Attachment not found",
        });
      }

      res.json(result[0]);
    }
  );
};

/* =========================
   CREATE ATTACHMENT
========================= */

const createAttachment = (req, res) => {
  const { task_id, uploaded_by } = req.body;

  if (!req.file) {
    return res.status(400).json({
      message: "No file uploaded",
    });
  }

  const file_name = req.file.filename;

  const file_url =
    req.file.path.replace(/\\/g, "/");

  db.query(
    `
    INSERT INTO attachments
    (
      task_id,
      file_name,
      file_url,
      uploaded_by
    )
    VALUES (?, ?, ?, ?)
    `,
    [
      task_id,
      file_name,
      file_url,
      uploaded_by,
    ],
    (err, result) => {
      if (err)
        return res.status(500).json(err);

      res.status(201).json({
        message:
          "Attachment created successfully",
        id: result.insertId,
      });
    }
  );
};

/* =========================
   UPDATE ATTACHMENT
========================= */

const updateAttachment = (req, res) => {
  const attachmentId = req.params.id;

  if (!req.file) {
    return res.status(400).json({
      message: "No file uploaded",
    });
  }

  const file_name =
    req.file.filename;

  const file_url =
    req.file.path.replace(
      /\\/g,
      "/"
    );

  db.query(
    `
    UPDATE attachments
    SET
      file_name = ?,
      file_url = ?
    WHERE id = ?
    `,
    [
      file_name,
      file_url,
      attachmentId,
    ],
    (err) => {
      if (err)
        return res.status(500).json(err);

      res.json({
        message:
          "Attachment updated successfully",
      });
    }
  );
};

/* =========================
   DELETE ATTACHMENT
========================= */

const deleteAttachment = (req, res) => {
  const attachmentId = req.params.id;

  db.query(
    `
    DELETE FROM attachments
    WHERE id = ?
    `,
    [attachmentId],
    (err) => {
      if (err)
        return res.status(500).json(err);

      res.json({
        message:
          "Attachment deleted successfully",
      });
    }
  );
};

module.exports = {
  getAllAttachments,
  getAttachmentById,
  createAttachment,
  updateAttachment,
  deleteAttachment,
};