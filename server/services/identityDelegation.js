const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

function generateDID() {
  const key = crypto.randomBytes(32).toString("hex");
  return `did:key:${key}`;
}

class UserIdentityManager {
  constructor() {
    this.users = new Map();
  }

  enrollUserBiometrics(userId) {
    const userDID = generateDID();
    this.users.set(userId, userDID);
    return userDID;
  }

  getUserDID(userId) {
    return this.users.get(userId);
  }
}

class DelegationVCIssuer {
  constructor() {
    this.vcs = new Map();
    this.revoked = new Set();
  }

  generateAgentDID() {
    return generateDID();
  }

  createDelegationVC(userDID, agentDID, scope, expirySeconds = 3600) {
    const id = uuidv4();
    const revId = uuidv4();
    const expiry = Date.now() + expirySeconds * 1000;

    const payload = {
      id,
      issuer: userDID,
      subject: agentDID,
      parent: userDID,
      scope,
      expiry,
      revId,
    };

    const signature = this.signPayload(JSON.stringify(payload));

    const vc = {
      ...payload,
      signature,
    };

    this.vcs.set(id, vc);
    return vc;
  }

  revokeVC(vcId) {
    if (this.vcs.has(vcId)) {
      this.revoked.add(vcId);
      return true;
    }
    return false;
  }

  isRevoked(vcId) {
    return this.revoked.has(vcId);
  }

  getVC(vcId) {
    return this.vcs.get(vcId);
  }

  signPayload(data) {
    return crypto.createHash("sha256").update(data).digest("hex");
  }
}

module.exports = {
  UserIdentityManager,
  DelegationVCIssuer,
};
