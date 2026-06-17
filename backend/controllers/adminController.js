const db = require("../config/db");

const getAdminDashboard = (req, res) => {
  const dashboard = {};

  db.query(
    `
    SELECT COUNT(*) AS totalProjects
    FROM projects
    `,
    (err, projectsResult) => {
      if (err) return res.status(500).json(err);

      dashboard.totalProjects =
        projectsResult[0].totalProjects;

      db.query(
        `
        SELECT COUNT(*) AS activeTasks
        FROM tasks
        WHERE status != 'done'
        `,
        (err, tasksResult) => {
          if (err) return res.status(500).json(err);

          dashboard.activeTasks =
            tasksResult[0].activeTasks;

          db.query(
            `
            SELECT COUNT(*) AS teamMembers
            FROM users
            WHERE role='team_member'
            `,
            (err, membersResult) => {
              if (err)
                return res.status(500).json(err);

              dashboard.teamMembers =
                membersResult[0].teamMembers;

              db.query(
                `
                SELECT COUNT(*) AS projectManagers
                FROM users
                WHERE role='project_manager'
                `,
                (err, managersResult) => {
                  if (err)
                    return res.status(500).json(err);

                  dashboard.projectManagers =
                    managersResult[0].projectManagers;

                  db.query(
                    `
                    SELECT
                      p.id,
                      p.title,
                      p.status,

                      CASE
                        WHEN COUNT(t.id)=0 THEN 0
                        ELSE ROUND(
                          (
                            SUM(
                              CASE
                                WHEN t.status='done'
                                THEN 1
                                ELSE 0
                              END
                            ) * 100
                          ) / COUNT(t.id)
                        )
                      END AS progress

                    FROM projects p

                    LEFT JOIN tasks t
                    ON p.id = t.project_id

                    GROUP BY p.id

                    ORDER BY p.created_at DESC
                    `,
                    (err, projects) => {
                      if (err)
                        return res.status(500).json(err);

                      dashboard.activeProjects =
                        projects;

                      db.query(
                        `
                        SELECT
                          activity_logs.*,
                          users.full_name,
                          users.avatar
                        FROM activity_logs
                        JOIN users
                        ON users.id =
                        activity_logs.user_id
                        ORDER BY activity_logs.created_at DESC
                        LIMIT 10
                        `,
                        (err, activities) => {
                          if (err)
                            return res.status(500).json(err);

                          dashboard.activities =
                            activities;

                          db.query(
                            `
                            SELECT
                              COUNT(*) total
                            FROM tasks
                            `,
                            (err, totalTasks) => {
                              if (err)
                                return res.status(500).json(err);

                              db.query(
                                `
                                SELECT
                                  COUNT(*) done
                                FROM tasks
                                WHERE status='done'
                                `,
                                (err, doneTasks) => {
                                  if (err)
                                    return res.status(500).json(err);

                                 dashboard.completionRate =
                             totalTasks[0].total > 0
                             ? Math.min(
                              100,
                       Math.round(
                     (doneTasks[0].done /
                      totalTasks[0].total) *
                        100
                     )
                 )
            : 0;
           
                                  db.query(
  `
  SELECT COUNT(*) AS onlineUsers
  FROM users
  WHERE last_seen >= NOW() - INTERVAL 5 MINUTE
  `,
  (err, onlineResult) => {
    if (err)
      return res.status(500).json(err);

    dashboard.onlineUsers =
      onlineResult[0].onlineUsers;

    res.json(dashboard);
  }
);
db.query(
  `
  SELECT COUNT(*) AS completedProjects
  FROM projects
  WHERE status='completed'
  `,
  (err, completedProjects) => {

    dashboard.completedProjects =
      completedProjects[0].completedProjects;

  }
);
db.query(
  `
  SELECT COUNT(*) AS completedTasks
  FROM tasks
  WHERE status='done'
  `,
  (err, completedTasks) => {

    dashboard.completedTasks =
      completedTasks[0].completedTasks;

  }
);
db.query(
  `
  SELECT
    id,
    full_name,
    email,
    role,
    avatar,
    created_at
  FROM users
  ORDER BY created_at DESC
  LIMIT 5
  `,
  (err, users) => {

    dashboard.latestUsers =
      users;

  }
);
                                }
                              );
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
};

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
  getAdminDashboard,
};