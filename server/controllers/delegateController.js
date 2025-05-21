const express = require("express");
const router = express.Router();

const {
  identity,
  issuer,
  consent,
  audit,
} = require("../models/sharedInstances");

router.post("/", (req, res) => {
  const { userEmail, scope } = req.body;

  const userDID = identity.getUserDID(userEmail);
  if (!userDID) {
    return res.status(404).json({ error: "User not found" });
  }

  const agentDID = issuer.generateAgentDID();
  const vc = issuer.createDelegationVC(userDID, agentDID, scope);

  consent.addConsent(vc);
  audit.logCredentialIssue(vc.id, vc);

  res.json({ vc });
});

module.exports = router;
