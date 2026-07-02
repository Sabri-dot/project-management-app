const db = require("../config/db");

const getMyNotifications = (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  let sql = `
    SELECT 
      id,
      user_id,
      title AS message,
      is_read,
      created_at
    FROM notifications
  `;

  let params = [];

  if (role !== "admin") {
    sql += ` WHERE user_id = ? `;
    params.push(userId);
  }

  sql += ` ORDER BY created_at DESC`;

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};
const markNotificationAsRead = (req, res) => {
  const id = req.params.id;

  const sql = `
    UPDATE notifications
    SET is_read = 1
    WHERE id = ?
  `;

  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Marked as read" });
  });
};

const deleteNotification = (req, res) => {
  const userId = req.user.id;
  const notifId = req.params.id;

  const sql = `
    DELETE FROM notifications
    WHERE id = ?
    AND user_id = ?
  `;

  db.query(sql, [notifId, userId], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Deleted" });
  });
};
module.exports = {
  getMyNotifications,
  markNotificationAsRead,
  deleteNotification,
};