const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const JWT_SECRET = "super-secret-key";

class DPoPTokenServer {
  constructor() {
    this.revokedVCs = new Set();
  }

  validateDelegationVC(vc) {
    if (!vc || typeof vc !== "object") return false;
    if (!vc.id || !vc.expiry || !vc.signature) return false;

    const now = Date.now();
    if (this.revokedVCs.has(vc.id)) return false;
    if (vc.expiry < now) return false;

    const payload = { ...vc };
    delete payload.signature;

    const expectedSig = crypto
      .createHash("sha256")
      .update(JSON.stringify(payload))
      .digest("hex");

    return expectedSig === vc.signature;
  }

  verifyDpopProof(proof, pubkey) {
    return proof.includes(pubkey.slice(0, 8));
  }

  issueJwt(vc, agentPublicKey) {
    const payload = {
      sub: vc.subject,
      scope: vc.scope,
      exp: Math.floor(Date.now() / 1000) + 300,
      cnf: {
        jwk: agentPublicKey,
      },
    };

    return jwt.sign(payload, JWT_SECRET);
  }

  revokeVC(vcId) {
    this.revokedVCs.add(vcId);
  }

  decodeJwt(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch {
      return null;
    }
  }
}

class OAuthFacade {
  constructor() {
    this.authCodes = new Map();
  }

  authorize(clientId, redirectUri) {
    const code = crypto.randomUUID();
    this.authCodes.set(code, "mock-agent-pubkey");
    return code;
  }

  tokenExchange(code, dpopProof) {
    const pubKey = this.authCodes.get(code);
    if (!pubKey || !dpopProof.includes(pubKey.slice(0, 6))) return null;

    return jwt.sign(
      {
        sub: "mock-agent",
        scope: { action: "read" },
        exp: Math.floor(Date.now() / 1000) + 300,
        cnf: { jwk: pubKey },
      },
      JWT_SECRET
    );
  }

  cibaAuthenticate(loginHint) {
    return "ciba-session-id";
  }
}

module.exports = {
  DPoPTokenServer,
  OAuthFacade,
};
