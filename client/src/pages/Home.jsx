import { useState } from "react";
import logo from "../assets/image2.png";
import BgDecor from "../shared/BgDecor";

const FEATURES = [
  {
    icon: (
      <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        viewBox="0 0 24 24"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    title: "Write & run instantly",
    desc: "Full compiler support in the browser. No installs, no setup — just open and code.",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: "20+ languages",
    desc: "Python, C++, Java, JavaScript, Go, Rust and more — all in one place.",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        viewBox="0 0 24 24"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Live collaboration",
    desc: "Share a link, code together in real time. Perfect for pair programming and interviews.",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        viewBox="0 0 24 24"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: "Save & share",
    desc: "Every snippet is saved to your account. Share public links or keep them private.",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        viewBox="0 0 24 24"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
    title: "Split-pane editor",
    desc: "Code on the left, output on the right. Resize panes to fit how you think.",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
      </svg>
    ),
    title: "AI suggestions",
    desc: "Smart completions and inline hints that understand the language you're writing in.",
  },
];

const LANGS = [
  "Python",
  "C++",
  "Java",
  "JavaScript",
  "Go",
  "Rust",
  "TypeScript",
  "Ruby",
  "PHP",
  "Swift",
  "Kotlin",
  "C#",
];
const FOOTER_LINKS = ["Privacy", "Terms", "GitHub", "Support"];
const DOT_COLORS = ["bg-red-400", "bg-yellow-400", "bg-green-400"];

export default function Home() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("print('Hello, IDEas!')");
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="font-sans bg-[#faf9ff] text-[#1a1333] min-h-screen relative">
      {/* ── BG LOGO DECORATIONS (fixed, no scroll) ── */}
      {/* Logo 1 — top-left */}
      <BgDecor/>

      {/* ── HERO ── */}
      <section className="px-16 pt-24 pb-16 text-center max-w-6xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ede8ff] border border-[#c4b5fd] text-xs font-semibold text-[#6d28d9] mb-7 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] inline-block" />
          Online IDE + Compiler — no install needed
        </div>

        {/* Heading */}
        <h1 className="text-5xl font-extrabold leading-tight tracking-[-1.5px] mb-5 text-[#1a1333]">
          Code anywhere.{" "}
          <span className="bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] bg-clip-text text-transparent">
            Run instantly.
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-[17px] text-[#6b5f8a] leading-[1.75] max-w-xl mx-auto mb-9">
          IDEas is a browser-based IDE and compiler. Write, run, and share code
          in 20+ languages — from any device, with zero setup.
        </p>

        {/* CTAs */}
        <div className="flex gap-3 justify-center flex-wrap">
          <button className="px-7 py-3 rounded-xl bg-[#7c3aed] text-white text-[15px] font-bold cursor-pointer border-none hover:opacity-90 transition-opacity">
            Open the IDE
          </button>
          <button className="px-7 py-3 rounded-xl border border-[#c4b5fd] bg-transparent text-[#6d28d9] text-[15px] font-semibold cursor-pointer hover:bg-[#ede8ff] transition-colors">
            View languages
          </button>
        </div>

        {/* Code preview */}
        <div className="mt-12 bg-[#1a1333] rounded-2xl p-5 text-left border border-[#2d2060] relative">
          {/* Window dots */}
          <div className="flex gap-1.5 mb-3 items-center">
            {DOT_COLORS.map((c, i) => (
              <div key={i} className={`w-2.5 h-2.5 rounded-full ${c}`} />
            ))}
            <span className="text-xs text-[#6b5f8a] ml-auto font-mono">
              main.py
            </span>
          </div>

          {/* Code */}
          <pre className="m-0 text-sm leading-7 font-mono text-[#a78bfa]">
            <span className="text-[#f472b6]">def </span>
            <span className="text-[#67e8f9]">greet</span>
            <span className="text-[#e2e8f0]">(name):</span>
            {"\n"}
            <span className="text-[#e2e8f0]"> </span>
            <span className="text-[#f472b6]">return </span>
            <span className="text-[#86efac]">{`f"Hello, {name}! Welcome to IDEas."`}</span>
            {"\n"}
            {"\n"}
            <span className="text-[#e2e8f0]">print(greet(</span>
            <span className="text-[#86efac]">"world"</span>
            <span className="text-[#e2e8f0]">))</span>
          </pre>

          {/* Output */}
          <div className="mt-3 px-3 py-2 rounded-lg bg-[#0f0a24] text-sm font-mono text-[#34d399]">
            &gt; Hello, world! Welcome to IDEas.
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="absolute top-4 right-4 bg-[#2d2060] border border-[#4c3a8a] text-[#a78bfa] rounded-md px-2.5 py-1 text-[11px] font-semibold cursor-pointer hover:bg-[#3d2d80] transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </section>

      {/* ── LANGUAGES ── */}
      <section className="px-16 pb-12 text-center">
        <p className="text-xs font-semibold text-[#9d8cc4] tracking-[0.8px] uppercase mb-4">
          Supported languages
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {LANGS.map((l) => (
            <span
              key={l}
              className="px-4 py-1.5 rounded-full bg-[#ede8ff] text-[#5b21b6] text-[13px] font-medium border border-[#ddd6fe]"
            >
              {l}
            </span>
          ))}
          <span className="px-4 py-1.5 rounded-full bg-transparent text-[#9d8cc4] text-[13px] border border-dashed border-[#c4b5fd]">
            + more
          </span>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-16 py-16 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-[#9d8cc4] tracking-[0.8px] uppercase mb-2">
            What you get
          </p>
          <h2 className="text-3xl font-bold tracking-[-0.5px] mb-2">
            Built for real coding
          </h2>
          <p className="text-[15px] text-[#6b5f8a] max-w-md mx-auto">
            Every feature designed to get out of your way and let you focus on
            the code.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl border border-[#ede8ff] p-5 transition-all duration-150 hover:border-[#c4b5fd] hover:shadow-[0_4px_24px_#7c3aed12]"
            >
              <div className="w-10 h-10 rounded-xl bg-[#ede8ff] text-[#7c3aed] flex items-center justify-center mb-3">
                {f.icon}
              </div>
              <h3 className="text-[15px] font-bold mb-1.5">{f.title}</h3>
              <p className="text-[13px] text-[#6b5f8a] leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="px-16 pb-20 max-w-6xl mx-auto text-center">
        <div className="bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] rounded-3xl py-12 px-8">
          <h2 className="text-[28px] font-extrabold text-white mb-2.5 tracking-[-0.5px]">
            Start coding in seconds
          </h2>
          <p className="text-[15px] text-[#ddd6fe] mb-7">
            No account needed to try it. No installs. Just you and your code.
          </p>
          <button className="px-8 py-3 rounded-xl bg-white text-[#7c3aed] text-[15px] font-bold border-none cursor-pointer hover:opacity-90 transition-opacity">
            Open IDEas free →
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#ede8ff] px-16 py-6 flex items-center justify-between text-[13px] text-[#9d8cc4] flex-wrap gap-2">
        <div className="flex items-center gap-1">
          <img src={logo} alt="" className="w-[20px]" />
          <span className="font-semibold text-[#1a1333] text-sm">IDEas</span>
          <span>· Online IDE + Compiler</span>
        </div>

        <div className="flex gap-6">
          {FOOTER_LINKS.map((l) => (
            <a
              key={l}
              href="#"
              className="text-[#9d8cc4] no-underline hover:text-[#1a1333] transition-colors"
            >
              {l}
            </a>
          ))}
        </div>

        <span>© 2026 IDEas</span>
      </footer>
    </div>
  );
}
