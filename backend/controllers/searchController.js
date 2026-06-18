const db = require("../config/db");

const globalSearch = (req, res) => {
  const keyword = req.query.q;
  const userId = req.user.id;
  const role = req.user.role;

  if (!keyword) {
    return res.json({
      projects: [],
      tasks: [],
    });
  }

  /* =========================
     ADMIN SEARCH
  ========================= */
  if (role === "admin") {
    const projectsSql = `
      SELECT
        id,
        title
      FROM projects
      WHERE title LIKE ?
      LIMIT 10
    `;

    const tasksSql = `
      SELECT
        id,
        title
      FROM tasks
      WHERE title LIKE ?
      LIMIT 10
    `;

    db.query(
      projectsSql,
      [`%${keyword}%`],
      (err, projects) => {
        if (err) {
          return res.status(500).json(err);
        }

        db.query(
          tasksSql,
          [`%${keyword}%`],
          (err, tasks) => {
            if (err) {
              return res.status(500).json(err);
            }

            res.json({
              projects,
              tasks,
            });
          }
        );
      }
    );

    return;
  }

  /* =========================
     TEAM MEMBER / PM SEARCH
  ========================= */

  const projectsSql = `
    SELECT DISTINCT
      projects.id,
      projects.title
    FROM projects
    JOIN project_members
      ON projects.id = project_members.project_id
    WHERE project_members.user_id = ?
    AND projects.title LIKE ?
    LIMIT 5
  `;

  const tasksSql = `
    SELECT
      tasks.id,
      tasks.title
    FROM tasks
    WHERE tasks.assigned_to = ?
    AND tasks.title LIKE ?
    LIMIT 5
  `;

  db.query(
    projectsSql,
    [userId, `%${keyword}%`],
    (err, projects) => {
      if (err) {
        return res.status(500).json(err);
      }

      db.query(
        tasksSql,
        [userId, `%${keyword}%`],
        (err, tasks) => {
          if (err) {
            return res.status(500).json(err);
          }

          res.json({
            projects,
            tasks,
          });
        }
      );
    }
  );
};

module.exports = {
  globalSearch,
};