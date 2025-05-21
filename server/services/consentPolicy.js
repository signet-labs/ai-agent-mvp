class ConsentManager {
  constructor() {
    this.agentPolicies = new Map();
  }

  addConsent(vc) {
    const { subject: agentDID, scope, expiry } = vc;
    const dailyLimit = scope?.limit || 0;

    const policy = {
      agentDID,
      scope,
      dailyLimit,
      spentToday: 0,
      revoked: false,
      expiry,
    };

    this.agentPolicies.set(agentDID, policy);
  }

  revokeConsent(agentDID) {
    const policy = this.agentPolicies.get(agentDID);
    if (policy) {
      policy.revoked = true;
      return true;
    }
    return false;
  }

  listActiveAgents() {
    const now = Date.now();
    return Array.from(this.agentPolicies.values()).filter(
      (p) => !p.revoked && p.expiry > now
    );
  }

  getPolicy(agentDID) {
    return this.agentPolicies.get(agentDID);
  }
}

class PolicyEvaluator {
  constructor(consentManager) {
    this.consentManager = consentManager;
  }

  isTokenValid(agentDID) {
    const policy = this.consentManager.getPolicy(agentDID);
    if (!policy) return false;
    if (policy.revoked) return false;
    if (policy.expiry < Date.now()) return false;
    return true;
  }

  isActionAllowed(agentDID, action, amount) {
    const policy = this.consentManager.getPolicy(agentDID);
    if (!policy || policy.revoked) return false;

    const scope = policy.scope;
    const allowedActions = scope.action || [];
    const isActionOK = Array.isArray(allowedActions)
      ? allowedActions.includes(action)
      : allowedActions === action;

    if (!isActionOK) return false;

    const newTotal = policy.spentToday + amount;
    if (newTotal > policy.dailyLimit) return false;

    policy.spentToday = newTotal;
    return true;
  }

  resetDailySpending() {
    for (const policy of this.consentManager.listActiveAgents()) {
      policy.spentToday = 0;
    }
  }
}

module.exports = { ConsentManager, PolicyEvaluator };
