let lastRedditFetchTime = 0;
let lastTwitterFetchTime = 0; // global cooldown tracker

const Feed = require("../models/Feed");
const axios = require("axios");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

exports.fetchRedditFeeds = async (req, res) => {
  try {
    const sorts = [
      "new.json?limit=10",
      "top.json?t=day&limit=10",
      "hot.json?limit=10",
    ];
    const randomSort = sorts[Math.floor(Math.random() * sorts.length)];
    const url = `https://www.reddit.com/r/learnprogramming/${randomSort}`;

    const response = await axios.get(url);
    const posts = response.data.data.children;

    let added = 0;
    let skipped = 0;

    for (const p of posts) {
      const exists = await Feed.findOne({
        url: `https://reddit.com${p.data.permalink}`,
      });
      if (exists) {
        skipped++;
        continue;
      }

      await Feed.create({
        source: "reddit",
        title: p.data.title,
        url: `https://reddit.com${p.data.permalink}`,
        preview: p.data.selftext?.substring(0, 100) || "",
      });

      added++;
    }

    res.json({ added, skipped });
  } catch (err) {
    console.error("Reddit Fetch Error:", err.message || err);
    res.status(500).json({ message: "Error fetching Reddit posts" });
  }
};


exports.shareFeed = async (req, res) => {
  try {
    const { feedId } = req.body;
    const feed = await Feed.findById(feedId);
    if (!feed) return res.status(404).json({ message: "Feed not found" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "admin") {
      return res.status(403).json({ message: "Admins cannot share feeds." });
    }

    if (!feed.sharedBy.includes(req.user.id)) {
      feed.sharedBy.push(req.user.id);
      await feed.save();

      user.credits += 5;
      await user.save();

      await new Transaction({
        userId: req.user.id,
        type: "earn",
        points: 5,
        purpose: "Shared a feed",
      }).save();

      res.json({ message: "Feed shared!" });
    } else {
      res.status(400).json({ message: "You already shared this feed." });
    }
  } catch (err) {
    console.error("Share Feed Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.fetchTwitterFeeds = async (req, res) => {
  const now = Date.now();
  const FIFTEEN_MIN = 15 * 60 * 1000;

  if (now - lastTwitterFetchTime < FIFTEEN_MIN) {
    const nextFetchIn = Math.ceil(
      (FIFTEEN_MIN - (now - lastTwitterFetchTime)) / 60000
    );
    return res.status(429).json({
      message: `Twitter feed was recently fetched. Please wait ${nextFetchIn} more minute(s).`,
    });
  }

  try {
    const response = await axios.get(
      "https://api.twitter.com/2/tweets/search/recent",
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
        params: {
          query: "programming",
          max_results: 10,
          "tweet.fields": "text,author_id",
        },
      }
    );

    const tweets = (response.data.data || []).map((tweet) => ({
      source: "twitter",
      title: `Tweet by ${tweet.author_id}`,
      url: `https://twitter.com/i/web/status/${tweet.id}`,
      preview: tweet.text.substring(0, 100),
    }));

    const saved = await Feed.insertMany(tweets);
    lastTwitterFetchTime = now;

    res.json(saved);
  } catch (err) {
    console.error("Twitter Fetch Error:", err.response?.data || err.message);
    res.status(500).json({ message: "Error fetching Twitter posts" });
  }
};

exports.fetchMockLinkedInFeeds = async (req, res) => {
  const mockFeeds = [
    {
      source: "linkedin",
      title: "Top Remote Tech Jobs You Should Apply For",
      url: "https://linkedin.com/posts/sample1",
      preview: "Explore the most in-demand remote roles...",
    },
    {
      source: "linkedin",
      title: "How to Write a Standout LinkedIn Profile",
      url: "https://linkedin.com/posts/sample2",
      preview: "Tips from recruiters on making your profile shine...",
    },
  ];

  const saved = await Feed.insertMany(mockFeeds);
  res.json(saved);
};

exports.getFeeds = async (req, res) => {
  const feeds = await Feed.find().sort({ createdAt: -1 }).limit(20);
  res.json(feeds);
};

exports.saveFeed = async (req, res) => {
  try {
    const { feedId } = req.body;
    const feed = await Feed.findById(feedId);
    if (!feed) return res.status(404).json({ message: "Feed not found" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "admin") {
      return res
        .status(403)
        .json({ message: "Admins are not allowed to save feeds." });
    }

    if (!feed.savedBy.includes(req.user.id)) {
      feed.savedBy.push(req.user.id);
      await feed.save();

      user.credits += 5;
      await user.save();

      await new Transaction({
        userId: req.user.id,
        type: "earn",
        points: 5,
        purpose: "Saved a feed",
      }).save();

      res.json({ message: "Saved for later" });
    } else {
      res.status(400).json({ message: "You already saved this feed." });
    }
  } catch (err) {
    console.error("Save Feed Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.reportFeed = async (req, res) => {
  try {
    const { feedId, reason } = req.body;
    const feed = await Feed.findById(feedId);
    if (!feed) return res.status(404).json({ message: "Feed not found" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "admin") {
      return res.status(403).json({ message: "Admins cannot report feeds." });
    }

    const alreadyReported = feed.reports.some(
      (r) => r.userId.toString() === req.user.id
    );
    if (alreadyReported) {
      return res
        .status(400)
        .json({ message: "You already reported this feed." });
    }

    feed.reports.push({ userId: req.user.id, reason });
    await feed.save();

    user.credits += 5;
    await user.save();

    await new Transaction({
      userId: req.user.id,
      type: "earn",
      points: 5,
      purpose: "Reported a feed",
    }).save();

    res.json({ message: "Feed reported successfully" });
  } catch (err) {
    console.error("Report Feed Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
