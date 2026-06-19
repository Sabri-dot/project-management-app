const db = require("../config/db");

/* =========================
   GET ALL NOTIFICATIONS
========================= */

const getAllNotifications = (req, res) => {
  db.query(
    `
    SELECT
      notifications.*,
      users.full_name
    FROM notifications
    LEFT JOIN users
      ON notifications.user_id = users.id
    ORDER BY notifications.created_at DESC
    `,
    (err, result) => {
      if (err)
        return res.status(500).json(err);

      res.json(result);
    }
  );
};

/* =========================
   GET NOTIFICATION BY ID
========================= */

const getNotificationById = (req, res) => {
  const notificationId = req.params.id;

  db.query(
    `
    SELECT
      notifications.*,
      users.full_name
    FROM notifications
    LEFT JOIN users
      ON notifications.user_id = users.id
    WHERE notifications.id = ?
    `,
    [notificationId],
    (err, result) => {
      if (err)
        return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(404).json({
          message: "Notification not found",
        });
      }

      res.json(result[0]);
    }
  );
};

/* =========================
   CREATE NOTIFICATION
========================= */

const createNotification = (req, res) => {
  const {
    user_id,
    title,
  } = req.body;

  db.query(
    `
    INSERT INTO notifications
    (
      user_id,
      title
    )
    VALUES (?, ?)
    `,
    [
      user_id,
      title,
    ],
    (err, result) => {
      if (err)
        return res.status(500).json(err);

      const io = req.app.get("io");

      io.to(`user_${user_id}`).emit(
        "notification",
        {
          message: title,
          type: "admin_notification",
          createdAt: new Date(),
        }
      );

      res.status(201).json({
        message:
          "Notification created successfully",
        notificationId:
          result.insertId,
      });
    }
  );
};

/* =========================
   UPDATE NOTIFICATION
========================= */

const updateNotification = (req, res) => {
  const notificationId =
    req.params.id;

  const {
    title,
    is_read,
  } = req.body;

  db.query(
    `
    UPDATE notifications
    SET
      title = ?,
      is_read = ?
    WHERE id = ?
    `,
    [
      title,
      is_read,
      notificationId,
    ],
    (err) => {
      if (err)
        return res.status(500).json(err);

      res.json({
        message:
          "Notification updated successfully",
      });
    }
  );
};

/* =========================
   DELETE NOTIFICATION
========================= */

const deleteNotification = (req, res) => {
  const notificationId =
    req.params.id;

  db.query(
    `
    DELETE FROM notifications
    WHERE id = ?
    `,
    [notificationId],
    (err) => {
      if (err)
        return res.status(500).json(err);

      res.json({
        message:
          "Notification deleted successfully",
      });
    }
  );
};

module.exports = {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
};