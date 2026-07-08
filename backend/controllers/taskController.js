const db = require("../config/db");

/* =========================
   CHECK PROJECT OWNERSHIP
========================= */
const checkProjectOwnership = (projectId, userId, callback) => {
  db.query(
    `
    SELECT id
    FROM projects
    WHERE id = ?
    AND created_by = ?
    `,
    [projectId, userId],
    (err, result) => {
      if (err) return callback(err, false);
      if (!result.length) return callback(null, false);
      return callback(null, true);
    }
  );
};
const getProjectManagerAllTasks = (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  if (role !== "project_manager") {
    return res.status(403).json({ message: "Not allowed" });
  }

  const sql = `
    SELECT 
      t.*,
      p.title AS project_name,
      u.full_name AS assigned_user,
      u.avatar AS assigned_avatar
    FROM tasks t
    JOIN projects p ON t.project_id = p.id
    LEFT JOIN users u ON t.assigned_to = u.id
    WHERE 
      p.created_by = ?
      OR EXISTS (
        SELECT 1 
        FROM project_members pm
        WHERE pm.project_id = t.project_id
        AND pm.user_id = ?
      )
    ORDER BY t.created_at DESC
  `;

  db.query(sql, [userId, userId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};
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
JOIN projects ON tasks.project_id = projects.id
JOIN users ON projects.created_by = users.id
WHERE tasks.assigned_to = ?
AND tasks.status != 'done'
ORDER BY tasks.created_at DESC
`;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: "Server Error" });
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
JOIN projects ON tasks.project_id = projects.id
WHERE tasks.assigned_to = ?
AND tasks.status = 'done'
ORDER BY tasks.created_at DESC
`;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

/* =========================
   PROJECT TASKS
========================= */
const getProjectTasks = (req, res) => {
  const role = req.user.role;
  const userId = req.user.id;
  const projectId = req.params.projectId;

  let sql;
  let params;

  // ADMIN → full access
  if (role === "admin") {
    sql = `
      SELECT *
      FROM tasks
      WHERE project_id = ?
      ORDER BY created_at DESC
    `;
    params = [projectId];
  }

  else if (role === "project_manager") {
  sql = `
    SELECT t.*, u.full_name AS assigned_name, u.avatar AS assigned_avatar
    FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.id
    WHERE t.project_id = ?
    AND EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = t.project_id
      AND p.created_by = ?
    )
    ORDER BY t.created_at DESC
  `;

  params = [projectId, userId];
}
  // TEAM MEMBER → only assigned tasks
  else {
    sql = `
      SELECT *
      FROM tasks
      WHERE project_id = ?
      AND assigned_to = ?
      ORDER BY created_at DESC
    `;
    params = [projectId, userId];
  }

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};
/* =========================
   MARK TASK AS DONE
========================= */
const markTaskAsDone = (req, res) => {
  const io = req.app.get("io");
  const taskId = req.params.id;
  const userId = req.user.id;
  const role = req.user.role;

  db.query(
    `
    SELECT project_id, assigned_to, title
    FROM tasks
    WHERE id = ?
    `,
    [taskId],
    (err, taskResult) => {
      if (err) return res.status(500).json(err);

      if (!taskResult.length) {
        return res.status(404).json({ message: "Task not found" });
      }

      const task = taskResult[0];

      // ADMIN → full access
      if (role === "admin") {
        return finishTask();
      }

      //  PROJECT MANAGER → must be member of project
      if (role === "project_manager") {
        db.query(
          `
          SELECT 1
          FROM project_members
          WHERE project_id = ?
          AND user_id = ?
          `,
          [task.project_id, userId],
          (err, check) => {
            if (err) return res.status(500).json(err);

            if (!check.length) {
              return res.status(403).json({
                message: "Not allowed",
              });
            }

            finishTask();
          }
        );
        return;
      }

      //  NORMAL USER → only assigned user
      if (task.assigned_to !== userId) {
        return res.status(403).json({ message: "Not allowed" });
      }

      finishTask();

      function finishTask() {
        db.query(
          `
          UPDATE tasks
          SET status = 'done',
              completed_at = NOW()
          WHERE id = ?
          `,
          [taskId],
          (err) => {
  if (err) return res.status(500).json(err);
  console.log("ROLE:", role);
  // Vetëm kur Team Member e përfundon task-un
  if (role === "team_member") {
    console.log("INSIDE TEAM MEMBER");
    db.query(
      `
      SELECT created_by
      FROM projects
      WHERE id = ?
      `,
      [task.project_id],
      (err, projectResult) => {

  console.log("PROJECT ERROR:", err);
  console.log("PROJECT RESULT:", projectResult);

  if (!err && projectResult.length) {

    const managerId = projectResult[0].created_by;

    console.log("MANAGER ID:", managerId);

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
        managerId,
        `Task "${task.title}" has been marked as done`
      ],
      (err) => {
        console.log("INSERT ERROR:", err);
        console.log("INSERT OK");
      }
    );

    io.to(`user_${managerId}`).emit("notification", {
      message: `Task "${task.title}" has been marked as done`,
      type: "task_done",
      createdAt: new Date(),
    });

  }

  res.json({
    message: "Task marked as done",
  });

}
    );

    return;
  }

  res.json({
    message: "Task marked as done",
  });
}
        );
      }
    }
  );
};
/* =========================
   START TASK
========================= */
const startTask = (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;
  const role = req.user.role;

  db.query(
    `
    SELECT project_id, assigned_to, title
    FROM tasks
    WHERE id = ?
    `,
    [taskId],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (!result.length) {
        return res.status(404).json({ message: "Task not found" });
      }

      const task = result[0];

      // 🔐 ADMIN → full access
      if (role === "admin") {
        return updateTask();
      }

      // 🔐 PROJECT MANAGER → must be project member
      if (role === "project_manager") {
        db.query(
          `
          SELECT 1
          FROM project_members
          WHERE project_id = ?
          AND user_id = ?
          `,
          [task.project_id, userId],
          (err, check) => {
            if (err) return res.status(500).json(err);

            if (!check.length) {
              return res.status(403).json({
                message: "Not allowed",
              });
            }

            updateTask();
          }
        );
        return;
      }

      // 🔐 NORMAL USER → only assigned user
      if (task.assigned_to !== userId) {
        return res.status(403).json({ message: "Not allowed" });
      }

      updateTask();

      function updateTask() {
        db.query(
          `
          UPDATE tasks
          SET status = 'in_progress'
          WHERE id = ?
          `,
          [taskId],
          (err) => {
            if (err) return res.status(500).json(err);

            res.json({ message: "Task started" });
          }
        );
      }
    }
  );
};

