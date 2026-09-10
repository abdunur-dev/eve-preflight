import Link from "next/link";
import { AlertTriangle, Terminal, ArrowRight, HelpCircle } from "lucide-react";

export default function TroubleshootingPage() {
  return (
    <div className="space-y-10 font-sans">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-zinc-800 bg-zinc-900/80 text-[11px] font-mono text-zinc-400">
          <span className="text-[#c28b5b]">●</span> Diagnosis
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Troubleshooting
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Solutions to the most common runtime errors and environment issues.
        </p>
      </div>

      <div className="space-y-6">
        {/* Issue 1: Command not found */}
        <section className="p-5 rounded-lg border border-zinc-800 bg-zinc-950/60 space-y-3">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>&quot;command not found: eve-preflight&quot;</span>
          </h2>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Occurs when running <code className="text-zinc-200 font-mono">eve-preflight</code> directly without a global install or without using npx.
          </p>
          <div className="space-y-1.5">
            <div className="text-[11px] text-zinc-500 font-mono">Fix 1: Run via npx directly (recommended)</div>
            <div className="bg-black/60 p-2.5 rounded font-mono text-xs text-zinc-200 border border-zinc-900">
              <span className="text-zinc-500 select-none">$ </span>npx eve-preflight
            </div>
            <div className="text-[11px] text-zinc-500 font-mono pt-1">Fix 2: Install globally or link locally</div>
            <div className="bg-black/60 p-2.5 rounded font-mono text-xs text-zinc-200 border border-zinc-900">
              <span className="text-zinc-500 select-none">$ </span>npm install -g eve-preflight
            </div>
          </div>
        </section>

        {/* Issue 2: EADDRINUSE */}
        <section className="p-5 rounded-lg border border-zinc-800 bg-zinc-950/60 space-y-3">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>&quot;Error: listen EADDRINUSE: address already in use :::3001&quot;</span>
          </h2>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Another process is already listening on the default preflight port (<code className="text-zinc-200 font-mono">3001</code>).
          </p>
          <div className="space-y-1.5">
            <div className="text-[11px] text-zinc-500 font-mono">Fix: Pass a custom port flag or environment variable</div>
            <div className="bg-black/60 p-2.5 rounded font-mono text-xs text-zinc-200 border border-zinc-900">
              <span className="text-zinc-500 select-none">$ </span>npx eve-preflight -p 3002
            </div>
          </div>
        </section>

        {/* Issue 3: Upstream Unreachable */}
        <section className="p-5 rounded-lg border border-zinc-800 bg-zinc-950/60 space-y-3">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>&quot;ECONNREFUSED 127.0.0.1:3000&quot; / Upstream Unreachable</span>
          </h2>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Preflight tried to forward a request to your Eve dev server at <code className="text-zinc-200 font-mono">http://localhost:3000</code>, but no server was responding.
          </p>
          <div className="space-y-1.5">
            <div className="text-[11px] text-zinc-500 font-mono">Fix: Start your Eve agent dev server first</div>
            <div className="bg-black/60 p-2.5 rounded font-mono text-xs text-zinc-200 border border-zinc-900">
              <span className="text-zinc-500 select-none">$ </span>npx eve dev
            </div>
            <p className="text-zinc-500 text-[11px] pt-1">
              If your Eve server is running on a non-standard port (e.g. 4000), use <code className="text-zinc-300 font-mono">-t 4000</code>.
            </p>
          </div>
        </section>

        {/* Issue 4: No Eve project */}
        <section className="p-5 rounded-lg border border-zinc-800 bg-zinc-950/60 space-y-3">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>&quot;Error: Could not read eve info --json&quot; / No Eve Project</span>
          </h2>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Preflight must be executed inside the root of a valid Eve project containing an <code className="text-zinc-200 font-mono">eve.config.ts</code> file or an <code className="text-zinc-200 font-mono">agent/</code> directory.
          </p>
          <div className="space-y-1.5">
            <div className="text-[11px] text-zinc-500 font-mono">Fix: cd into your Eve project directory before running</div>
            <div className="bg-black/60 p-2.5 rounded font-mono text-xs text-zinc-200 border border-zinc-900">
              <span className="text-zinc-500 select-none">$ </span>cd my-eve-agent<br />
              <span className="text-zinc-500 select-none">$ </span>npx eve-preflight
            </div>
          </div>
        </section>
      </div>

      {/* Back to overview link */}
      <div className="border-t border-zinc-900 pt-6 flex justify-between">
        <Link
          href="/docs/how-it-works"
          className="text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          ← How It Works
        </Link>
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#c28b5b] hover:text-[#e0a96d] transition-colors"
        >
          Back to Overview <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
