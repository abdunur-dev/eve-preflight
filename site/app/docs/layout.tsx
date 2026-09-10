"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Terminal,
  BookOpen,
  PlayCircle,
  Code2,
  Cpu,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  Home,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/docs", label: "Overview", icon: BookOpen },
  { href: "/docs/getting-started", label: "Getting Started", icon: PlayCircle },
  { href: "/docs/cli-reference", label: "CLI Reference", icon: Code2 },
  { href: "/docs/how-it-works", label: "How It Works", icon: Cpu },
  { href: "/docs/troubleshooting", label: "Troubleshooting", icon: AlertCircle },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-black text-zinc-100 flex flex-col selection:bg-zinc-800 selection:text-white font-mono overflow-x-hidden">
      {/* Background subtle grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-25 z-0" />

      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/90 backdrop-blur-md px-4 sm:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="w-2 h-2 rounded-full bg-[#c28b5b] shrink-0" />
            <span className="font-bold text-xs sm:text-sm tracking-tight text-white whitespace-nowrap">
              eve-preflight
            </span>
          </Link>
          <span className="text-zinc-600 font-mono text-xs">/</span>
          <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded border border-[#c28b5b]/40 bg-[#c28b5b]/10 text-[#e0a96d] font-medium whitespace-nowrap">
            Docs
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 text-xs">
          <Link
            href="/"
            className="text-zinc-400 hover:text-white transition-colors hidden sm:flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <a
            href="https://github.com/abdunur-dev/eve-preflight"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white transition-colors hidden sm:flex items-center gap-1"
          >
            GitHub <ExternalLink className="w-3 h-3" />
          </a>
          
          {/* Mobile menu toggle button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded border border-white/10 text-zinc-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Docs Shell */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        {/* Left Sidebar (Desktop & Collapsible Mobile Drawer) */}
        <aside
          className={`
            ${mobileMenuOpen ? "block" : "hidden"} 
            md:block md:w-60 lg:w-64 shrink-0 border-b md:border-b-0 md:border-r border-white/10 
            bg-black/95 md:bg-transparent backdrop-blur-lg md:backdrop-blur-none 
            p-4 sm:p-6 space-y-6 md:sticky md:top-14 md:h-[calc(100vh-3.5rem)] md:overflow-y-auto
          `}
        >
          <div className="space-y-1">
            <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold px-2 mb-2">
              Documentation
            </div>
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-md text-xs transition-colors ${
                      isActive
                        ? "bg-[#c28b5b]/15 text-[#e0a96d] font-semibold border border-[#c28b5b]/30"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-[#e0a96d]" : "text-zinc-500"}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3 h-3 text-[#e0a96d] shrink-0" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="space-y-1 border-t border-white/10 pt-5">
            <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold px-2 mb-2">
              External &amp; Releases
            </div>
            <a
              href="https://github.com/abdunur-dev/eve-preflight/blob/main/CHANGELOG.md"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-md text-xs text-zinc-400 hover:text-white hover:bg-zinc-900/60 transition-colors"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Terminal className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span className="truncate">Changelog</span>
              </div>
              <ExternalLink className="w-3 h-3 text-zinc-600 shrink-0" />
            </a>
            <a
              href="https://github.com/abdunur-dev/eve-preflight"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-md text-xs text-zinc-400 hover:text-white hover:bg-zinc-900/60 transition-colors"
            >
              <div className="flex items-center gap-2.5 truncate">
                <ExternalLink className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span className="truncate">GitHub Repository</span>
              </div>
              <ExternalLink className="w-3 h-3 text-zinc-600 shrink-0" />
            </a>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-8 sm:py-10 max-w-4xl">
          {children}
        </main>
      </div>

      {/* Simple Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black px-4 sm:px-8 py-6 text-xs text-zinc-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[11px] sm:text-xs">
          <span>eve-preflight docs • MIT License</span>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
            <Link href="/docs/getting-started" className="hover:text-zinc-300 transition-colors">Getting Started</Link>
            <a
              href="https://github.com/abdunur-dev/eve-preflight"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-300 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}