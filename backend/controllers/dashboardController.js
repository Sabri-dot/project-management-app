const db = require("../config/db");

const getDashboard = (req, res) => {
  const userId = req.user.id;


  // PROJECT MANAGER DASHBOARD
  if (req.user.role === "project_manager") {

    const dashboardData = {};


    const userQuery = `
      SELECT full_name
      FROM users
      WHERE id = ?
    `;


    db.query(userQuery, [userId], (err, userResult) => {

      if (err) {
        return res.status(500).json(err);
      }


      dashboardData.user = userResult[0];

      const projectsQuery = `
  SELECT COUNT(DISTINCT p.id) AS totalProjects
  FROM projects p
  LEFT JOIN project_members pm
    ON p.id = pm.project_id
  WHERE p.created_by = ?
  OR pm.user_id = ?
`;


     db.query(projectsQuery, [userId, userId], (err, projectsResult) => {

        if (err) {
          return res.status(500).json(err);
        }


        dashboardData.totalProjects =
          projectsResult[0].totalProjects;



        const tasksQuery = `
  SELECT COUNT(*) AS totalTasks
  FROM tasks t
  JOIN projects p
    ON t.project_id = p.id
  LEFT JOIN project_members pm
    ON p.id = pm.project_id
  WHERE p.created_by = ?
  OR pm.user_id = ?
`;


       db.query(tasksQuery, [userId, userId], (err, tasksResult) => {
          if (err) {
            return res.status(500).json(err);
          }


          dashboardData.totalTasks =
            tasksResult[0].totalTasks;



          const completedQuery = `
  SELECT COUNT(*) AS completedTasks
  FROM tasks t
  JOIN projects p
    ON t.project_id = p.id
  LEFT JOIN project_members pm
    ON p.id = pm.project_id
  WHERE (p.created_by = ?
  OR pm.user_id = ?)
  AND t.status = 'done'
`;


         db.query(completedQuery, [userId, userId], (err, completedResult) => {

            if (err) {
              return res.status(500).json(err);
            }


            dashboardData.completedTasks =
              completedResult[0].completedTasks;


            dashboardData.activeProjects = [];


            res.json(dashboardData);

          });

        });

      });

    });


    return;

  }



  // TEAM MEMBER DASHBOARD
  const dashboardData = {};



  const userQuery = `
    SELECT full_name
    FROM users
    WHERE id = ?
  `;

  db.query(userQuery, [userId], (err, userResult) => {
    if (err) {
      return res.status(500).json(err);
    }

    dashboardData.user = userResult[0];

    const projectsQuery = `
      SELECT COUNT(*) AS totalProjects
      FROM project_members
      WHERE user_id = ?
    `;

    db.query(
      projectsQuery,
      [userId],
      (err, projectsResult) => {
        if (err) {
          return res.status(500).json(err);
        }

        dashboardData.totalProjects =
          projectsResult[0].totalProjects;

        const tasksQuery = `
          SELECT COUNT(*) AS totalTasks
          FROM tasks
          WHERE assigned_to = ?
        `;

        db.query(
          tasksQuery,
          [userId],
          (err, tasksResult) => {
            if (err) {
              return res.status(500).json(err);
            }

            dashboardData.totalTasks =
              tasksResult[0].totalTasks;

            const completedQuery = `
              SELECT COUNT(*) AS completedTasks
              FROM tasks
              WHERE assigned_to = ?
              AND status = 'done'
            `;

            db.query(
              completedQuery,
              [userId],
              (err, completedResult) => {
                if (err) {
                  return res.status(500).json(err);
                }

                dashboardData.completedTasks =
                  completedResult[0].completedTasks;

               const activeProjectsQuery = `
  SELECT
    p.id,
    p.title,
    p.status,

    CASE
      WHEN COUNT(t.id) = 0 THEN 0
      ELSE ROUND(
        (
          SUM(
            CASE
              WHEN t.status = 'done'
              THEN 1
              ELSE 0
            END
          ) * 100
        ) / COUNT(t.id)
      )
    END AS progress

  FROM projects p

  JOIN project_members pm
    ON p.id = pm.project_id

  LEFT JOIN tasks t
    ON p.id = t.project_id

  WHERE pm.user_id = ?
  AND p.status = 'active'

  GROUP BY
    p.id,
    p.title,
    p.status

  ORDER BY p.created_at DESC
`;

                db.query(
                  activeProjectsQuery,
                  [userId],
                  (err, activeProjects) => {
                    if (err) {
                      return res.status(500).json(err);
                    }

                    dashboardData.activeProjects =
                      activeProjects;

                    res.json(dashboardData);
                  }
                );
              }
            );
          }
        );
      }
    );
  });
};

module.exports = {
  getDashboard,
};