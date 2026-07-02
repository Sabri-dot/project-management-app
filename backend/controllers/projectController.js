const db = require("../config/db");

/* =========================
   GET MY PROJECTS
========================= */

const getMyProjects = (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  const status = req.query.status;
  const search = req.query.search;

  let sql = `
  SELECT
    projects.id,
    projects.title,
    projects.description,
    projects.status,
    projects.priority,

    CASE
      WHEN COUNT(tasks.id) = 0 THEN 0
      ELSE ROUND(
        (
          SUM(
            CASE
              WHEN tasks.status = 'done'
              THEN 1
              ELSE 0
            END
          ) * 100
        ) / COUNT(tasks.id)
      )
    END AS progress,

    projects.created_at

  FROM projects

  LEFT JOIN project_members
    ON projects.id = project_members.project_id

  LEFT JOIN tasks
    ON projects.id = tasks.project_id

  WHERE 1=1
`;

  const values = [];


  if (role === "admin") {
    // admin sheh krejt
  } 
  else if (role === "project_manager") {
  sql += `
    AND (
      projects.created_by = ?
      OR project_members.user_id = ?
    )
  `;
  values.push(userId);
  values.push(userId);
}
  else {
    sql += ` AND project_members.user_id = ? `;
    values.push(userId);
  }

  if (status && status !== "all") {
    sql += ` AND projects.status = ? `;
    values.push(status);
  }

  if (search) {
    sql += `
      AND (
        projects.title LIKE ?
        OR projects.description LIKE ?
      )
    `;
    values.push(`%${search}%`);
    values.push(`%${search}%`);
  }

  sql += `
  GROUP BY
    projects.id
  ORDER BY projects.created_at DESC
  `;

  db.query(sql, values, (err, projects) => {
    if (err) return res.status(500).json(err);

    const projectIds = projects.map(p => p.id);

    if (projectIds.length === 0) return res.json([]);

    const membersSql = `
      SELECT
        project_members.project_id,
        users.id,
        users.full_name,
        users.avatar
      FROM project_members
      JOIN users ON users.id = project_members.user_id
      WHERE project_members.project_id IN (?)
    `;

    db.query(membersSql, [projectIds], (err, members) => {
      if (err) return res.status(500).json(err);

      const final = projects.map(project => ({
        ...project,
        members: members
          .filter(m => m.project_id === project.id)
          .map(m => ({
            id: m.id,
            name: m.full_name,
            avatar: m.avatar
          }))
      }));

      res.json(final);
    });
  });
};

/* =========================
   GET MY TASKS IN PROJECT
========================= */

