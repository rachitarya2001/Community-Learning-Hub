const User = require("../models/User");

exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Access denied: Admins only" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
