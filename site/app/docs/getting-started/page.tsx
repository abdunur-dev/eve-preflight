import Link from "next/link";
import { Terminal, CheckCircle2, ArrowRight } from "lucide-react";

export default function GettingStartedPage() {
  return (
    <div className="space-y-10 font-sans">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-zinc-800 bg-zinc-900/80 text-[11px] font-mono text-zinc-400">
          <span className="text-[#c28b5b]">●</span> Guide
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Getting Started
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Get started with <code className="text-zinc-200 font-mono text-xs">eve-preflight</code> in less than 60 seconds with zero configuration.
        </p>
      </div>

      {/* Step 1 */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-[#c28b5b]/10 border border-[#c28b5b]/30 text-[#c28b5b] flex items-center justify-center font-mono text-xs font-bold">
            1
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Run via npx (Zero Install)
          </h2>
        </div>
        <p className="text-zinc-400 text-sm">
          Run <code className="text-zinc-200 font-mono text-xs">eve-preflight</code> directly inside your Eve project directory:
        </p>
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 font-mono text-xs text-zinc-200">
          <span className="text-zinc-500 select-none">$ </span>npx eve-preflight
        </div>
        <p className="text-zinc-500 text-xs">
          Alternatively, install globally if preferred: <code className="text-zinc-300 font-mono">npm install -g eve-preflight</code>
        </p>
      </section>

      {/* Step 2 */}
      <section className="space-y-4 border-t border-zinc-900 pt-8">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-[#c28b5b]/10 border border-[#c28b5b]/30 text-[#c28b5b] flex items-center justify-center font-mono text-xs font-bold">
            2
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            The Two-Terminal Workflow
          </h2>
        </div>
        <p className="text-zinc-400 text-sm">
          Because Eve's Nitro server serves on port <code className="text-zinc-200 font-mono text-xs">3000</code>, eve-preflight sits in front on port <code className="text-zinc-200 font-mono text-xs">3001</code>:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-950 font-mono text-xs space-y-2">
            <div className="text-zinc-400 font-semibold flex items-center gap-1.5 pb-1 border-b border-zinc-800">
              <Terminal className="w-3.5 h-3.5 text-zinc-400" /> Terminal 1 (Eve Agent)
            </div>
            <p className="text-zinc-500 text-[11px] font-sans">Start your agent dev server:</p>
            <div className="bg-black/70 p-2.5 rounded border border-zinc-900 text-zinc-200">
              <span className="text-zinc-500 select-none">$ </span>npx eve dev
            </div>
            <div className="text-[#c28b5b] text-[11px] pt-1">
              ✓ Ready on http://localhost:3000
            </div>
          </div>

          <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-950 font-mono text-xs space-y-2">
            <div className="text-zinc-400 font-semibold flex items-center gap-1.5 pb-1 border-b border-zinc-800">
              <Terminal className="w-3.5 h-3.5 text-[#c28b5b]" /> Terminal 2 (Preflight Proxy)
            </div>
            <p className="text-zinc-500 text-[11px] font-sans">Start preflight inspector:</p>
            <div className="bg-black/70 p-2.5 rounded border border-zinc-900 text-zinc-200">
              <span className="text-zinc-500 select-none">$ </span>npx eve-preflight
            </div>
            <div className="text-[#c28b5b] text-[11px] pt-1">
              ✓ Proxying http://localhost:3001 → :3000
            </div>
          </div>
        </div>
      </section>

      {/* Step 3 */}
      <section className="space-y-4 border-t border-zinc-900 pt-8">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-[#c28b5b]/10 border border-[#c28b5b]/30 text-[#c28b5b] flex items-center justify-center font-mono text-xs font-bold">
            3
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            First Successful Run
          </h2>
        </div>
        <p className="text-zinc-400 text-sm">
          On startup, preflight queries <code className="text-zinc-200 font-mono text-xs">eve info --json</code>, prints your discovered channels, and starts logging requests:
        </p>

        <div className="p-4 rounded-lg border border-zinc-800 bg-black font-mono text-xs space-y-2 overflow-x-auto text-zinc-300">
          <div className="text-[#c28b5b] font-semibold">[eve-preflight] Preflight Proxy started</div>
          <div className="text-zinc-400">  Listening on : http://localhost:3001</div>
          <div className="text-zinc-400">  Forwarding to: http://localhost:3000</div>
          <div className="text-zinc-500 pt-1">Registered Eve Channels:</div>
          <div className="text-zinc-300">  - POST /api/channels/web</div>
          <div className="text-zinc-300">  - POST /api/channels/slack</div>
          <div className="pt-2 text-zinc-400">
            Send incoming webhooks or connectors to <span className="text-[#e0a96d] font-semibold">http://localhost:3001</span> to audit delivery.
          </div>
        </div>
      </section>

      {/* Next link */}
      <div className="border-t border-zinc-900 pt-6 flex justify-end">
        <Link
          href="/docs/cli-reference"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#c28b5b] hover:text-[#e0a96d] transition-colors"
        >
          CLI Reference <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
