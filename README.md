# eve-preflight

> Preflight reverse-proxy & webhook route auditor for Vercel Eve agents.

## The Problem

When building agents with [Eve (Vercel's agent framework)](https://github.com/vercel/eve), inbound webhooks and channel events (such as Slack mentions, Linear triggers, or custom HTTP webhooks) are routed through an internal Nitro/H3 server. If an external service, tunnel, or connector is misconfigured to send events to a path that does not match an authored channel route (for instance, `/api/slack/events` instead of `/eve/v1/slack`, or a misconfigured HTTP webhook endpoint), Nitro immediately returns a `404 Not Found` to the sender. Crucially, **Eve's own developer tooling—including the `eve dev` terminal logs, `.eve/logs`, OpenTelemetry traces (`eve traces ls`), and the Vercel Agent Runs dashboard—emits ZERO signal or warning**. The failure is completely silent to the developer, leading to frustrating debugging sessions when webhooks appear to be ignored without a trace.

## Why This Exists

Eve channels are filesystem-first and dynamically registered. External webhook providers and connectors (like Slack Event Subscriptions or Vercel Connect) require exact route URLs. When those URLs drift or are misconfigured, the request never enters Eve's execution lifecycle, meaning no agent session or error handler is ever invoked.

`eve-preflight` sits as a lightweight diagnostic layer in front of your `eve dev` server. It queries your agent's registered routes directly via `eve info --json`, inspects connector targets, and audits every incoming request. When an unrouted request arrives, `eve-preflight` immediately alerts you in your terminal with the exact route mismatch and a list of valid registered channels.

## Getting Started

### 1. Run your Eve agent in one terminal
```bash
npx eve dev
```
*(By default, Eve dev listens on port `2000`, or whichever port you specify via `--port`)*

### 2. In another terminal, run eve-preflight
```bash
npx eve-preflight
```

That's it! Zero configuration required. `eve-preflight` will:
1. Inspect your current Eve workspace (`eve info --json`).
2. Discover all active authored routes (e.g. `POST /eve/v1/slack`, `POST /webhook/inbound`, etc.).
3. Start a diagnostic reverse-proxy on `http://localhost:3000` forwarding to Eve.

### Options & Configuration

You can customize the proxy and target ports via CLI flags or environment variables:

```bash
# Using CLI options
npx eve-preflight --port 3000 --target 3100

# Using environment variables
PREFLIGHT_PORT=3000 EVE_PORT=3100 npx eve-preflight
```

| Option | Environment Variable | Default | Description |
| :--- | :--- | :--- | :--- |
| `-p, --port <number>` | `PREFLIGHT_PORT` / `PORT` | `3000` | Port for the preflight inspector proxy |
| `-t, --target <number>` | `EVE_PORT` / `TARGET_PORT` | `2000` | Port where `eve dev` is listening |
| `-h, --help` | — | — | Show usage information |
| `-v, --version` | — | — | Show CLI version |

---

## Before & After Comparison

### Before (Without eve-preflight)

An external service sends a webhook to a misconfigured route:
```bash
curl -X POST http://localhost:2000/webhook/wrong-path -d '{"event":"message"}'
```

**Sender HTTP Response:**
```http
HTTP/1.1 404 Not Found
{"error": true, "status": 404, "message": "Cannot find any route matching [POST] http://localhost:2000/webhook/wrong-path"}
```

**Eve Dev Server Terminal Output:**
```text
☰eve  v0.53.1
[DEV] server listening at http://127.0.0.1:2000/
(Completely silent — no warning, no log line emitted)
```

**Eve Traces / Agent Runs:**
```bash
$ npx eve traces ls
No local traces found under .eve/traces/v1.
```

---

### After (With eve-preflight)

You point your local tunnel (ngrok, cloudflared, or test curl) at the preflight proxy (`http://localhost:3000`):
```bash
curl -X POST http://localhost:3000/webhook/wrong-path -d '{"event":"message"}'
```

**`eve-preflight` Terminal Output:**
```text
================================================================================
[!] SILENT FAILURE DETECTED:
Request to /webhook/wrong-path [POST] did not match any eve channel.
Registered paths are:
  - [GET]  / (channel: home)
  - [GET]  /eve/v1/health (channel: eve)
  - [POST] /eve/v1/session (channel: eve)
  - [POST] /webhook/inbound (channel: http)
  - [POST] /eve/v1/slack (channel: slack)

This will return 404 and leave NO trace in eve's dashboard or logs.
================================================================================
```

When you send to the correct registered path (`/webhook/inbound`):
```text
[MATCH] POST /webhook/inbound -> Matched channel: "http" (/webhook/inbound)
```

---

## License

MIT
