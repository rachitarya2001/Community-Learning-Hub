const mongoose = require("mongoose");

const FeedSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      enum: ["twitter", "reddit", "linkedin"],
      required: true,
    },
    title: String,
    url: String,
    preview: String,
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    sharedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    reports: [{ userId: String, reason: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feed", FeedSchema);
