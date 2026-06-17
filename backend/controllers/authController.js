const jwt = require("jsonwebtoken");
const db = require("../config/db");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  try {
    const {
      full_name,
      email,
      password
    } = req.body;

    const checkUser =
      "SELECT * FROM users WHERE email = ?";

    db.query(
      checkUser,
      [email],
      async (err, result) => {
        if (result.length > 0) {
          return res.status(400).json({
            message: "Email already exists",
          });
        }

        const hashedPassword =
          await bcrypt.hash(password, 10);

        const sql = `
          INSERT INTO users
          (full_name,email,password)
          VALUES (?,?,?)
        `;

        db.query(
          sql,
          [
            full_name,
            email,
            hashedPassword,
          ],
          (err) => {
            if (err) {
              return res.status(500).json(err);
            }

            res.status(201).json({
              message:
                "User registered successfully",
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
};
const login = (req, res) => {
  const { email, password } = req.body;

  const sql =
    "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = result[0];

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  });
};
const getProfile = (req, res) => {
  const sql =
    "SELECT id, full_name, email, role, avatar FROM users WHERE id = ?";

  db.query(
    sql,
    [req.user.id],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json(result[0]);
    }
  );
};
module.exports = {
  register,
  login,
  getProfile,
};