import Link from "next/link";
import { ArrowRight, PlayCircle, Code2, Cpu, AlertCircle, Terminal } from "lucide-react";

export default function DocsOverviewPage() {
  return (
    <div className="space-y-10 font-sans">
      {/* Page Title */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-zinc-800 bg-zinc-900/80 text-[11px] font-mono text-zinc-400">
          <span className="text-[#c28b5b]">●</span> Documentation
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Overview
        </h1>
        <p className="text-zinc-400 text-base leading-relaxed">
          When an inbound webhook or HTTP request hits Vercel Eve on an unmapped route, Eve's underlying Nitro/H3 server drops it with a raw 404 before it reaches your agent. Because the request never enters the agent lifecycle, it leaves zero trace in Eve's terminal logs, local traces (<code className="text-zinc-200 font-mono text-xs">.eve/traces/v1</code>), or the Vercel Agent Runs dashboard. <strong className="text-zinc-200 font-medium">eve-preflight</strong> sits as a non-intrusive diagnostic proxy in front of Eve, intercepting incoming traffic to immediately pinpoint path misconfigurations, unhandled signatures, and silent drops.
        </p>
      </div>

      {/* Quick Run Box */}
      <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-950/80 font-mono text-xs space-y-2">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-zinc-300 font-semibold flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#c28b5b]" /> Quick Run
          </span>
          <span className="text-[11px] text-zinc-500">Zero install needed</span>
        </div>
        <div className="bg-black/60 border border-zinc-900 rounded p-2.5 text-zinc-200 flex items-center justify-between">
          <code>npx eve-preflight</code>
        </div>
      </div>

      {/* Section Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight">Explore the Documentation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/docs/getting-started"
            className="p-5 rounded-lg border border-zinc-800/80 bg-zinc-950/50 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all group space-y-2 block"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-200 font-semibold text-sm">
                <PlayCircle className="w-4 h-4 text-[#c28b5b]" />
                <span>Getting Started</span>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-zinc-400 leading-normal">
              Two-terminal workflow, running against local Eve dev servers, and validating first requests.
            </p>
          </Link>

          <Link
            href="/docs/cli-reference"
            className="p-5 rounded-lg border border-zinc-800/80 bg-zinc-950/50 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all group space-y-2 block"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-200 font-semibold text-sm">
                <Code2 className="w-4 h-4 text-[#c28b5b]" />
                <span>CLI Reference</span>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-zinc-400 leading-normal">
              Complete reference of flags (<code className="font-mono text-zinc-300">-p</code>, <code className="font-mono text-zinc-300">-t</code>) and environment variables.
            </p>
          </Link>

          <Link
            href="/docs/how-it-works"
            className="p-5 rounded-lg border border-zinc-800/80 bg-zinc-950/50 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all group space-y-2 block"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-200 font-semibold text-sm">
                <Cpu className="w-4 h-4 text-[#c28b5b]" />
                <span>How It Works</span>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-zinc-400 leading-normal">
              Technical architecture: route schema discovery via <code className="font-mono text-zinc-300">eve info --json</code>, proxying, and Slack checks.
            </p>
          </Link>

          <Link
            href="/docs/troubleshooting"
            className="p-5 rounded-lg border border-zinc-800/80 bg-zinc-950/50 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all group space-y-2 block"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-200 font-semibold text-sm">
                <AlertCircle className="w-4 h-4 text-[#c28b5b]" />
                <span>Troubleshooting</span>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-zinc-400 leading-normal">
              Fix common errors like EADDRINUSE, upstream unreachable, or missing project context.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
