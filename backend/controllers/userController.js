const db = require("../config/db");
const bcrypt =require("bcryptjs");

const getProfile = (req, res) => {
  const userId = req.user.id;

  const sql = `
  SELECT
    id,
    full_name,
    email,
    role,
    avatar,
    phone,
    location,
    bio,
    last_seen
  FROM users
  WHERE id = ?
`;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Server Error",
      });
    }

    res.json(result[0]);
  });
};

const updateProfile = (req, res) => {
  const userId = req.user.id;

  const {
    full_name,
    email,
    phone,
    location,
    bio,
    avatar,
  } = req.body;

  const sql = `
    UPDATE users
    SET
      full_name = ?,
      email = ?,
      phone = ?,
      location = ?,
      bio = ?,
      avatar = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      full_name,
      email,
      phone,
      location,
      bio,
      avatar,
      userId,
    ],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: "Server Error",
        });
      }

      res.json({
        message:
          "Profile updated successfully",
      });
    }
  );
};
const uploadAvatar = (
  req,
  res
) => {

  const userId =
    req.user.id;

  if (!req.file) {

    return res.status(400).json({
      message: "No file uploaded",
    });

  }

  const avatarUrl =
    `http://localhost:5000/uploads/${req.file.filename}`;

  const sql = `
    UPDATE users
    SET avatar = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [avatarUrl, userId],
    (err) => {

      if (err) {

        return res.status(500).json(err);

      }

      res.json({
        avatar: avatarUrl,
      });

    }
  );

};
const changePassword = async (
  req,
  res
) => {

  try {

    const userId =
      req.user.id;

    const {
      currentPassword,
      newPassword,
    } = req.body;

    const sql =
      "SELECT password FROM users WHERE id = ?";

    db.query(
      sql,
      [userId],
      async (err, result) => {

        if (err) {
          return res.status(500).json({
            message:
              "Server Error",
          });
        }

        const user =
          result[0];

        const isMatch =
          await bcrypt.compare(
            currentPassword,
            user.password
          );

        if (!isMatch) {

          return res.status(400).json({
            message:
              "Current password is incorrect",
          });

        }

        const hashedPassword =
          await bcrypt.hash(
            newPassword,
            10
          );

        db.query(
          `
          UPDATE users
          SET password = ?
          WHERE id = ?
          `,
          [
            hashedPassword,
            userId,
          ],
          (err) => {

            if (err) {

              return res.status(500).json({
                message:
                  "Server Error",
              });

            }

            res.json({
              message:
                "Password changed successfully",
            });

          }
        );

      }
    );

  } catch (error) {

    res.status(500).json({
      message:
        "Server Error",
    });

  }

};

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar,
  changePassword,
};