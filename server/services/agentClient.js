const axios = require("axios");
const crypto = require("crypto");

class AgentClient {
  constructor(vc, keypair) {
    this.vc = vc;
    this.keypair = keypair;
    this.token = null;
  }

  async exchangeVCForJWT(tokenServerUrl) {
    const dpopProof = this.generateDPoPProof();

    try {
      const res = await axios.post(`${tokenServerUrl}/token`, {
        vc: this.vc,
        agentPublicKey: this.keypair.publicKey,
        dpopProof,
      });

      this.token = res.data.token;
      console.log("[Agent] Received token:", this.token);
      return true;
    } catch (err) {
      if (err instanceof Error) {
        console.error("[Agent] Token exchange failed:", err.message);
      } else {
        console.error("[Agent] Token exchange failed:", err);
      }
      return false;
    }
  }

  async callFintechApi(apiUrl, payload) {
    if (!this.token) {
      console.warn("[Agent] Missing token. Try exchanging VC first.");
      return null;
    }

    try {
      const res = await axios.post(apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          DPoP: this.generateDPoPProof(),
        },
      });
      console.log("[Agent] API response:", res.data);
      return res.data;
    } catch (err) {
      if (err.response?.status === 403) {
        console.warn("[Agent] Token possibly expired or revoked.");
      }
      console.error("[Agent] API call failed:", err.message);
      return null;
    }
  }

  generateDPoPProof() {
    return `${this.keypair.publicKey}-proof`;
  }

  getToken() {
    return this.token;
  }
}

module.exports = AgentClient;
