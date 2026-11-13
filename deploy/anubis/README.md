# Anubis integration (bot protection)

[Anubis](https://github.com/TecharoHQ/anubis) is a proof-of-work bot-protection reverse proxy by Techaro. This folder provides **separate** deployment assets so you can place Anubis in front of the existing Flixet app **without modifying existing app configs**.

## Detected deployment / best-fit mode
- **Current repo signals:** Next.js app deployed on **Vercel** (`@vercel/analytics`, `@vercel/speed-insights`, README/Vercel references). No Docker/Nginx/Caddy config in the repo.
- **Best fit:** run the app as a **Node/Next server** behind Anubis on a VPS or container platform using **Docker Compose** (recommended here) or a host reverse proxy (Nginx/Caddy) that forwards to Anubis, which forwards to the app.
- **Vercel note:** Vercel does not let you insert Anubis as a reverse proxy in front of serverless/edge deployments. To use Anubis, deploy this app to a self-hosted/container environment (or any origin you control) and put Anubis in front of that origin. Keep Vercel/production app configs unchanged until you choose to migrate.

## Files in this folder
- `docker-compose.anubis.example.yml` — example Anubis + app service wiring (template).
- `anubis.env.example` — environment variables/placeholders for Anubis.
- `botPolicy.example.yaml` — sensible default bot policy with allowlist guidance.
- `nginx.anubis.conf.example` — example Nginx snippet routing through Anubis.
- `Caddyfile.anubis.example` — example Caddy snippet routing through Anubis.

> These are examples/templates. Copy and adapt them in your deployment environment; do **not** overwrite existing app configs.

## Reverse-proxy flow
Client → (public proxy, optional TLS termination) → **Anubis** (:8923) → **Flixet app** (:3000)

## Secrets / placeholders (set these yourself)
- `ED25519_PRIVATE_KEY_HEX` — signing key for Anubis challenges/tokens. **Generate (example):**
  ```bash
  openssl rand -hex 32
  ```
  or
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
  Store it in your secret manager or env file; never commit real keys.
- `TARGET` — upstream app URL reachable from Anubis (e.g. `http://app:3000` in Compose, or `http://127.0.0.1:3000`).
- `BIND` / `BIND_NETWORK` — Anubis listen address (defaults shown in example).

## What to change on the proxy side (without touching app configs)
1. Point your **public** TLS/domain proxy (Nginx/Caddy/cloud LB) to Anubis instead of directly to the Next.js app.
2. Keep the Next.js app listening on its internal port (e.g. 3000) and **not** publicly exposed except through Anubis.
3. Ensure `X-Forwarded-For`, `X-Forwarded-Proto`, and `Host` headers are preserved (see examples).
4. Allowlist required paths/bots in `botPolicy.example.yaml` (search crawlers you want indexed, health checks, and your own API/webhook routes) and mount it into Anubis per the compose example.
5. If you use webhooks or machine-to-machine API routes, add explicit allow rules for their paths and/or trusted source IPs/user-agents in the policy so PoW challenges don’t break them.

## Verification checklist
- [ ] Start Anubis and the app; confirm Anubis can reach `TARGET` (`curl` from the Anubis container/host).
- [ ] Visit the site in a fresh browser/private window: confirm the **Anubis challenge/interstitial** appears before the app loads.
- [ ] After the challenge completes, confirm normal browsing works (home, search, movie/TV detail pages, playback UI loads).
- [ ] Confirm legitimate assets/API calls used by the app load correctly (watch network tab for unexpected 403/challenge loops).
- [ ] Confirm allowlisted routes/crawlers behave as intended (e.g. `GET /robots.txt`, known crawler UAs, health endpoint, and any webhook/API paths you exempted).
- [ ] Confirm secrets are supplied via env/secret store and not committed; rotate `ED25519_PRIVATE_KEY_HEX` if ever exposed.
- [ ] Tune difficulty/policy in `botPolicy.example.yaml` if challenges are too strict/lenient for your traffic.
