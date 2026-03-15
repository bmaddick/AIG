"use client";

import { useState } from "react";
import Image from "next/image";

const topics = ["Bible", "Culture", "God", "Creation", "Science"];

export default function HeroBanner() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="relative w-full overflow-hidden">
      {/* Giant's Causeway background image */}
      <Image
        src="https://images.unsplash.com/photo-1530473744149-142a02a2d565?w=1920&q=80&fit=crop"
        alt="Basalt rock columns"
        fill
        className="object-cover"
        priority
      />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative flex flex-col items-center justify-center text-center px-4 py-16 lg:py-24">
        {/* Main Heading */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-wide mb-8 uppercase">
          Biblical &amp; Scientific Answers
        </h1>

        {/* Search Bar */}
        <div className="w-full max-w-xl mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search answers..."
              className="w-full px-5 py-3 pr-12 rounded-sm bg-white text-gray-800 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-aig-cyan"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-aig-teal transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Topic Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {topics.map((topic) => (
            <a
              key={topic}
              href="#"
              className="text-white text-sm font-medium uppercase tracking-wider hover:text-aig-cyan transition-colors"
            >
              {topic}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
