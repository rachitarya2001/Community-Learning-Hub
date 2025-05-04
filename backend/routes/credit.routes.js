const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");
const {
  earnPoints,
  spendPoints,
  getTransactionHistory,
  getTransactions,
} = require("../controllers/credit.controller");

router.post("/earn", verifyToken, earnPoints);
router.post("/spend", verifyToken, spendPoints);
router.get("/history", verifyToken, getTransactionHistory);
router.get("/transactions", verifyToken, getTransactions);

module.exports = router;
