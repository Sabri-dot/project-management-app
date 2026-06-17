const db = require("../config/db");

/* =========================
   GET MY PROJECTS
========================= */

const getMyProjects = (req, res) => {
  const userId = req.user.id;

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

  JOIN project_members
    ON projects.id = project_members.project_id

  LEFT JOIN tasks
    ON projects.id = tasks.project_id

  WHERE project_members.user_id = ?
`;

  const values = [userId];

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
    projects.id,
    projects.title,
    projects.description,
    projects.status,
    projects.priority,
    projects.created_at
`;

sql += `
  ORDER BY projects.created_at DESC
`;

  db.query(sql, values, (err, projects) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (projects.length === 0) {
      return res.json([]);
    }

    const projectIds = projects.map((p) => p.id);

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
      if (err) {
        return res.status(500).json(err);
      }

      const finalProjects = projects.map((project) => ({
        ...project,
        members: members.filter(
          (m) => m.project_id === project.id
        ),
      }));

      res.json(finalProjects);
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
  const { userId } = req.body;

  const sql = `
    INSERT INTO project_members (project_id, user_id)
    VALUES (?, ?)
  `;

  db.query(sql, [projectId, userId], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    // SOCKET IO
    const io = req.app.get("io");

    io.to(userId).emit("notification", {
      _id: Date.now(),
      message: "You were added to a new project",
      fullMessage: "Manager has added you to a project",
      isRead: false,
    });

    res.json({
      message: "Member added successfully",
    });
  });
};

/* =========================
   EXPORTS
========================= */

module.exports = {
  getMyProjects,
  getMyProjectTasks,
  getProjectMembers,
  addProjectMember,
};