const User = require("../models/User");
const Transaction = require("../models/Transaction");

exports.earnPoints = async (req, res) => {
  const { points, purpose } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.credits += points;
    await user.save();

    const transaction = new Transaction({
      userId: req.user.id,
      type: "earn",
      points,
      purpose,
    });
    await transaction.save();

    res.json({ message: "Points earned!", credits: user.credits });
  } catch (err) {
    console.error("Earn Points Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.spendPoints = async (req, res) => {
  const { points, purpose } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.credits < points) {
      return res.status(400).json({ message: "Not enough credits" });
    }

    user.credits -= points;
    await user.save();

    const transaction = new Transaction({
      userId: req.user.id,
      type: "spend",
      points,
      purpose,
    });
    await transaction.save();

    res.json({ message: "Points spent!", credits: user.credits });
  } catch (err) {
    console.error("Spend Points Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    const totalPoints = transactions.reduce((sum, tx) => {
      return tx.type === "earn" ? sum + tx.points : sum - tx.points;
    }, 0);

    res.json({
      userId: req.user.id,
      totalPoints,
      transactions,
    });
  } catch (err) {
    console.error("Get Transactions Error:", err);
    res.status(500).json({ message: "Error fetching transactions" });
  }
};

exports.getTransactionHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(transactions);
  } catch (err) {
    console.error("Get Transaction History Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
