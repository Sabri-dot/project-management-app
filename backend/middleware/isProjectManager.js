const isProjectManager = (req, res, next) => {
  if (req.user.role !== "project_manager") {
    return res.status(403).json({ message: "Only Project Manager allowed" });
  }
  next();
};

module.exports = isProjectManager;