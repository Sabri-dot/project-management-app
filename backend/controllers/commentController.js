const db = require("../config/db");

const addComment = (req, res) => {

  const {
    task_id,
    comment
  } = req.body;

  const userId =
    req.user.id;

  db.query(
    `
    SELECT
      title,
      project_id
    FROM tasks
    WHERE id = ?
    `,
    [task_id],
    (err, taskResult) => {

      if (err) {
        return res.status(500).json(err);
      }

      const task =
        taskResult[0];

      db.query(
        `
        INSERT INTO comments
        (
          task_id,
          user_id,
          comment
        )
        VALUES (?, ?, ?)
        `,
        [
          task_id,
          userId,
          comment
        ],
        (err) => {

          if (err) {
            return res.status(500).json(err);
          }
db.query(
  `
  INSERT INTO activity_logs
  (
    user_id,
    action,
    project_id,
    task_id
  )
  VALUES (?, ?, ?, ?)
  `,
  [
    userId,
    `commented on "${task.title}"`,
    task.project_id,
    task_id
  ],
  () => {

    db.query(
      `
      SELECT user_id
      FROM project_members
      WHERE project_id = ?
      `,
      [task.project_id],
      (err, members) => {

        if (!err && members.length > 0) {

         const io = req.app.get("io");

members.forEach((member) => {

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
      member.user_id,
      `New comment on "${task.title}"`
    ]
  );

  //  REAL TIME SOCKET
  io.to(`user_${member.user_id}`).emit("notification", {
    message: `New comment on "${task.title}"`,
    type: "comment",
    createdAt: new Date(),
  });

});
io.to("admins").emit("notification", {
  message: `New comment on "${task.title}"`,
  type: "comment",
  createdAt: new Date(),
});

        }

      }
    );

  }
);

          res.status(201).json({
            message:
              "Comment added successfully",
          });

        }
      );

    }
  );

};

const getTaskComments = (req, res) => {
  const taskId = req.params.taskId;

  const sql = `
    SELECT
      comments.id,
      comments.user_id,
      comments.comment,
      comments.created_at,
      users.full_name
    FROM comments
    JOIN users
      ON comments.user_id = users.id
    WHERE comments.task_id = ?
    ORDER BY comments.created_at DESC
  `;

  db.query(sql, [taskId], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};

const updateComment = (req, res) => {
  const commentId = req.params.id;

  const userId = req.user.id;

  const { comment } = req.body;

  const sql = `
    UPDATE comments
    SET comment = ?
    WHERE id = ?
    AND user_id = ?
  `;

  db.query(
    sql,
    [comment, commentId, userId],
    (err) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Comment updated successfully",
      });
    }
  );
};

const deleteComment = (req, res) => {
  const commentId = req.params.id;

  const userId = req.user.id;

  const sql = `
    DELETE FROM comments
    WHERE id = ?
    AND user_id = ?
  `;

  db.query(
    sql,
    [commentId, userId],
    (err) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Comment deleted successfully",
      });
    }
  );
};

module.exports = {
  addComment,
  getTaskComments,
  updateComment,
  deleteComment,
};