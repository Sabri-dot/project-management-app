const db = require("../config/db");

/* =========================
   GET ALL PROJECT MEMBERS
========================= */

const getAllProjectMembers = (req, res) => {
  db.query(
    `
    SELECT
      pm.id,
      pm.project_id,
      p.title AS project_name,
      pm.user_id,
      u.full_name,
      u.email
    FROM project_members pm
    JOIN projects p
      ON pm.project_id = p.id
    JOIN users u
      ON pm.user_id = u.id
    ORDER BY pm.id DESC
    `,
    (err, result) => {
      if (err)
        return res.status(500).json(err);

      res.json(result);
    }
  );
};

/* =========================
   GET MEMBER BY ID
========================= */

const getProjectMemberById = (req, res) => {
  const memberId = req.params.id;

  db.query(
    `
    SELECT
      pm.id,
      pm.project_id,
      p.title AS project_name,
      pm.user_id,
      u.full_name,
      u.email
    FROM project_members pm
    JOIN projects p
      ON pm.project_id = p.id
    JOIN users u
      ON pm.user_id = u.id
    WHERE pm.id = ?
    `,
    [memberId],
    (err, result) => {
      if (err)
        return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(404).json({
          message: "Member not found",
        });
      }

      res.json(result[0]);
    }
  );
};

/* =========================
   ADD MEMBER
========================= */

const createProjectMember = (req, res) => {
  const {
    project_id,
    user_id,
  } = req.body;

  db.query(
    `
    INSERT INTO project_members
    (
      project_id,
      user_id
    )
    VALUES (?, ?)
    `,
    [
      project_id,
      user_id,
    ],
    (err, result) => {
      if (err)
        return res.status(500).json(err);

      res.json({
        message:
          "Member added successfully",
      });
    }
  );
};

/* =========================
   DELETE MEMBER
========================= */

const deleteProjectMember = (req, res) => {
  const memberId = req.params.id;

  db.query(
    `
    DELETE FROM project_members
    WHERE id = ?
    `,
    [memberId],
    (err) => {
      if (err)
        return res.status(500).json(err);

      res.json({
        message:
          "Member removed successfully",
      });
    }
  );
};

module.exports = {
  getAllProjectMembers,
  getProjectMemberById,
  createProjectMember,
  deleteProjectMember,
};