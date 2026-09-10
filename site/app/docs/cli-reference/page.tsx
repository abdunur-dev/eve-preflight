import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";

export default function CliReferencePage() {
  return (
    <div className="space-y-10 font-sans">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-zinc-800 bg-zinc-900/80 text-[11px] font-mono text-zinc-400">
          <span className="text-[#c28b5b]">●</span> Reference
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          CLI Reference
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Comprehensive reference for all <code className="text-zinc-200 font-mono text-xs">eve-preflight</code> command-line flags and environment variables.
        </p>
      </div>

      {/* Usage Command */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white tracking-tight">Usage Syntax</h2>
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 font-mono text-xs text-zinc-200">
          <span className="text-zinc-500 select-none">$ </span>npx eve-preflight [options]
        </div>
      </section>

      {/* CLI Options Table */}
      <section className="space-y-4 border-t border-zinc-900 pt-8">
        <h2 className="text-lg font-bold text-white tracking-tight">Command Flags</h2>
        <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950/60">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400">
                <th className="py-3 px-4 font-semibold">Flag</th>
                <th className="py-3 px-4 font-semibold">Default</th>
                <th className="py-3 px-4 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              <tr>
                <td className="py-3 px-4 text-[#c28b5b] font-medium whitespace-nowrap">
                  -p, --port &lt;number&gt;
                </td>
                <td className="py-3 px-4 text-zinc-500 whitespace-nowrap">3001</td>
                <td className="py-3 px-4 text-zinc-400 font-sans">
                  Port on which the preflight reverse proxy will listen for inbound requests.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-[#c28b5b] font-medium whitespace-nowrap">
                  -t, --target &lt;number&gt;
                </td>
                <td className="py-3 px-4 text-zinc-500 whitespace-nowrap">3000</td>
                <td className="py-3 px-4 text-zinc-400 font-sans">
                  Target upstream port where your Eve dev server is running.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-[#c28b5b] font-medium whitespace-nowrap">
                  -h, --help
                </td>
                <td className="py-3 px-4 text-zinc-500 whitespace-nowrap">—</td>
                <td className="py-3 px-4 text-zinc-400 font-sans">
                  Display command help synopsis, flags, and exit.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-[#c28b5b] font-medium whitespace-nowrap">
                  -v, --version
                </td>
                <td className="py-3 px-4 text-zinc-500 whitespace-nowrap">—</td>
                <td className="py-3 px-4 text-zinc-400 font-sans">
                  Display the current version number and exit.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Environment Variables Table */}
      <section className="space-y-4 border-t border-zinc-900 pt-8">
        <h2 className="text-lg font-bold text-white tracking-tight">Environment Variables</h2>
        <p className="text-zinc-400 text-xs">
          Flags passed on the command line always take precedence over environment variables:
        </p>
        <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950/60">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400">
                <th className="py-3 px-4 font-semibold">Variable</th>
                <th className="py-3 px-4 font-semibold">Default</th>
                <th className="py-3 px-4 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              <tr>
                <td className="py-3 px-4 text-[#c28b5b] font-medium whitespace-nowrap">
                  PREFLIGHT_PORT
                </td>
                <td className="py-3 px-4 text-zinc-500 whitespace-nowrap">3001</td>
                <td className="py-3 px-4 text-zinc-400 font-sans">
                  Custom port for the preflight listening server. Equivalent to <code className="text-zinc-300 font-mono">-p</code>.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-[#c28b5b] font-medium whitespace-nowrap">
                  EVE_PORT
                </td>
                <td className="py-3 px-4 text-zinc-500 whitespace-nowrap">3000</td>
                <td className="py-3 px-4 text-zinc-400 font-sans">
                  Custom upstream port for the Eve dev server. Equivalent to <code className="text-zinc-300 font-mono">-t</code>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Example command */}
      <section className="space-y-3 border-t border-zinc-900 pt-8">
        <h2 className="text-lg font-bold text-white tracking-tight">Example Usage</h2>
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 font-mono text-xs text-zinc-300 space-y-2">
          <div className="text-zinc-500"># Specify custom proxy and upstream ports:</div>
          <div><span className="text-zinc-500 select-none">$ </span>npx eve-preflight -p 8080 -t 3000</div>
          <div className="text-zinc-500 pt-1"># Or via environment variables:</div>
          <div><span className="text-zinc-500 select-none">$ </span>PREFLIGHT_PORT=8080 npx eve-preflight</div>
        </div>
      </section>

      {/* Next link */}
      <div className="border-t border-zinc-900 pt-6 flex justify-between">
        <Link
          href="/docs/getting-started"
          className="text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          ← Getting Started
        </Link>
        <Link
          href="/docs/how-it-works"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#c28b5b] hover:text-[#e0a96d] transition-colors"
        >
          How It Works <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
