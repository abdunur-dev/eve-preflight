"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Copy,
  Check,
  Terminal,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Layers,
  Menu,
  X,
  BookOpen,
  Code2,
  Cpu,
} from "lucide-react";

type ScenarioType = "all" | "silent-drop" | "slack-misconfig" | "valid-match";

interface Step {
  type: "info" | "success" | "error" | "warn" | "dim";
  text: string;
  badge?: string;
}

const SCENARIOS: Record<ScenarioType, { label: string; steps: Step[] }> = {
  "all": {
    label: "Auto Walkthrough",
    steps: [
      { type: "dim", text: "$ eve dev  # (running in Terminal 1 on :3000)" },
      { type: "info", text: "$ npx eve-preflight", badge: "INIT" },
      { type: "dim", text: "  ↳ Shelling out to `eve info --json`..." },
      { type: "info", text: "  ✔ Discovered registered Eve routes:\n      POST /api/channels/web\n      POST /api/channels/slack", badge: "ROUTES" },
      { type: "info", text: "  ✔ Preflight Proxy listening on :3001 → forwarding to :3000", badge: "PROXY" },
      { type: "warn", text: "▶ INCOMING: POST /api/slack/events (from Slack Webhook)", badge: "EVENT" },
      { type: "error", text: "✖ [404 SILENT DROP GAP DETECTED]\n    Path: /api/slack/events did NOT match any Eve channel.\n    Nitro Result: 404 Not Found.\n    Dashboard Result: ZERO traces created in .eve/traces/v1!\n    Suggestion: Did you mean /api/channels/slack ?", badge: "ALERT" },
      { type: "info", text: "▶ INCOMING: POST /api/channels/slack (Targeted Webhook)", badge: "EVENT" },
      { type: "success", text: "✔ [ROUTE MATCHED]\n    Path: /api/channels/slack matched authored channel.\n    Proxy: Forwarded to Eve server on :3000 → 200 OK\n    Eve Trace: Agent execution span created successfully.", badge: "SUCCESS" },
    ],
  },
  "silent-drop": {
    label: "404 Silent Drop",
    steps: [
      { type: "info", text: "$ npx eve-preflight --target 3000 --port 3001", badge: "PROXY" },
      { type: "dim", text: "  [discovery] Registered channels: ['/api/channels/web', '/api/channels/slack']" },
      { type: "warn", text: "▶ INCOMING: POST /api/webhook/test HTTP/1.1", badge: "INBOUND" },
      { type: "error", text: "✖ [UNMATCHED ROUTE DETECTED]\n    Request to /api/webhook/test does not match any registered channel.\n    Eve Nitro/H3 server will return 404 Not Found.\n    WARNING: This event will leave ZERO traces in your Agent Runs dashboard.", badge: "SILENT 404" },
      { type: "dim", text: "  ↳ Registered valid routes: /api/channels/web, /api/channels/slack" },
    ],
  },
  "slack-misconfig": {
    label: "Slack Misconfig",
    steps: [
      { type: "info", text: "$ npx eve-preflight", badge: "INSPECTOR" },
      { type: "warn", text: "▶ INCOMING: POST /slack/events [Headers: x-slack-signature, x-slack-request-timestamp]", badge: "SLACK" },
      { type: "error", text: "✖ [SLACK CONNECTOR MISCONFIGURATION DETECTED]\n    Inbound request carries valid Slack cryptographic signature,\n    but is targeting /slack/events.\n    Your Eve project registers Slack at: /api/channels/slack.\n    Action: Update your Slack Event Subscription Request URL to :3001/api/channels/slack.", badge: "CRITICAL" },
    ],
  },
  "valid-match": {
    label: "Valid Match",
    steps: [
      { type: "info", text: "$ npx eve-preflight", badge: "INSPECTOR" },
      { type: "info", text: "▶ INCOMING: POST /api/channels/slack HTTP/1.1", badge: "INBOUND" },
      { type: "success", text: "✔ [MATCH] POST /api/channels/slack\n    Payload forwarded to upstream http://localhost:3000\n    Upstream response: 200 OK (latency: 14ms)\n    Agent Span: Recorded in .eve/traces/v1", badge: "MATCH" },
    ],
  },
};

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeScenario, setActiveScenario] = useState<ScenarioType>("all");
  const [visibleStepCount, setVisibleStepCount] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const copyCommand = (cmd: string = "npx eve-preflight") => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    setVisibleStepCount(1);
    if (timerRef.current) clearInterval(timerRef.current);

    const steps = SCENARIOS[activeScenario].steps;

    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setVisibleStepCount((prev) => {
          if (prev < steps.length) {
            return prev + 1;
          } else {
            return 1;
          }
        });
      }, 1600);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeScenario, isPlaying]);

  const currentSteps = SCENARIOS[activeScenario].steps.slice(0, visibleStepCount);

  return (
    <div className="relative min-h-screen bg-black text-zinc-100 flex flex-col justify-between selection:bg-zinc-800 selection:text-white font-mono overflow-x-hidden">
      {/* Background subtle grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-25 z-0" />

      {/* Top Header / Nav */}
      <header className="relative z-30 border-b border-white/10 bg-black/90 backdrop-blur-md px-4 sm:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 group text-white">
            <span className="w-2 h-2 rounded-full bg-[#c28b5b] group-hover:scale-125 transition-transform shrink-0" />
            <span className="font-bold text-xs sm:text-sm tracking-tight text-white whitespace-nowrap">
              eve-preflight
            </span>
          </Link>

          <span className="text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded border border-[#c28b5b]/40 bg-[#c28b5b]/10 text-[#e0a96d] font-mono">
            v0.1.0
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-xs text-zinc-400">
          <Link href="/docs" className="hover:text-white transition-colors">
            docs
          </Link>
          <Link href="/docs/cli-reference" className="hover:text-white transition-colors">
            cli
          </Link>
          <Link href="/docs/how-it-works" className="hover:text-white transition-colors">
            how-it-works
          </Link>
          <a
            href="https://github.com/abdunur-dev/eve-preflight"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            source <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={() => copyCommand()}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-white/15 bg-zinc-900/90 text-white hover:border-[#c28b5b]/60 hover:text-[#e0a96d] transition-all text-xs"
          >
            {copied ? <Check className="w-3 h-3 text-[#e0a96d]" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? "copied" : "npx eve-preflight"}</span>
          </button>
        </nav>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => copyCommand()}
            className="p-1.5 rounded border border-white/10 text-zinc-300 hover:text-[#e0a96d] text-xs"
            aria-label="Copy install command"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#e0a96d]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded border border-white/10 text-zinc-300 hover:text-white"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Slide-down Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden relative z-20 border-b border-white/10 bg-black/95 backdrop-blur-lg px-4 py-4 space-y-3 animate-fadeIn">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Link
              href="/docs"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded border border-zinc-800 bg-zinc-950 text-zinc-200 hover:text-white flex items-center gap-2"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#c28b5b]" />
              <span>Docs</span>
            </Link>
            <Link
              href="/docs/getting-started"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded border border-zinc-800 bg-zinc-950 text-zinc-200 hover:text-white flex items-center gap-2"
            >
              <Terminal className="w-3.5 h-3.5 text-[#c28b5b]" />
              <span>Getting Started</span>
            </Link>
            <Link
              href="/docs/cli-reference"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded border border-zinc-800 bg-zinc-950 text-zinc-200 hover:text-white flex items-center gap-2"
            >
              <Code2 className="w-3.5 h-3.5 text-[#c28b5b]" />
              <span>CLI Flags</span>
            </Link>
            <Link
              href="/docs/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded border border-zinc-800 bg-zinc-950 text-zinc-200 hover:text-white flex items-center gap-2"
            >
              <Cpu className="w-3.5 h-3.5 text-[#c28b5b]" />
              <span>Architecture</span>
            </Link>
          </div>
          <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-400">
            <a
              href="https://github.com/abdunur-dev/eve-preflight"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-white"
            >
              GitHub Source <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://github.com/abdunur-dev/eve-preflight/blob/main/CHANGELOG.md"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              Changelog
            </a>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="relative z-10 max-w-5xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-16 space-y-16 sm:space-y-20 flex-1">
        
        {/* 1. Hero Section */}
        <section className="space-y-5 sm:space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-white/10 bg-zinc-950 text-[11px] sm:text-xs text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c28b5b] animate-ping shrink-0" />
            <span className="text-zinc-300 truncate">Vercel Eve Agent Diagnostic Harness</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] break-words">
            Catch silent webhook failures in eve.
          </h1>

          <p className="text-xs sm:text-base text-zinc-400 leading-relaxed max-w-2xl font-normal">
            A zero-config reverse-proxy inspector that audits inbound webhooks against your authored Eve channels in real time. Catches 404 route drops before they leave zero signal in your Agent Runs dashboard.
          </p>

          {/* Quick Install Line */}
          <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              onClick={() => copyCommand("npx eve-preflight")}
              className="group inline-flex items-center justify-between sm:justify-start gap-3 bg-zinc-950 border border-white/15 hover:border-[#c28b5b]/60 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs text-white transition-all cursor-pointer shadow-lg w-full sm:w-auto"
              aria-label="Copy install command"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-zinc-500 select-none">$</span>
                <span className="font-semibold text-white tracking-wide truncate">npx eve-preflight</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 group-hover:text-[#e0a96d] transition-colors pl-3 border-l border-zinc-800 shrink-0">
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#e0a96d]" />
                    <span className="text-[#e0a96d]">copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>copy</span>
                  </>
                )}
              </div>
            </button>

            <Link
              href="/docs"
              className="inline-flex items-center justify-center sm:justify-start gap-1 text-xs text-zinc-400 hover:text-white transition-colors py-2 px-1"
            >
              <span>Read Documentation</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Metadata pill */}
          <div className="text-[11px] sm:text-xs text-zinc-500 flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-1">
            <span className="text-zinc-300 font-medium">v0.1.0</span>
            <span>·</span>
            <a
              href="https://github.com/abdunur-dev/eve-preflight/blob/main/CHANGELOG.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-[#e0a96d] transition-colors underline decoration-zinc-700"
            >
              (release notes)
            </a>
            <span>·</span>
            <span>status: <strong className="text-zinc-300 font-normal">stable</strong></span>
            <span>·</span>
            <span>zero-config</span>
            <span>·</span>
            <span>MIT License</span>
          </div>
        </section>

        {/* 2. Interactive Terminal Simulator */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="text-xs uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-[#c28b5b] shrink-0" />
              <span className="truncate">Live Preflight Inspection Simulator</span>
            </div>
            
            {/* Scenario Switcher Tabs */}
            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-md border border-white/10 text-xs overflow-x-auto w-full sm:w-auto -mx-1 sm:mx-0 px-1 sm:px-1">
              {(Object.keys(SCENARIOS) as ScenarioType[]).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setActiveScenario(key);
                    setIsPlaying(true);
                  }}
                  className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap text-[11px] shrink-0 ${
                    activeScenario === key
                      ? "bg-[#c28b5b]/20 text-[#e0a96d] font-semibold border border-[#c28b5b]/30"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {SCENARIOS[key].label}
                </button>
              ))}
            </div>
          </div>

          {/* Terminal Window Box */}
          <div className="rounded-xl border border-white/15 bg-zinc-950 overflow-hidden shadow-2xl relative w-full">
            {/* Window Top Bar */}
            <div className="h-10 px-3 sm:px-4 border-b border-white/10 bg-black/60 flex items-center justify-between">
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-zinc-800 border border-zinc-700/60" />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-zinc-800 border border-zinc-700/60" />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-zinc-800 border border-zinc-700/60" />
                <span className="ml-2 text-[10px] sm:text-[11px] text-zinc-400 font-mono hidden min-[440px]:inline truncate max-w-[200px] sm:max-w-none">
                  eve-preflight --live-inspector
                </span>
              </div>

              {/* Play / Replay controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setVisibleStepCount(1);
                    setIsPlaying(true);
                  }}
                  className="p-1 text-zinc-400 hover:text-[#e0a96d] transition-colors rounded"
                  title="Replay simulation"
                  aria-label="Replay simulation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 whitespace-nowrap">
                  {visibleStepCount} / {SCENARIOS[activeScenario].steps.length}
                </span>
              </div>
            </div>

            {/* Terminal Body Content */}
            <div className="p-4 sm:p-6 min-h-[280px] sm:min-h-[300px] text-[11px] sm:text-xs font-mono space-y-3 bg-black/90 overflow-x-auto">
              {currentSteps.map((step, idx) => {
                let badgeStyle = "border-zinc-800 bg-zinc-900 text-zinc-400";
                let textStyle = "text-zinc-300";

                if (step.type === "error") {
                  badgeStyle = "border-red-900/60 bg-red-950/40 text-red-400";
                  textStyle = "text-red-300 font-medium";
                } else if (step.type === "warn") {
                  badgeStyle = "border-[#c28b5b]/50 bg-[#c28b5b]/20 text-[#e0a96d]";
                  textStyle = "text-white font-semibold";
                } else if (step.type === "success") {
                  badgeStyle = "border-[#c28b5b]/50 bg-[#c28b5b]/20 text-[#e0a96d]";
                  textStyle = "text-[#e0a96d]";
                } else if (step.type === "dim") {
                  textStyle = "text-zinc-500";
                }

                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-2 transition-all duration-200 ${
                      step.type === "error" ? "p-2.5 sm:p-3 rounded border border-red-900/50 bg-red-950/20" : ""
                    }`}
                  >
                    {step.badge && (
                      <span
                        className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded border uppercase tracking-wider shrink-0 font-bold ${badgeStyle}`}
                      >
                        {step.badge}
                      </span>
                    )}
                    <pre className={`whitespace-pre-wrap break-words break-all sm:break-normal leading-relaxed flex-1 font-mono ${textStyle}`}>
                      {step.text}
                    </pre>
                  </div>
                );
              })}

              {/* Blinking cursor */}
              <div className="flex items-center gap-1.5 text-[#c28b5b] pt-2">
                <span>❯</span>
                <span className="w-2 h-4 bg-[#c28b5b] animate-pulse inline-block" />
              </div>
            </div>

            {/* Terminal Footer Info */}
            <div className="border-t border-white/10 bg-zinc-950/80 px-4 sm:px-5 py-2.5 text-[10px] sm:text-[11px] text-zinc-500 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c28b5b] shrink-0" />
                <span className="truncate">Zero code change: Eve agent runs unmodified</span>
              </div>
              <span className="text-zinc-400 shrink-0">Proxy: :3001 ➔ Target: :3000</span>
            </div>
          </div>
        </section>

        {/* 3. "The Problem" Section */}
        <section className="border-t border-white/10 pt-10 sm:pt-12 space-y-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-red-400 font-semibold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>The Silent Failure Problem</span>
          </div>

          <div className="max-w-3xl space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              Why webhook misconfigurations waste hours in Eve.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              When an inbound event hits Vercel Eve on an unmapped path, Eve’s Nitro/H3 server drops it with a generic 404 before it ever reaches your agent dispatcher. Because execution never enters the agent lifecycle, it leaves <strong className="text-white font-semibold">ZERO trace</strong> in terminal output, local spans, or the Vercel Agent Runs dashboard.
            </p>
          </div>

          {/* Diagnostic Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-1">
            <div className="p-4 rounded-lg border border-red-900/40 bg-red-950/10 space-y-1.5">
              <div className="text-red-400 font-bold text-[11px] sm:text-xs uppercase tracking-wider">Nitro Server</div>
              <div className="text-lg sm:text-xl font-bold text-white">404 Not Found</div>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-normal">
                HTTP connection dropped immediately. Sender receives generic 404 with no context.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-red-900/40 bg-red-950/10 space-y-1.5">
              <div className="text-red-400 font-bold text-[11px] sm:text-xs uppercase tracking-wider">Eve Dashboard</div>
              <div className="text-lg sm:text-xl font-bold text-white">0 Spans / 0 Runs</div>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-normal">
                No OpenTelemetry span is initialized. The run never appears on Vercel dashboard.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-[#c28b5b]/40 bg-[#c28b5b]/10 space-y-1.5">
              <div className="text-[#e0a96d] font-bold text-[11px] sm:text-xs uppercase tracking-wider">With Preflight</div>
              <div className="text-lg sm:text-xl font-bold text-white">Instant Alert</div>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-normal">
                Preflight logs the exact mistyped route and suggests your authored channel URL.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Side-by-Side Before / After Comparison */}
        <section className="border-t border-white/10 pt-10 sm:pt-12 space-y-6">
          <div className="text-xs uppercase tracking-widest text-zinc-400 font-semibold flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#c28b5b] shrink-0" />
            <span>Before vs. After Comparison</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Without Preflight */}
            <div className="rounded-lg border border-red-900/40 bg-zinc-950 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="text-xs font-bold text-red-400 flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  <span className="truncate">Without eve-preflight</span>
                </span>
                <span className="text-[10px] text-zinc-500 shrink-0">eve dev</span>
              </div>
              <div className="bg-black/80 p-3 rounded font-mono text-[11px] text-zinc-400 space-y-2 border border-zinc-900 min-h-[140px] sm:min-h-[160px] overflow-x-auto">
                <div className="text-zinc-500 break-all">$ curl -X POST http://localhost:3000/api/slack/events</div>
                <div className="text-red-400">&lt; HTTP/1.1 404 Not Found</div>
                <div className="text-zinc-600 pt-2 font-sans italic">
                  Eve dev terminal status:
                </div>
                <div className="text-zinc-500">
                  (idle... zero logs printed. No trace generated. Nothing to debug.)
                </div>
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-400 leading-normal">
                You spend hours questioning tokens, tunnels, and webhook signers because the failure is completely silent.
              </p>
            </div>

            {/* With Preflight */}
            <div className="rounded-lg border border-[#c28b5b]/40 bg-zinc-950 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="text-xs font-bold text-[#e0a96d] flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-[#c28b5b] shrink-0" />
                  <span className="truncate">With eve-preflight</span>
                </span>
                <span className="text-[10px] text-zinc-500 shrink-0">npx eve-preflight</span>
              </div>
              <div className="bg-black/80 p-3 rounded font-mono text-[11px] text-zinc-300 space-y-1.5 border border-zinc-900 min-h-[140px] sm:min-h-[160px] overflow-x-auto">
                <div className="text-white font-semibold break-all">▶ POST /api/slack/events</div>
                <div className="text-red-400 font-medium">✖ Request did NOT match any Eve channel!</div>
                <div className="text-[#e0a96d]">Registered channels:</div>
                <div className="text-zinc-300">  - /api/channels/web</div>
                <div className="text-zinc-300">  - /api/channels/slack</div>
                <div className="text-zinc-400 pt-1">Suggestion: Target /api/channels/slack</div>
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-400 leading-normal">
                Immediate visibility in the proxy terminal. You spot and fix the path disparity in seconds.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Features Section */}
        <section className="border-t border-white/10 pt-10 sm:pt-12 space-y-6 sm:space-y-8">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Engineered for Developer Speed
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 text-xs text-zinc-400 leading-relaxed">
            <div className="space-y-1.5">
              <h3 className="font-bold text-white text-sm">Zero-Config Route Discovery</h3>
              <p>
                Shells out to <code className="text-zinc-200">eve info --json</code> on startup to discover all registered channels dynamically without manual config files.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-white text-sm">High-Fidelity Reverse Proxy</h3>
              <p>
                Sits transparently on port 3001, streaming bodies, headers, and chunks directly to your upstream Eve Nitro server on port 3000.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-white text-sm">Slack Heuristic Detection</h3>
              <p>
                Detects Slack signature headers (<code className="text-zinc-200">x-slack-signature</code>) hitting unmapped paths and gives tailored remediation advice.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-white text-sm">Zero Production Impact</h3>
              <p>
                A standalone developer harness. When deploying to production on Vercel, zero changes are required to your codebase.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Bottom CTA */}
        <section className="p-6 sm:p-8 rounded-xl border border-white/15 bg-zinc-950 text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Start catching silent drops today.</h2>
          <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
            Runs with zero installation directly inside any Eve agent repository:
          </p>
          <div className="pt-2">
            <button
              onClick={() => copyCommand("npx eve-preflight")}
              className="inline-flex items-center gap-2.5 sm:gap-3 bg-black border border-[#c28b5b]/50 hover:border-[#c28b5b] px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg text-xs font-bold text-white transition-all shadow-xl"
            >
              <span className="text-zinc-500">$</span>
              <span className="truncate">npx eve-preflight</span>
              <Copy className="w-3.5 h-3.5 text-[#e0a96d] shrink-0" />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black px-4 sm:px-8 py-6 sm:py-8 text-xs font-mono text-zinc-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-zinc-400 text-[11px] sm:text-xs">
            <span className="font-semibold text-white">eve-preflight</span>
            <span>·</span>
            <span>v0.1.0</span>
            <span>·</span>
            <span>MIT License</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] sm:text-xs">
            <a
              href="https://github.com/abdunur-dev/eve-preflight/blob/main/CHANGELOG.md"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              changelog
            </a>
            <a
              href="https://github.com/abdunur-dev/eve-preflight"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              source
            </a>
            <Link
              href="/docs"
              className="hover:text-white transition-colors"
            >
              docs
            </Link>
            <span className="hidden sm:inline">·</span>
            <span className="text-zinc-400">Vercel Eve Diagnostic Tool</span>
          </div>
        </div>
      </footer>
    </div>
  );
}