const db = require("../config/db");

/* =========================
   GET ALL ACTIVITY LOGS
========================= */

const getAllActivityLogs = (req, res) => {
  db.query(
    `
    SELECT
      a.*,
      u.full_name
    FROM activity_logs a
    LEFT JOIN users u
      ON a.user_id = u.id
    ORDER BY a.created_at DESC
    `,
    (err, result) => {
      if (err)
        return res.status(500).json(err);

      res.json(result);
    }
  );
};

/* =========================
   GET ACTIVITY LOG BY ID
========================= */

const getActivityLogById = (req, res) => {
  const logId = req.params.id;

  db.query(
    `
    SELECT
      a.*,
      u.full_name
    FROM activity_logs a
    LEFT JOIN users u
      ON a.user_id = u.id
    WHERE a.id = ?
    `,
    [logId],
    (err, result) => {
      if (err)
        return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(404).json({
          message: "Activity log not found",
        });
      }

      res.json(result[0]);
    }
  );
};

/* =========================
   CREATE ACTIVITY LOG
========================= */

const createActivityLog = (req, res) => {
  const {
    user_id,
    action,
    project_id,
    task_id,
  } = req.body;

  db.query(
    `
    INSERT INTO activity_logs
    (
      user_id,
      action,
      project_id,
      task_id
    )
    VALUES (?, ?, ?, ?)
    `,
    [
      user_id,
      action,
      project_id,
      task_id,
    ],
    (err, result) => {
      if (err)
        return res.status(500).json(err);

      res.status(201).json({
        message:
          "Activity log created successfully",
        id: result.insertId,
      });
    }
  );
};

/* =========================
   UPDATE ACTIVITY LOG
========================= */

const updateActivityLog = (req, res) => {
  const logId = req.params.id;

  const {
    user_id,
    action,
    project_id,
    task_id,
  } = req.body;

  db.query(
    `
    UPDATE activity_logs
    SET
      user_id = ?,
      action = ?,
      project_id = ?,
      task_id = ?
    WHERE id = ?
    `,
    [
      user_id,
      action,
      project_id,
      task_id,
      logId,
    ],
    (err) => {
      if (err)
        return res.status(500).json(err);

      res.json({
        message:
          "Activity log updated successfully",
      });
    }
  );
};

/* =========================
   DELETE ACTIVITY LOG
========================= */

const deleteActivityLog = (req, res) => {
  const logId = req.params.id;

  db.query(
    `
    DELETE FROM activity_logs
    WHERE id = ?
    `,
    [logId],
    (err) => {
      if (err)
        return res.status(500).json(err);

      res.json({
        message:
          "Activity log deleted successfully",
      });
    }
  );
};

module.exports = {
  getAllActivityLogs,
  getActivityLogById,
  createActivityLog,
  updateActivityLog,
  deleteActivityLog,
};