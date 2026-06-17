const db = require("../config/db");



const markAsRead = (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;

  const sql = `
    UPDATE notifications
    SET is_read = 1
    WHERE id = ? AND user_id = ?
  `;

  db.query(sql, [id, userId], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "OK" });
  });
};

module.exports = { markAsRead };

const getMyNotifications = (
  req,
  res
) => {

  const userId =
    req.user.id;

 const sql = `
  SELECT 
    id,
    user_id,
    title AS message,
    is_read AS isRead,
    created_at
  FROM notifications
  WHERE user_id = ?
  ORDER BY created_at DESC
`;

  db.query(
    sql,
    [userId],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json(result);

    }
  );

};

const markNotificationAsRead = (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;

  const sql = `
    UPDATE notifications
    SET is_read = 1
    WHERE id = ? AND user_id = ?
  `;

  db.query(sql, [id, userId], (err) => {
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