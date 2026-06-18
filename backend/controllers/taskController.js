const db = require("../config/db");

/* =========================
   MY TASKS (ACTIVE)
========================= */
const getMyTasks = (req, res) => {
  const userId = req.user.id;

  const sql = `
SELECT
  tasks.id,
  tasks.title,
  tasks.description,
  tasks.priority,
  tasks.status,
  tasks.due_date,

  projects.title AS project_name,

  users.id AS manager_id,
  users.full_name AS manager_name,
  users.email AS manager_email,
  users.avatar AS manager_avatar,
  users.bio AS manager_bio,
  users.role AS manager_role

FROM tasks

JOIN projects
  ON tasks.project_id = projects.id

JOIN users
  ON projects.created_by = users.id

WHERE tasks.assigned_to = ?
AND tasks.status != 'done'

ORDER BY tasks.created_at DESC
`;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Server Error",
      });
    }

    res.json(result);
  });
};

/* =========================
   ALL TASKS (COMPLETED)
========================= */
const getAllTasks = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT
  tasks.id,
  tasks.title,
  tasks.description,
  tasks.priority,
  tasks.status,
  tasks.due_date,
  tasks.completed_at,
  projects.title AS project_name
    FROM tasks
    JOIN projects
      ON tasks.project_id = projects.id
    WHERE tasks.assigned_to = ?
    AND tasks.status = 'done'
    ORDER BY tasks.created_at DESC
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};

/* =========================
   PROJECT TASKS
========================= */
const getProjectTasks = (req, res) => {
  const userId = req.user.id;
  const projectId = req.params.projectId;

  const sql = `
    SELECT
      id,
      title,
      description,
      priority,
      status,
      due_date
    FROM tasks
    WHERE assigned_to = ?
    AND project_id = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [userId, projectId], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};

/* =========================
   MARK TASK AS DONE (🔥 SOCKET ADDED)
========================= */
const markTaskAsDone = (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;

  db.query(
    `
    SELECT title, project_id
    FROM tasks
    WHERE id = ?
    `,
    [taskId],
    (err, taskResult) => {
      if (err) return res.status(500).json(err);

      const task = taskResult[0];

      db.query(
        `
        UPDATE tasks
SET
  status = 'done',
  completed_at = NOW()
WHERE id = ?
        `,
        [taskId],
        (err) => {
          if (err) return res.status(500).json(err);

          /* =========================
             ACTIVITY LOG
          ========================= */
          db.query(
            `
            INSERT INTO activity_logs
            (user_id, action, project_id, task_id)
            VALUES (?, ?, ?, ?)
            `,
            [
              userId,
              `completed task "${task.title}"`,
              task.project_id,
              taskId,
            ]
          );

          /* =========================
             GET PROJECT MEMBERS
          ========================= */
          db.query(
            `
            SELECT user_id
            FROM project_members
            WHERE project_id = ?
            `,
            [task.project_id],
            (err, members) => {
              if (!err && members.length > 0) {
                members.forEach((member) => {
                  /* =========================
                     SAVE NOTIFICATION
                  ========================= */
                  db.query(
                    `
                    INSERT INTO notifications (user_id, title)
                    VALUES (?, ?)
                    `,
                    [
                      member.user_id,
                      `Task "${task.title}" was completed`,
                    ]
                  );

                  /* =========================
                     🔥 SOCKET REAL TIME
                  ========================= */
                  const io = req.app.get("io");

                  io.to(`user_${member.user_id}`).emit("notification", {
                    message: `Task "${task.title}" was completed`,
                    type: "task_done",
                    taskId,
                    projectId: task.project_id,
                    createdAt: new Date(),
                  });
                });
                io.to("admins").emit("notification", {
  message: `Task "${task.title}" was completed`,
  type: "task_done",
  createdAt: new Date(),
});
                
              }
            }
          );

          res.json({
            message: "Task marked as done",
          });
        }
      );
    }
  );
};

/* =========================
   START TASK
========================= */
const startTask = (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;

  db.query(
    `
    SELECT title, project_id
    FROM tasks
    WHERE id = ?
    `,
    [taskId],
    (err, taskResult) => {
      if (err) return res.status(500).json(err);

      const task = taskResult[0];

      db.query(
        `
        UPDATE tasks
        SET status = 'in_progress'
        WHERE id = ?
        `,
        [taskId],
        (err) => {
          if (err) return res.status(500).json(err);

          db.query(
            `
            INSERT INTO activity_logs
            (user_id, action, project_id, task_id)
            VALUES (?, ?, ?, ?)
            `,
            [
              userId,
              `started working on "${task.title}"`,
              task.project_id,
              taskId,
            ]
          );

          res.json({
            message: "Task started",
          });
        }
      );
    }
  );
};

module.exports = {
  getMyTasks,
  getAllTasks,
  getProjectTasks,
  markTaskAsDone,
  startTask,
};