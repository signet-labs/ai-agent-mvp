const crypto = require("crypto");

class AuditLogger {
  constructor() {
    this.log = [];
  }

  hashData(data) {
    return crypto
      .createHash("sha256")
      .update(JSON.stringify(data))
      .digest("hex");
  }

  logCredentialIssue(vcId, vcData) {
    const entry = {
      type: "VC_ISSUE",
      timestamp: Date.now(),
      vcId,
      hash: this.hashData(vcData),
    };
    this.log.push(entry);
    console.log("[Audit] Issued VC logged:", entry);
  }

  logRevocation(vcId, vcData) {
    const entry = {
      type: "VC_REVOKE",
      timestamp: Date.now(),
      vcId,
      hash: this.hashData(vcData),
    };
    this.log.push(entry);
    console.log("[Audit] Revoked VC logged:", entry);
  }

  exportAuditReport(timeframe) {
    return this.log.filter(
      (entry) =>
        entry.timestamp >= timeframe.start && entry.timestamp <= timeframe.end
    );
  }

  getFullLog() {
    return [...this.log];
  }
}

class ZKVerifier {
  verifyStarkProof(proof, statementHash) {
    return proof.endsWith(statementHash.slice(0, 4));
  }

  generateProof(statementHash) {
    return "proof-" + statementHash.slice(0, 8);
  }
}

module.exports = { AuditLogger, ZKVerifier };
