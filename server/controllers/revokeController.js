const express = require("express");
const router = express.Router();

const { issuer, consent, audit } = require("../models/sharedInstances");

router.post("/", (req, res) => {
  const { agentDID } = req.body;

  const vc = Array.from(issuer.vcs.values()).find(
    (v) => v.subject === agentDID
  );

  if (!vc) {
    return res.status(404).json({ error: "Agent not found" }); // ✅ return early
  }

  issuer.revokeVC(vc.id);
  consent.revokeConsent(agentDID);
  audit.logRevocation(vc.id, vc);

  return res.status(200).json({ success: true }); // ✅ also has return
});

module.exports = router;