/* =========================
   ADMIN - GET ALL TASKS
========================= */
const getAdminTasks = (req, res) => {
  db.query(
    `
    SELECT
      t.*,
      p.title AS project_name,
      u.full_name AS assigned_user,
      u.avatar AS assigned_avatar
    FROM tasks t
    LEFT JOIN projects p ON t.project_id = p.id
    LEFT JOIN users u ON t.assigned_to = u.id
    ORDER BY t.created_at DESC
    `,
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
};

/* =========================
   ADMIN - GET TASK BY ID
========================= */
const getTaskById = (req, res) => {
  const taskId = req.params.id;

  db.query(
    `
    SELECT *
    FROM tasks
    WHERE id = ?
    `,
    [taskId],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (!result.length) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.json(result[0]);
    }
  );
};

/* =========================
   CREATE TASK
========================= */
const createTask = (req, res) => {
  const {
    title,
    description,
    priority,
    status,
    due_date,
    project_id,
    assigned_to,
  } = req.body;

  const userId = req.user.id;
  const role = req.user.role;

  const insertTask = () => {
    db.query(
      `
     INSERT INTO tasks
(
title,
description,
priority,
status,
due_date,
project_id,
assigned_to,
created_by
)
VALUES
(
?,
?,
?,
?,
?,
?,
?,
?
)
      `,
      [
title,
description,
priority,
status,
due_date,
project_id,
assigned_to,
userId
],
      (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({
          message: "Task created successfully",
          taskId: result.insertId,
        });
      }
    );
  };

 if (role === "project_manager") {
  db.query(
    `
    SELECT 1
    FROM project_members
    WHERE project_id = ?
    AND user_id = ?
    `,
    [project_id, userId],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (!result.length) {
        return res.status(403).json({
          message: "Not allowed in this project",
        });
      }

      // 🔥 NEW CHECK (IMPORTANT)
      db.query(
        `
        SELECT 1
        FROM project_members
        WHERE project_id = ?
        AND user_id = ?
        `,
        [project_id, assigned_to],
        (err, result2) => {
          if (err) return res.status(500).json(err);

          if (!result2.length) {
            return res.status(403).json({
              message: "Assigned user is not in this project",
            });
          }

          insertTask();
        }
      );
    }
  );
} else {
  insertTask();
}
};

