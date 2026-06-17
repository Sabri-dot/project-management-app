const db = require("../config/db");

const uploadAttachment = (
  req,
  res
) => {

  const taskId =
    req.body.task_id;

  const userId =
    req.user.id;

  if (!req.file) {

    return res.status(400).json({
      message:
        "No file uploaded",
    });

  }

  db.query(
    `
    SELECT
      title,
      project_id
    FROM tasks
    WHERE id = ?
    `,
    [taskId],
    (err, taskResult) => {

      if (err) {
        return res.status(500).json(err);
      }

      const task =
        taskResult[0];

      db.query(
        `
        INSERT INTO attachments
        (
          task_id,
          file_name,
          file_url,
          uploaded_by
        )
        VALUES (?, ?, ?, ?)
        `,
        [
          taskId,
          req.file.filename,
          req.file.path,
          userId
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
              `uploaded attachment to "${task.title}"`,
              task.project_id,
              taskId
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

                  if (err) {
                    console.log(err);
                    return;
                  }

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
      `New attachment added to "${task.title}"`
    ]
  );

  // 🔥 REAL TIME
  io.to(`user_${member.user_id}`).emit("notification", {
    message: `New attachment added to "${task.title}"`,
    type: "attachment",
    createdAt: new Date(),
  });

});

                }
              );

            }
          );

          res.status(201).json({
            message:
              "Attachment uploaded successfully",
          });

        }
      );

    }
  );

};
const getTaskAttachments = (
  req,
  res
) => {

  const taskId =
    req.params.taskId;

  const sql = `
    SELECT
      attachments.id,
      attachments.file_name,
      attachments.file_url,
      attachments.created_at,
      attachments.uploaded_by,
      users.full_name
    FROM attachments
    LEFT JOIN users
      ON attachments.uploaded_by = users.id
    WHERE attachments.task_id = ?
    ORDER BY attachments.created_at DESC
  `;

  db.query(
    sql,
    [taskId],
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

const deleteAttachment = (
  req,
  res
) => {

  const attachmentId =
    req.params.id;

  const userId =
    req.user.id;

  const sql = `
    DELETE FROM attachments
    WHERE id = ?
    AND uploaded_by = ?
  `;

  db.query(
    sql,
    [attachmentId, userId],
    (err) => {

      if (err) {
        return res
          .status(500)
          .json(err);
      }

      res.json({
        message:
          "Attachment deleted successfully",
      });

    }
  );

};

module.exports = {
  uploadAttachment,
  getTaskAttachments,
  deleteAttachment,
};