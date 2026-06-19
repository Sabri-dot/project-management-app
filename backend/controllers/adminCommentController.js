const db = require("../config/db");

/* =========================
   GET ALL COMMENTS
========================= */

const getAllComments = (req, res) => {
  db.query(
    `
    SELECT
      comments.id,
      comments.comment,
      comments.created_at,

      users.id AS user_id,
      users.full_name,

      tasks.id AS task_id,
      tasks.title AS task_title

    FROM comments

    LEFT JOIN users
      ON comments.user_id = users.id

    LEFT JOIN tasks
      ON comments.task_id = tasks.id

    ORDER BY comments.created_at DESC
    `,
    (err, result) => {
      if (err)
        return res.status(500).json(err);

      res.json(result);
    }
  );
};

/* =========================
   GET COMMENT BY ID
========================= */

const getCommentById = (req, res) => {
  const commentId = req.params.id;

  db.query(
    `
    SELECT *
    FROM comments
    WHERE id = ?
    `,
    [commentId],
    (err, result) => {
      if (err)
        return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(404).json({
          message: "Comment not found",
        });
      }

      res.json(result[0]);
    }
  );
};

/* =========================
   CREATE COMMENT
========================= */

const createComment = (req, res) => {
  const {
    task_id,
    user_id,
    comment,
  } = req.body;

  db.query(
    `
    INSERT INTO comments
    (
      task_id,
      user_id,
      comment
    )
    VALUES (?, ?, ?)
    `,
    [
      task_id,
      user_id,
      comment,
    ],
    (err, result) => {
      if (err)
        return res.status(500).json(err);

      res.status(201).json({
        message:
          "Comment created successfully",
        commentId:
          result.insertId,
      });
    }
  );
};

/* =========================
   UPDATE COMMENT
========================= */

const updateComment = (req, res) => {
  const commentId = req.params.id;

  const { comment } = req.body;

  db.query(
    `
    UPDATE comments
    SET comment = ?
    WHERE id = ?
    `,
    [
      comment,
      commentId,
    ],
    (err) => {
      if (err)
        return res.status(500).json(err);

      res.json({
        message:
          "Comment updated successfully",
      });
    }
  );
};

/* =========================
   DELETE COMMENT
========================= */

const deleteComment = (req, res) => {
  const commentId = req.params.id;

  db.query(
    `
    DELETE FROM comments
    WHERE id = ?
    `,
    [commentId],
    (err) => {
      if (err)
        return res.status(500).json(err);

      res.json({
        message:
          "Comment deleted successfully",
      });
    }
  );
};

module.exports = {
  getAllComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
};