const getMyProjectTasks = (req, res) => {
  const userId = req.user.id;
  const projectId = req.params.id;

  const sql = `
    SELECT
      id,
      title,
      description,
      priority,
      status,
      due_date
    FROM tasks
    WHERE project_id = ?
    AND assigned_to = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [projectId, userId], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};

/* =========================
   GET PROJECT MEMBERS
========================= */

const getProjectMembers = (req, res) => {
  const projectId = req.params.id;

  const sql = `
    SELECT
      users.id,
      users.full_name,
      users.email,
      users.role,
      users.avatar
    FROM project_members
    JOIN users
      ON project_members.user_id = users.id
    WHERE project_members.project_id = ?
  `;

  db.query(sql, [projectId], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};

/* =========================
   ADD MEMBER + REAL TIME NOTIFICATION
   
========================= */

const addProjectMember = (req, res) => {
  const projectId = req.params.id;
  const userId = req.body.userId;

  const creatorCheckSql = `
    SELECT created_by
    FROM projects
    WHERE id = ?
  `;

  db.query(creatorCheckSql, [projectId], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const project = result[0];

    // ✅ FIXED PERMISSIONS
    if (
      req.user.role !== "admin" &&
      req.user.role !== "project_manager"
    ) {
      return res.status(403).json({
        message: "Not allowed to add members to this project",
      });
    }

    const sql = `
      INSERT INTO project_members (project_id, user_id)
      VALUES (?, ?)
    `;

    db.query(sql, [projectId, userId], (err) => {
      if (err) return res.status(500).json(err);

      const io = req.app.get("io");

      io.to(`user_${userId}`).emit("notification", {
        _id: Date.now(),
        message: "You were added to a new project",
        fullMessage: "Manager has added you to a project",
        isRead: false,
      });

      res.json({
        message: "Member added successfully",
      });
    });
  });
};

/* =======================
       ADMIN CRUD
=========================*/
const getAllProjects = (req, res) => {
  db.query(
    `
    SELECT
      p.id,
      p.title,
      p.description,
      p.status,
      p.priority,
      p.due_date,
      p.created_at,

      u.full_name AS created_by_name,

      COUNT(DISTINCT pm.user_id) AS membersCount,

      COUNT(DISTINCT t.id) AS totalTasks,

      SUM(
        CASE
          WHEN t.status = 'done'
          THEN 1
          ELSE 0
        END
      ) AS completedTasks,

      CASE
        WHEN COUNT(DISTINCT t.id) = 0
        THEN 0
        ELSE ROUND(
          (
            SUM(
              CASE
                WHEN t.status = 'done'
                THEN 1
                ELSE 0
              END
            ) * 100
          ) /
          COUNT(DISTINCT t.id)
        )
      END AS progress

    FROM projects p

    LEFT JOIN users u
      ON p.created_by = u.id

    LEFT JOIN project_members pm
      ON p.id = pm.project_id

    LEFT JOIN tasks t
      ON p.id = t.project_id

    GROUP BY p.id

    ORDER BY p.created_at DESC
    `,
    (err, projects) => {

      if (err)
        return res.status(500).json(err);

      if (projects.length === 0)
        return res.json([]);

      const ids =
        projects.map((p) => p.id);

      db.query(
        `
        SELECT
          pm.project_id,
          u.id,
          u.full_name,
          u.avatar
        FROM project_members pm

        JOIN users u
          ON u.id = pm.user_id

        WHERE pm.project_id IN (?)
        `,
        [ids],
        (err, members) => {

          if (err)
            return res.status(500).json(err);

          const finalProjects =
            projects.map((project) => ({
              ...project,
              members: members
  .filter((m) => m.project_id === project.id)
  .map((m) => ({
    id: m.id,
    name: m.full_name,
    avatar: m.avatar,
  })),
            }));

          res.json(finalProjects);
        }
      );
    }
  );
};
const getProjectById = (req, res) => {
  const projectId = req.params.id;

  db.query(
    `
    SELECT
      p.*,
      u.full_name AS created_by_name
    FROM projects p
    LEFT JOIN users u
      ON p.created_by = u.id
    WHERE p.id = ?
    `,
    [projectId],
    (err, result) => {
      if (err)
        return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      res.json(result[0]);
    }
  );
};
const getProjectDetails = (
  req,
  res
) => {

  const projectId =
    req.params.id;

  db.query(
    `
    SELECT *
    FROM projects
    WHERE id = ?
    `,
    [projectId],
    (err, projectResult) => {

      if (err)
        return res.status(500).json(err);

      if (
        projectResult.length === 0
      ) {
        return res
          .status(404)
          .json({
            message:
              "Project not found",
          });
      }

      const project =
        projectResult[0];

      db.query(
        `
        SELECT
          t.*,
          u.full_name,
          u.avatar
        FROM tasks t

        LEFT JOIN users u
          ON u.id =
          t.assigned_to

        WHERE t.project_id = ?
        `,
        [projectId],
        (err, tasks) => {

          if (err)
            return res.status(500).json(err);

          db.query(
            `
            SELECT
              u.id,
              u.full_name,
              u.email,
              u.role,
              u.avatar
            FROM project_members pm

            JOIN users u
              ON u.id =
              pm.user_id

            WHERE pm.project_id = ?
            `,
            [projectId],
            (err, members) => {

              if (err)
                return res
                  .status(500)
                  .json(err);

              const total =
                tasks.length;

              const done =
                tasks.filter(
                  (t) =>
                    t.status ===
                    "done"
                ).length;

              const progress =
                total > 0
                  ? Math.round(
                      (done /
                        total) *
                        100
                    )
                  : 0;

              res.json({
                ...project,
                progress,
                tasks,
                members,
              });
            }
          );
        }
      );
    }
  );
};
const createProject = (req, res) => {
  const {
    title,
    description,
    status,
    priority,
    due_date,
  } = req.body;

  const userId = req.user.id;
  const role = req.user.role;

  let createdBy = userId;

  // project manager ose admin mund me kriju
  if (role !== "admin" && role !== "project_manager") {
    return res.status(403).json({
      message: "No permission to create project"
    });
  }

  db.query(
    `
    INSERT INTO projects
    (title, description, status, priority, due_date, created_by)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [title, description, status, priority, due_date, createdBy],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Project created successfully",
        projectId: result.insertId,
      });
    }
  );
};
const updateProject = (req, res) => {
  const projectId = req.params.id;

  const {
    title,
    description,
    status,
    priority,
  } = req.body;

  db.query(
    `
    UPDATE projects
    SET
      title = ?,
      description = ?,
      status = ?,
      priority = ?
    WHERE id = ?
    `,
    [
      title,
      description,
      status,
      priority,
      projectId,
    ],
    (err) => {
      if (err)
        return res.status(500).json(err);

      res.json({
        message:
          "Project updated successfully",
      });
    }
  );
};
const deleteProject = (req, res) => {
  const projectId = req.params.id;

  db.query(
    `
    DELETE FROM project_members
    WHERE project_id = ?
    `,
    [projectId],
    (err) => {
      if (err)
        return res.status(500).json(err);

      db.query(
        `
        DELETE FROM tasks
        WHERE project_id = ?
        `,
        [projectId],
        (err) => {
          if (err)
            return res.status(500).json(err);

          db.query(
            `
            DELETE FROM projects
            WHERE id = ?
            `,
            [projectId],
            (err) => {
              if (err)
                return res.status(500).json(err);

              res.json({
                message:
                  "Project deleted successfully",
              });
            }
          );
        }
      );
    }
  );
};
/* =========================
   EXPORTS
========================= */

module.exports = {
  getMyProjects,
  getMyProjectTasks,
  getProjectMembers,
  addProjectMember,

  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectDetails,
};