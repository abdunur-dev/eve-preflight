#!/usr/bin/env node
import http from "node:http";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
const VERSION = "0.1.0";
function printHelp() {
    console.log(`
eve-preflight v${VERSION}
Preflight reverse-proxy & webhook route auditor for Vercel Eve agents.
Catches webhook and HTTP requests that hit the server but match no authored channel.

USAGE:
  $ npx eve-preflight [options]

OPTIONS:
  -p, --port <port>     Port for eve-preflight proxy (default: 3000, or $PREFLIGHT_PORT / $PORT)
  -t, --target <port>   Port where eve dev is running (default: 2000, or $EVE_PORT / $TARGET_PORT)
  -h, --help            Show this help message
  -v, --version         Show version number

ENVIRONMENT VARIABLES:
  PREFLIGHT_PORT        Port for the preflight inspector proxy (default: 3000)
  EVE_PORT              Port where eve dev is listening (default: 2000)

EXAMPLES:
  $ npx eve-preflight
  $ npx eve-preflight --port 3000 --target 3100
  $ PREFLIGHT_PORT=3000 EVE_PORT=3100 npx eve-preflight
`);
}
function parseArgs() {
    const args = process.argv.slice(2);
    let proxyPort = parseInt(process.env.PREFLIGHT_PORT || process.env.PORT || "3000", 10);
    let targetPort = parseInt(process.env.EVE_PORT || process.env.TARGET_PORT || "2000", 10);
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === "-h" || arg === "--help") {
            printHelp();
            process.exit(0);
        }
        if (arg === "-v" || arg === "--version") {
            console.log(`eve-preflight v${VERSION}`);
            process.exit(0);
        }
        if ((arg === "-p" || arg === "--port") && i + 1 < args.length) {
            proxyPort = parseInt(args[++i], 10);
        }
        if ((arg === "-t" || arg === "--target") && i + 1 < args.length) {
            targetPort = parseInt(args[++i], 10);
        }
    }
    return { proxyPort, targetPort };
}
// 1. Resolve Project Root
function resolveProjectRoot() {
    const cwd = process.cwd();
    if (fs.existsSync(path.join(cwd, "agent")) || fs.existsSync(path.join(cwd, ".eve"))) {
        return cwd;
    }
    const reproPath = path.join(cwd, "eve-repro");
    if (fs.existsSync(reproPath)) {
        return reproPath;
    }
    return cwd;
}
const projectRoot = resolveProjectRoot();
function pathToRegex(pattern) {
    const escaped = pattern
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        .replace(/:[a-zA-Z0-9_]+/g, "[^/]+");
    return new RegExp(`^${escaped}$`);
}
// 2. Read Eve Info and Registered Routes
function getRegisteredRoutes() {
    console.log(`[eve-preflight] Reading registered routes from project at: ${projectRoot}`);
    let jsonOutput = "";
    try {
        const compiledPath = path.join(projectRoot, ".eve", "compile", "compiled-agent-manifest.json");
        if (fs.existsSync(compiledPath)) {
            const manifest = JSON.parse(fs.readFileSync(compiledPath, "utf-8"));
            if (Array.isArray(manifest.channels)) {
                return manifest.channels.map((c) => ({
                    name: c.name,
                    kind: c.kind ?? "unknown",
                    method: (c.method || "POST").toUpperCase(),
                    urlPath: c.urlPath,
                    regex: pathToRegex(c.urlPath),
                }));
            }
        }
        jsonOutput = execSync("npx --no-install eve info --json", {
            cwd: projectRoot,
            encoding: "utf-8",
            stdio: ["ignore", "pipe", "pipe"],
        });
    }
    catch {
        try {
            jsonOutput = execSync("npx eve info --json", {
                cwd: projectRoot,
                encoding: "utf-8",
                stdio: ["ignore", "pipe", "pipe"],
            });
        }
        catch (e) {
            console.error(`[eve-preflight] Error running 'eve info --json':`, e.message);
            return [];
        }
    }
    try {
        const info = JSON.parse(jsonOutput.trim());
        if (!info.channels || !Array.isArray(info.channels)) {
            return [];
        }
        return info.channels.map((c) => ({
            name: c.name,
            kind: c.kind,
            method: (c.method || "POST").toUpperCase(),
            urlPath: c.urlPath,
            regex: pathToRegex(c.urlPath),
        }));
    }
    catch (err) {
        console.error(`[eve-preflight] Failed to parse eve info JSON:`, err.message);
        return [];
    }
}
// 3. Compare with Connector Configurations (Vercel Connect / Local Channels)
function inspectConnectors(routes) {
    console.log(`\n--- Connector Configuration Check ---`);
    // A. Check Vercel Connect CLI
    try {
        const connectJson = execSync("vercel connect list --format=json --non-interactive", {
            cwd: projectRoot,
            encoding: "utf-8",
            timeout: 3000,
            stdio: ["ignore", "pipe", "pipe"],
        });
        const connectors = JSON.parse(connectJson);
        console.log(`[Vercel Connect] Discovered ${connectors.length ?? 0} remote connectors.`);
    }
    catch {
        console.log(`[Vercel Connect] Remote inspection skipped (CLI not linked/authenticated).`);
    }
    // B. Check Authored Local Channels & Conventional Expectations
    const authoredChannelsDir = path.join(projectRoot, "agent", "channels");
    if (fs.existsSync(authoredChannelsDir)) {
        const files = fs.readdirSync(authoredChannelsDir);
        for (const file of files) {
            if (file.startsWith("slack.")) {
                const slackRoute = routes.find((r) => r.name === "slack" && r.method === "POST");
                const expectedPath = slackRoute ? slackRoute.urlPath : "/eve/v1/slack";
                console.log(`[Slack Channel] Authored channel detected: 'agent/channels/${file}'`);
                console.log(`  -> Eve serves webhook at:  POST ${expectedPath}`);
                console.log(`  -> Common Misconfiguration: pointing Slack Request URL to '/slack/events' or '/api/slack/events'.`);
                console.log(`     Ensure your Slack App or Vercel Connect trigger route matches '${expectedPath}'.`);
            }
        }
    }
    console.log(`--------------------------------------\n`);
}
// 4. Reverse Proxy & Detection Layer
function startProxy(routes, proxyPort, targetPort) {
    console.log(`[eve-preflight] Active Registered Eve Routes:`);
    routes.forEach((r) => {
        console.log(`  • [${r.method}] ${r.urlPath} (channel: ${r.name}, kind: ${r.kind})`);
    });
    console.log(`\n[eve-preflight] Starting preflight inspector on http://localhost:${proxyPort}`);
    console.log(`[eve-preflight] Forwarding valid requests to Eve dev server at http://127.0.0.1:${targetPort}\n`);
    const server = http.createServer((clientReq, clientRes) => {
        const reqMethod = (clientReq.method || "GET").toUpperCase();
        const reqUrl = new URL(clientReq.url || "/", `http://${clientReq.headers.host || "localhost"}`);
        const pathname = reqUrl.pathname;
        const match = routes.find((r) => r.method === reqMethod && r.regex.test(pathname));
        if (match) {
            console.log(`[MATCH] ${reqMethod} ${pathname} -> Matched channel: "${match.name}" (${match.urlPath})`);
        }
        else {
            console.log(`\x1b[31m%s\x1b[0m`, `\n================================================================================`);
            console.log(`\x1b[31m%s\x1b[0m`, `[!] SILENT FAILURE DETECTED:`);
            console.log(`Request to ${pathname} [${reqMethod}] did not match any eve channel.\nRegistered paths are:\n${routes
                .map((r) => `  - [${r.method}] ${r.urlPath} (channel: ${r.name})`)
                .join("\n")}`);
            console.log(`\x1b[33m%s\x1b[0m`, `This will return 404 and leave NO trace in eve's dashboard or logs.`);
            console.log(`\x1b[31m%s\x1b[0m`, `================================================================================\n`);
        }
        const upstreamOptions = {
            hostname: "127.0.0.1",
            port: targetPort,
            path: clientReq.url,
            method: clientReq.method,
            headers: {
                ...clientReq.headers,
                host: `127.0.0.1:${targetPort}`,
            },
        };
        const upstreamReq = http.request(upstreamOptions, (upstreamRes) => {
            clientRes.writeHead(upstreamRes.statusCode || 500, upstreamRes.headers);
            upstreamRes.pipe(clientRes);
        });
        upstreamReq.on("error", (err) => {
            console.error(`[eve-preflight] Upstream connection error (is 'eve dev --port ${targetPort}' running?): ${err.message}`);
            clientRes.writeHead(502, { "Content-Type": "application/json" });
            clientRes.end(JSON.stringify({ error: "Upstream Eve server unreachable", detail: err.message }));
        });
        clientReq.pipe(upstreamReq);
    });
    server.listen(proxyPort, () => {
        console.log(`[eve-preflight] Listening on port ${proxyPort}. Ready for test requests.\n`);
    });
}
function main() {
    const { proxyPort, targetPort } = parseArgs();
    const routes = getRegisteredRoutes();
    inspectConnectors(routes);
    startProxy(routes, proxyPort, targetPort);
}
main();
