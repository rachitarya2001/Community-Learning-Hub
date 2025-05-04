const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");

const {
  fetchRedditFeeds,
  fetchTwitterFeeds,
  fetchMockLinkedInFeeds,
  getFeeds,
  saveFeed,
  reportFeed,
  shareFeed,
} = require("../controllers/feed.controller");

router.get("/fetch-reddit", fetchRedditFeeds);
router.get("/", verifyToken, getFeeds);
router.post("/save", verifyToken, saveFeed);
router.post("/report", verifyToken, reportFeed);
router.get("/fetch-twitter", fetchTwitterFeeds);
router.get("/fetch-linkedin", fetchMockLinkedInFeeds);
router.post("/share", verifyToken, shareFeed);

module.exports = router;
