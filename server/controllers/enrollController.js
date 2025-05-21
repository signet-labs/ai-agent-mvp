// server/controllers/enrollController.js
const express = require("express");
const router = express.Router();

const { identity } = require("../models/sharedInstances");

router.post("/", (req, res) => {
  const { email } = req.body;
  const did = identity.enrollUserBiometrics(email);
  res.json({ did });
});

module.exports = router;
