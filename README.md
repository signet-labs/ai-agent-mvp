classDiagram
class UserIdentityManager {
+enroll_user_biometrics()
+generate_user_did()
+get_user_profile(did)
}

    class DelegationVCIssuer {
        +generate_agent_did()
        +create_delegation_vc(user_did, agent_did, scopes, expiry)
        +revoke_vc(vc_id)
    }

    class DPoPTokenServer {
        +validate_delegation_vc(vc)
        +verify_dpop_proof(dpop_header, pubkey)
        +issue_jwt(vc, agent_pubkey)
        +is_token_revoked(token_id)
    }

    class OAuthFacade {
        +authorize(client_id, redirect_uri)
        +token_exchange(code, dpop_proof)
        +ciba_authenticate(login_hint)
    }

    class ConsentManager {
        +list_active_agents(user_did)
        +revoke_consent(agent_did)
        +get_spending_limits(agent_did)
    }

    class PolicyEvaluator {
        +is_within_scope(jwt, action, amount)
        +is_token_expired(jwt)
        +enforce_limits(agent_did, amount)
    }

    class AuditLogger {
        +log_credential_issue(vc_hash)
        +log_revocation(vc_id)
        +export_audit_report(user_did, timeframe)
    }

    class ZKVerifier {
        +verify_stark_proof(proof, statement_hash)
        +generate_proof(vc_hash)
    }

    class AgentClient {
        +load_credentials()
        +exchange_vc_for_jwt()
        +call_fintech_api(token, endpoint, payload)
    }

    class SignetSDK {
        +loginWithBiometrics()
        +delegateToAgent(scopes)
        +revokeAgent(agent_id)
        +getActiveDelegations()
    }

    UserIdentityManager --> DelegationVCIssuer
    DelegationVCIssuer --> DPoPTokenServer
    DPoPTokenServer --> OAuthFacade
    OAuthFacade --> PolicyEvaluator
    PolicyEvaluator --> ConsentManager
    ConsentManager --> AuditLogger
    AuditLogger --> ZKVerifier
    AgentClient --> DPoPTokenServer
    AgentClient --> OAuthFacade
    SignetSDK --> UserIdentityManager
    SignetSDK --> DelegationVCIssuer
    SignetSDK --> ConsentManager
