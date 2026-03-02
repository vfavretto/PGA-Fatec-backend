# Security Best Practices Report

## Executive Summary
The backend has multiple authorization and account-security issues that allow privilege escalation and sensitive-data exposure. The highest risk is a public user-creation flow that accepts privileged roles (`Administrador`, `CPS`, etc.), enabling full unauthorized administrative access. Additional high-risk issues include unrestricted user updates and audit logging of full response payloads (including user records).

Scope reviewed: `PGA-Backend/src/` (NestJS + Prisma).

## Critical Findings

### SEC-001 - Public registration allows arbitrary privileged role assignment
- Rule ID: `EXPRESS-AUTHZ-PRIV-001` (authorization boundary / privilege escalation)
- Severity: Critical
- Location: `PGA-Backend/src/modules/user/user.controller.ts:68-79`, `PGA-Backend/src/modules/auth/dto/register.dto.ts:44-54`
- Evidence:
  - `@Public()` on `POST /users` allows unauthenticated account creation.
  - `RegisterDto` accepts unrestricted `tipo_usuario` enum, including privileged roles.
- Impact: An unauthenticated attacker can self-register as `Administrador` and gain full control of protected APIs.
- Fix:
  - Remove `@Public()` from `POST /users`, or split into two endpoints:
    - Public endpoint creates only least-privilege pending/request-access users.
    - Privileged endpoint (admin-only) can set `tipo_usuario`.
  - Enforce server-side allowlist: public creation must ignore/reject privileged `tipo_usuario`.
- Mitigation:
  - Temporarily hardcode `tipo_usuario` to a low-privilege value for public flows until role-governed onboarding is enforced.
- False positive notes:
  - This is only non-exploitable if the endpoint is fully blocked externally by infrastructure routing (not visible in app code).

## High Findings

### SEC-002 - Unrestricted user update enables IDOR/mass assignment of sensitive fields
- Rule ID: `EXPRESS-INPUT-001` (unsafe untrusted-to-sensitive sink flow)
- Severity: High
- Location: `PGA-Backend/src/modules/user/user.controller.ts:126-139`, `PGA-Backend/src/modules/user/services/update-user.service.ts:9-10`, `PGA-Backend/src/modules/user/user.repository.ts:68-75`
- Evidence:
  - Any authenticated user can call `PUT /users/:id`.
  - Request body is typed as `Prisma.PessoaUpdateInput` and passed directly to repository update.
  - No ownership/role checks before updating target user.
- Impact: Any authenticated user can update another user and potentially change privileged/sensitive fields (`tipo_usuario`, `ativo`, `senha`, etc.).
- Fix:
  - Replace `Prisma.PessoaUpdateInput` with strict DTO allowlisting only safe fields.
  - Enforce authorization checks (self-update only for profile fields; admin-only for role/status fields).
  - Hash password in update flow if password updates are permitted.
- Mitigation:
  - Block endpoint for non-admin roles until field-level authorization is implemented.
- False positive notes:
  - If API gateway enforces strong per-route RBAC externally, risk may be reduced; no such control is visible here.

### SEC-003 - Audit interceptor stores full response payloads, risking sensitive data retention
- Rule ID: `EXPRESS-ERROR-001` / secure logging principle
- Severity: High
- Location: `PGA-Backend/src/modules/audit/audit.interceptor.ts:65-75`, `PGA-Backend/src/modules/audit/audit.interceptor.ts:111-113`, `PGA-Backend/src/modules/user/services/create-user.service.ts:11-15`, `PGA-Backend/src/modules/user/user.repository.ts:12-14`
- Evidence:
  - `dados_depois` receives full controller response object.
  - URL mapping includes `/users` -> `pessoa`.
  - User creation returns Prisma `Pessoa` object from repository create.
- Impact: Audit table can persist user-sensitive data (including password hashes and personal data), increasing breach impact and insider exposure.
- Fix:
  - Implement explicit redaction/allowlisting before writing audit payloads.
  - For `pessoa`, store only non-sensitive fields (e.g., `pessoa_id`, `tipo_usuario`, timestamps), never `senha`.
  - Consider recording only changed field metadata instead of full objects.
- Mitigation:
  - Add DB-level access restrictions for audit table and short retention until app-level redaction is deployed.
- False positive notes:
  - If serializer/interceptor strips sensitive fields before response serialization, confirm that behavior; not visible in current code.

## Medium Findings

### SEC-004 - Password-reset flow leaks account existence (user enumeration)
- Rule ID: `EXPRESS-AUTH-001` (auth endpoint hardening)
- Severity: Medium
- Location: `PGA-Backend/src/modules/user/services/forgot-password.service.ts:14-19`, `PGA-Backend/src/modules/user/user.controller.ts:154-169`
- Evidence:
  - Service throws explicit error when user is not found.
  - Endpoint directly returns service result, making response behavior differ for existing vs non-existing users.
- Impact: Attackers can enumerate valid user emails, enabling targeted brute-force/phishing.
- Fix:
  - Always return a generic success response (`If the email exists, reset instructions were sent`).
  - Keep detailed reason only in server logs.
- Mitigation:
  - Add request throttling and monitoring for repeated reset attempts.
- False positive notes:
  - If a global exception filter normalizes all responses to identical timing/body, verify; not visible in reviewed files.

### SEC-005 - Missing brute-force/rate-limit controls on authentication endpoints
- Rule ID: `EXPRESS-AUTH-001`
- Severity: Medium
- Location: `PGA-Backend/src/modules/auth/auth.controller.ts:21-24`, `PGA-Backend/src/modules/user/user.controller.ts:154-172`; absence of throttling config in `PGA-Backend/src/main.ts`
- Evidence:
  - Public login and password-reset endpoints exist.
  - No throttler/rate-limiter usage found in source.
- Impact: Increased risk of credential stuffing and abusive password-reset attempts.
- Fix:
  - Add Nest rate limiting (global + stricter per-route for login/reset).
  - Consider account/IP-based progressive lockout on failed auth attempts.
- Mitigation:
  - Enforce temporary rate limits at reverse proxy/API gateway until app-level controls are added.
- False positive notes:
  - Edge-layer throttling may exist outside this repository; verify deployment config.

## Low Findings

### SEC-006 - Missing explicit security headers middleware in bootstrap
- Rule ID: `EXPRESS-HEADERS-001` / `EXPRESS-FINGERPRINT-001`
- Severity: Low
- Location: `PGA-Backend/src/main.ts:8-69`
- Evidence:
  - No `helmet()` usage found in bootstrap despite dependency being present.
  - No explicit `x-powered-by` hardening in app bootstrap.
- Impact: Reduced browser-side hardening and weaker defense-in-depth posture.
- Fix:
  - Add `app.use(helmet())` with suitable CSP/headers for deployment.
  - Explicitly disable fingerprinting headers as applicable for the Nest adapter/proxy path.
- Mitigation:
  - Ensure equivalent headers are enforced at ingress proxy if middleware rollout is delayed.
- False positive notes:
  - If headers are fully enforced by reverse proxy/CDN, risk may already be mitigated outside app code.

## Recommended Fix Order
1. Fix `SEC-001` immediately (public privileged account creation).
2. Fix `SEC-002` (restrict user update DTO + authorization checks).
3. Fix `SEC-003` (audit redaction and sensitive-field denylist).
4. Fix `SEC-004` and `SEC-005` together (auth endpoint hardening).
5. Apply `SEC-006` for defense-in-depth.
