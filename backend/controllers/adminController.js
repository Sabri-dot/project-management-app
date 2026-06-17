const db = require("../config/db");

/* =========================
   ALL USERS
========================= */

const getAllUsers = (
  req,
  res
) => {

  db.query(
    `
    SELECT
      id,
      full_name,
      email,
      role,
      avatar,
      created_at,
      last_seen
    FROM users
    ORDER BY created_at DESC
    `,
    (err, result) => {

      if (err) {
        return res
          .status(500)
          .json(err);
      }

      res.json(result);
    }
  );
};

/* =========================
   ALL PROJECTS
========================= */

const getAllProjects = (
  req,
  res
) => {

  db.query(
    `
    SELECT
      id,
      title,
      status,
      priority,
      created_at
    FROM projects
    ORDER BY created_at DESC
    `,
    (err, result) => {

      if (err) {
        return res
          .status(500)
          .json(err);
      }

      res.json(result);
    }
  );
};

/* =========================
   ALL TASKS
========================= */

const getAllTasks = (
  req,
  res
) => {

  db.query(
    `
    SELECT
      id,
      title,
      status,
      priority,
      due_date
    FROM tasks
    ORDER BY created_at DESC
    `,
    (err, result) => {

      if (err) {
        return res
          .status(500)
          .json(err);
      }

      res.json(result);
    }
  );
};

module.exports = {
  getAllUsers,
  getAllProjects,
  getAllTasks,
};