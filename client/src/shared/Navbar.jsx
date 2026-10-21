import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/image2.png";
import { useAuth } from "../hooks/useAuth";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Dashboard", to: "/Dashboard" },
  { label: "Projects", to: "/Projects" },
  { label: "Compiler", to: "/Compiler" },
];

const Navbar = () => {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#faf9ff]/90 backdrop-blur-md border-b border-[#ede8ff]">
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
        {/* ── LOGO ── */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <img src={logo} alt="" className="w-7 h-7" />
          <span className="font-bold text-[18px] tracking-[-0.4px] text-[#1a1333]">
            IDEas
          </span>
        </Link>

        {/* ── NAV LINKS (desktop) ── */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, to }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`px-4 py-1.5 rounded-lg text-[14px] font-medium no-underline transition-colors duration-150
                  ${
                    active
                      ? "bg-[#ede8ff] text-[#6d28d9]"
                      : "text-[#6b5f8a] hover:bg-[#f3f0ff] hover:text-[#1a1333]"
                  }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* ── AUTH BUTTONS (desktop) ── */}
        {loading ? (
          <div className="w-24 h-8 rounded-full bg-gray-200 animate-pulse" />
        ) : user ? (
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#f5f3ff] border border-[#ddd6fe]">
            <div className="w-7 h-7 rounded-full bg-[#7c3aed] text-white font-bold text-xs flex items-center justify-center uppercase shadow-sm">
              {user.username ? user.username.charAt(0) : "U"}
            </div>
            <span className="text-sm font-semibold text-[#5b21b6] pr-1">
              {user.username}
            </span>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-lg text-[13px] font-semibold text-[#6d28d9] border border-[#c4b5fd] bg-transparent no-underline hover:bg-[#ede8ff] transition-colors duration-150"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="px-4 py-1.5 rounded-lg text-[13px] font-bold text-white bg-[#7c3aed] no-underline hover:opacity-90 transition-opacity duration-150"
            >
              Sign up free →
            </Link>
          </div>
        )}

        {/* ── HAMBURGER (mobile) ── */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-[#ede8ff] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-[#6b5f8a] transition-transform duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-[#6b5f8a] transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-[#6b5f8a] transition-transform duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* ── MOBILE MENU ── */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#ede8ff] bg-[#faf9ff] px-6 py-4 flex flex-col gap-1">
          {NAV_LINKS.map(({ label, to }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-2 rounded-lg text-[14px] font-medium no-underline transition-colors
                  ${
                    active
                      ? "bg-[#ede8ff] text-[#6d28d9]"
                      : "text-[#6b5f8a] hover:bg-[#f3f0ff] hover:text-[#1a1333]"
                  }`}
              >
                {label}
              </Link>
            );
          })}
          <div className="flex gap-2 mt-3 pt-3 border-t border-[#ede8ff]">
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="flex-1 text-center px-4 py-2 rounded-lg text-[13px] font-semibold text-[#6d28d9] border border-[#c4b5fd] no-underline hover:bg-[#ede8ff] transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              onClick={() => setMenuOpen(false)}
              className="flex-1 text-center px-4 py-2 rounded-lg text-[13px] font-bold text-white bg-[#7c3aed] no-underline hover:opacity-90 transition-opacity"
            >
              Sign up free
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
