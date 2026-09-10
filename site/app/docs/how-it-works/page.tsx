import Link from "next/link";
import { ArrowRight, CheckCircle2, XCircle, AlertTriangle, ShieldCheck } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="space-y-10 font-sans">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-zinc-800 bg-zinc-900/80 text-[11px] font-mono text-zinc-400">
          <span className="text-[#c28b5b]">●</span> Architecture
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          How It Works
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed">
          A deep dive into how <code className="text-zinc-200 font-mono text-xs">eve-preflight</code> intercepts and validates requests without modifying your Eve project code.
        </p>
      </div>

      {/* Step 1: Discovery */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <span className="font-mono text-xs text-[#c28b5b]">01.</span> Route Discovery via eve info --json
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          On launch, preflight executes <code className="text-zinc-200 font-mono text-xs">eve info --json</code> in a child process inside your project directory. It parses the resulting JSON payload, extracting every registered channel entry in <code className="text-zinc-200 font-mono text-xs">channels[].urlPath</code> (e.g. <code className="text-zinc-200 font-mono text-xs">/api/channels/web</code>, <code className="text-zinc-200 font-mono text-xs">/api/channels/slack</code>).
        </p>
        <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-950 font-mono text-xs text-zinc-300">
          <div className="text-zinc-500">// Parsed channel definition</div>
          <div>{`{ "name": "slack", "urlPath": "/api/channels/slack", "type": "webhook" }`}</div>
        </div>
      </section>

      {/* Step 2: Reverse Proxy Layer */}
      <section className="space-y-3 border-t border-zinc-900 pt-8">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <span className="font-mono text-xs text-[#c28b5b]">02.</span> Transparent Reverse-Proxy Layer
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Preflight binds a lightweight Node HTTP reverse-proxy on port <code className="text-zinc-200 font-mono text-xs">3001</code> (or <code className="text-zinc-200 font-mono text-xs">PREFLIGHT_PORT</code>) sitting between webhook senders and the local Eve dev instance on port <code className="text-zinc-200 font-mono text-xs">3000</code>. Every incoming byte, header, and chunk is streamed transparently to ensure 100% request fidelity.
        </p>
      </section>

      {/* Step 3: Path and Method Matching */}
      <section className="space-y-4 border-t border-zinc-900 pt-8">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <span className="font-mono text-xs text-[#c28b5b]">03.</span> Match vs. No-Match Behavior
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Match */}
          <div className="p-4 rounded-lg border border-[#c28b5b]/30 bg-[#c28b5b]/10 space-y-2">
            <div className="flex items-center gap-2 text-[#c28b5b] font-mono font-semibold text-xs">
              <CheckCircle2 className="w-4 h-4" /> On Match
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed font-sans">
              The request path strictly matches a registered channel urlPath. Preflight logs a match audit entry and forwards the stream directly to Eve:
            </p>
            <div className="bg-black/60 p-2.5 rounded font-mono text-[11px] text-[#e0a96d] border border-[#c28b5b]/30">
              ✓ [MATCH] POST /api/channels/slack (200 OK)
            </div>
          </div>

          {/* No Match */}
          <div className="p-4 rounded-lg border border-red-950/60 bg-red-950/10 space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-mono font-semibold text-xs">
              <XCircle className="w-4 h-4" /> On No Match (Silent Failure Trap)
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed font-sans">
              The request lands on an unmapped endpoint (e.g. <code className="font-mono text-zinc-300">/api/slack/events</code>). Preflight intercepts it, prints a high-priority red warning, outputs all valid routes, and explains that Eve will drop it with a silent 404:
            </p>
            <div className="bg-black/60 p-2.5 rounded font-mono text-[11px] text-red-300 border border-red-900/40">
              ⚠ [MISMATCH] POST /api/slack/events → 404
            </div>
          </div>
        </div>
      </section>

      {/* Step 4: Slack-Specific Connector Check */}
      <section className="space-y-3 border-t border-zinc-900 pt-8">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <span className="font-mono text-xs text-[#c28b5b]">04.</span> Slack Connector Heuristic Check
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Preflight inspects incoming HTTP headers for standard Slack signing signatures (<code className="text-zinc-200 font-mono text-xs">x-slack-signature</code> and <code className="text-zinc-200 font-mono text-xs">x-slack-request-timestamp</code>).
        </p>
        <p className="text-zinc-400 text-sm leading-relaxed">
          If a Slack request arrives at an unmapped path (like <code className="text-zinc-200 font-mono text-xs">/webhook</code> or <code className="text-zinc-200 font-mono text-xs">/slack/events</code>), preflight explicitly flags:
        </p>
        <div className="p-3.5 rounded-lg border border-amber-900/50 bg-amber-950/20 font-mono text-xs text-amber-300">
          [SLACK CONNECTOR MISCONFIGURATION DETECTED]<br />
          Slack request detected via x-slack-signature header, but sent to /slack/events.<br />
          Your registered Slack channel is served at: /api/channels/slack.
        </div>
      </section>

      {/* Next link */}
      <div className="border-t border-zinc-900 pt-6 flex justify-between">
        <Link
          href="/docs/cli-reference"
          className="text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          ← CLI Reference
        </Link>
        <Link
          href="/docs/troubleshooting"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#c28b5b] hover:text-[#e0a96d] transition-colors"
        >
          Troubleshooting <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
