const User = require("../models/User");
const Feed = require("../models/Feed");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to retrieve users" });
  }
};

exports.getReportedFeeds = async (req, res) => {
  try {
    const reported = await Feed.find({ "reports.0": { $exists: true } })
      .populate("reports.userId", "name email")
      .populate("savedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(reported);
  } catch (err) {
    console.error("Reported Feeds Fetch Error:", err);
    res.status(500).json({ message: "Failed to fetch reported feeds" });
  }
};

exports.getSavedFeeds = async (req, res) => {
  try {
    const savedFeeds = await Feed.find({
      "savedBy.0": { $exists: true },
    }).populate("savedBy", "name email");

    res.json(savedFeeds);
  } catch (err) {
    console.error("Error fetching saved feeds:", err);
    res.status(500).json({ message: "Failed to fetch saved feeds" });
  }
};

exports.deleteFeed = async (req, res) => {
  try {
    const deleted = await Feed.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Feed not found" });
    }
    res.json({ message: "Feed deleted successfully" });
  } catch (err) {
    console.error("Error deleting feed:", err);
    res.status(500).json({ message: "Failed to delete feed" });
  }
};