/* =========================
   UPDATE TASK
========================= */
const updateTask = (req, res) => {
  const taskId = req.params.id;
  const {
    title,
    description,
    priority,
    status,
    due_date,
    project_id,
    assigned_to,
  } = req.body;

  const userId = req.user.id;
  const role = req.user.role;

  const doUpdate = () => {
    let completedAt = status === "done" ? new Date() : null;

    db.query(
      `UPDATE tasks SET title=?, description=?, priority=?, status=?, due_date=?, project_id=?, assigned_to=?, completed_at=? WHERE id=?`,
      [
        title,
        description,
        priority,
        status,
        due_date,
        project_id,
        assigned_to,
        completedAt,
        taskId,
      ],
      (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Task updated successfully" });
      }
    );
  };
if (role === "project_manager") {

  db.query(
    `
    SELECT created_by
    FROM tasks
    WHERE id = ?
    `,
    [taskId],
    (err, result) => {

      if (err) return res.status(500).json(err);

      if (!result.length) {
        return res.status(404).json({
          message: "Task not found",
        });
      }

      if (result[0].created_by !== userId) {
        return res.status(403).json({
          message: "You can only edit tasks that you created.",
        });
      }

      db.query(
        `
        SELECT 1
        FROM project_members
        WHERE project_id = ?
        AND user_id = ?
        `,
        [project_id, assigned_to],
        (err, r) => {

          if (err) return res.status(500).json(err);

          if (!r.length) {
            return res.status(403).json({
              message: "Assigned user is not in this project.",
            });
          }

          doUpdate();

        }
      );

    }
  );

}
else {

  doUpdate();

}
};

/* =========================
   DELETE TASK
========================= */
const deleteTask = (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;
  const role = req.user.role;

  db.query(
    `SELECT project_id FROM tasks WHERE id = ?`,
    [taskId],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (!result.length) {
        return res.status(404).json({ message: "Task not found" });
      }

      const projectId = result[0].project_id;

      const doDelete = () => {
        db.query(`DELETE FROM tasks WHERE id = ?`, [taskId], (err) => {
          if (err) return res.status(500).json(err);
          res.json({ message: "Task deleted successfully" });
        });
      };

      if (role === "project_manager") {

  db.query(
    `
    SELECT created_by
    FROM tasks
    WHERE id = ?
    `,
    [taskId],
    (err, taskResult) => {

      if (err) return res.status(500).json(err);

      if (!taskResult.length) {
        return res.status(404).json({
          message: "Task not found",
        });
      }

      if (taskResult[0].created_by !== userId) {
        return res.status(403).json({
          message: "You can only delete tasks that you created.",
        });
      }

      doDelete();

    }
  );

} else {

  doDelete();

}
    }
  );
};

/* =========================
   FORM DATA
========================= */
const getTaskFormData = (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  let projectSql;
  let projectParams;

  if (role === "admin") {
    projectSql = `SELECT id, title FROM projects`;
    projectParams = [];
  }

  else if (role === "project_manager") {
    projectSql = `
      SELECT DISTINCT p.id, p.title
      FROM projects p
      LEFT JOIN project_members pm ON pm.project_id = p.id
      WHERE p.created_by = ? OR pm.user_id = ?
    `;
    projectParams = [userId, userId];
  }

  else {
    projectSql = `
      SELECT p.id, p.title
      FROM projects p
      JOIN project_members pm ON pm.project_id = p.id
      WHERE pm.user_id = ?
    `;
    projectParams = [userId];
  }

  db.query(projectSql, projectParams, (err, projects) => {
    if (err) return res.status(500).json(err);

    const userSql = `
      SELECT id, full_name, role, avatar
      FROM users
    `;

    db.query(userSql, (err, users) => {
      if (err) return res.status(500).json(err);

      res.json({ projects, users });
    });
  });
};
const getProjectAllTasks = (req, res) => {
  const projectId = req.params.projectId;
  const userId = req.user.id;
  const role = req.user.role;

  let sql;
  let params;

  // ADMIN → full access
  if (role === "admin") {
    sql = `
      SELECT t.*, u.full_name AS assigned_name, u.avatar AS assigned_avatar
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.project_id = ?
      ORDER BY t.created_at DESC
    `;
    params = [projectId];
  }

  // PROJECT MANAGER → only if member
  else if (role === "project_manager") {
    sql = `
      SELECT t.*, u.full_name AS assigned_name, u.avatar AS assigned_avatar
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.project_id = ?
      AND EXISTS (
        SELECT 1 FROM project_members pm
        WHERE pm.project_id = t.project_id
        AND pm.user_id = ?
      )
      ORDER BY t.created_at DESC
    `;
    params = [projectId, userId];
  }

  // TEAM MEMBER → only assigned
  else {
    sql = `
      SELECT t.*, u.full_name AS assigned_name, u.avatar AS assigned_avatar
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.project_id = ?
      AND t.assigned_to = ?
      ORDER BY t.created_at DESC
    `;
    params = [projectId, userId];
  }

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

module.exports = {
  getMyTasks,
  getAllTasks,
  getProjectTasks,
  markTaskAsDone,
  startTask,
  getAdminTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskFormData,
  getProjectAllTasks,
   getProjectManagerAllTasks,
};