const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const { consent, policy } = require("../models/sharedInstances");

const JWT_SECRET = "super-secret-key";

router.post("/", (req, res) => {
  const auth = req.headers.authorization;
  const token = auth?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const agentDID = payload.sub;
    const amount = req.body.amount;

    if (!policy.isTokenValid(agentDID)) {
      return res.status(403).json({ error: "Revoked or expired token" });
    }

    const allowed = policy.isActionAllowed(agentDID, "pay", amount);
    if (!allowed) {
      return res
        .status(403)
        .json({ error: "Action not allowed (limit or scope)" });
    }

    res.json({ status: "Payment approved" });
  } catch {
    res.status(403).json({ error: "Invalid or expired token" });
  }
});

module.exports = router;
