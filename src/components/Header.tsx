"use client";

import { useState } from "react";

const primaryNav = [
  { label: "Answers", href: "#" },
  { label: "Store", href: "#" },
  { label: "Events", href: "#" },
  { label: "Videos", href: "#" },
  { label: "Kids", href: "#" },
  { label: "Education", href: "#" },
  { label: "Donate", href: "#" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="w-full">
      {/* Utility Bar */}
      <div className="bg-white border-b border-gray-200 text-gray-500 text-sm">
        <div className="mx-auto max-w-7xl flex items-center justify-end px-4 py-1">
          <div className="flex items-center gap-4 text-xs">
            <a href="#" className="hover:text-gray-700 transition-colors">Account</a>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
              United States / English
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            {/* AiG Logo: light blue "1:1" box + wordmark */}
            <div className="flex items-center gap-2">
              <div className="bg-[#5ba4c9] text-white font-bold text-lg px-2 py-0.5 rounded-sm leading-tight">
                1:1
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[#2d2d2d] text-lg font-bold tracking-tight leading-none">
                  ANSWERS
                </span>
                <span className="text-[#2d2d2d] text-[9px] tracking-[0.15em] uppercase leading-none">
                  in Genesis
                </span>
              </div>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {primaryNav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  item.label === "Donate"
                    ? "bg-aig-gold text-white px-4 py-1.5 rounded font-bold hover:bg-yellow-500"
                    : "text-[#2d2d2d] hover:text-aig-teal"
                }`}
              >
                {item.label}
              </a>
            ))}
            {/* Search */}
            <button className="text-[#2d2d2d] hover:text-aig-teal transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-[#2d2d2d]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-200 px-4 py-4 space-y-3 bg-white">
            {primaryNav.map((item) => (
              <a key={item.label} href={item.href} className="block text-sm py-1 text-[#2d2d2d] hover:text-aig-teal">
                {item.label}
              </a>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
