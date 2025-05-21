const express = require("express");

const { audit } = require("../models/sharedInstances");

const router = express.Router();

router.get("/", (req, res) => {
  const logs = audit.getFullLog(); // or filter by timeframe
  res.json({ logs });
});

module.exports = { auditRouter: router };
