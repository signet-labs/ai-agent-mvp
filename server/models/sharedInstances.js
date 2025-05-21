// server/services/sharedInstances.js
const { UserIdentityManager } = require("../services/identityDelegation");
const { DelegationVCIssuer } = require("../services/identityDelegation");
const {
  ConsentManager,
  PolicyEvaluator,
} = require("../services/consentPolicy");
const { AuditLogger } = require("../services/complianceLogger");
const { DPoPTokenServer } = require("../services/tokenAuth");

// Create single shared instances
const identity = new UserIdentityManager();
const issuer = new DelegationVCIssuer();
const consent = new ConsentManager();
const policy = new PolicyEvaluator(consent);
const audit = new AuditLogger();
const tokenServer = new DPoPTokenServer();

module.exports = { identity, issuer, consent, policy, audit, tokenServer };
