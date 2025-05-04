const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/admin.middleware");
const {
  getAllUsers,
  getReportedFeeds,
  deleteFeed,
  getSavedFeeds,
} = require("../controllers/admin.controller");

router.get("/users", verifyToken, isAdmin, getAllUsers);
router.get("/reported-feeds", verifyToken, isAdmin, getReportedFeeds);
router.delete("/feed/:id", verifyToken, isAdmin, deleteFeed);
router.get("/saved-feeds", verifyToken, isAdmin, getSavedFeeds);

module.exports = router;
