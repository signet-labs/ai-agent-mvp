const express = require("express");
const router = express.Router();

const { tokenServer } = require("../models/sharedInstances");

router.post("/", (req, res) => {
  const { vc, agentPublicKey, dpopProof } = req.body;

  if (!tokenServer.validateDelegationVC(vc)) {
    return res.status(403).json({ error: "Invalid VC" });
  }

  if (!tokenServer.verifyDpopProof(dpopProof, agentPublicKey)) {
    return res.status(403).json({ error: "Invalid DPoP proof" });
  }

  const token = tokenServer.issueJwt(vc, agentPublicKey);
  res.json({ token });
});

module.exports = router;
