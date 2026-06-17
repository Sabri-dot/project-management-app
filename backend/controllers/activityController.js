const db = require("../config/db");

const getMyActivities = (
  req,
  res
) => {

  const userId =
    req.user.id;

  const sql = `
    SELECT

      activity_logs.id,
      activity_logs.action,
      activity_logs.created_at,

      users.full_name,
      users.avatar,
      users.role

    FROM activity_logs

    JOIN users
      ON users.id =
      activity_logs.user_id

    WHERE activity_logs.project_id IN (

      SELECT project_id
      FROM project_members
      WHERE user_id = ?

    )

    ORDER BY
      activity_logs.created_at DESC

    LIMIT 20
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

module.exports = {
  getMyActivities,
};