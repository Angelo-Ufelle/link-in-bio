"use client";
import React, { useState, useEffect } from "react";
import { ProfileData, LinkItem } from "@/types";
import { loadProfile } from "@/lib/data";

const SOCIAL_ICONS: Record<string, React.ReactElement> = {
  github: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  ),
  twitter: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  linkedin: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  instagram: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  ),
  youtube: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
};

export default function PublicProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [clicked, setClicked] = useState<string | null>(null);

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  const handleClick = (link: LinkItem) => {
    setClicked(link.id);
    setTimeout(() => setClicked(null), 600);
  };

  if (!profile) return null;

  const activeLinks = profile.links.filter((l) => l.active);

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-start pt-16 pb-20 px-4">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4581A]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10 flex flex-col items-center gap-6 animate-[fadeUp_0.6s_ease_both]">
        {/* Avatar */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D4581A] to-[#ff8c4b] flex items-center justify-center text-white text-2xl font-bold tracking-tight shadow-lg shadow-[#D4581A]/30">
            {profile.avatar}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-[#0f0f0f]" />
        </div>

        {/* Name & bio */}
        <div className="text-center">
          <h1 className="text-white text-xl font-bold tracking-tight">{profile.name}</h1>
          <p className="text-[#D4581A] text-sm font-medium mt-0.5">{profile.username}</p>
          <p className="text-white/50 text-sm mt-2 leading-relaxed max-w-xs">{profile.bio}</p>
        </div>

        {/* Socials */}
        <div className="flex gap-3">
          {profile.socials.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/50 hover:text-[#D4581A] hover:border-[#D4581A]/40 hover:bg-[#D4581A]/10 transition-all duration-200"
            >
              {SOCIAL_ICONS[s.platform]}
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/5" />

        {/* Links */}
        <div className="w-full flex flex-col gap-3">
          {activeLinks.map((link, i) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleClick(link)}
              style={{ animationDelay: `${i * 80}ms` }}
              className={`group relative flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl border transition-all duration-200 animate-[fadeUp_0.5s_ease_both] ${
                clicked === link.id
                  ? "bg-[#D4581A] border-[#D4581A] scale-[0.98]"
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-[1.01]"
              }`}
            >
              <span className="text-xl w-8 text-center">{link.icon}</span>
              <span className={`flex-1 text-sm font-semibold tracking-wide transition-colors ${
                clicked === link.id ? "text-white" : "text-white/80 group-hover:text-white"
              }`}>
                {link.title}
              </span>
              <svg className={`w-4 h-4 transition-all duration-200 ${
                clicked === link.id ? "text-white translate-x-1" : "text-white/20 group-hover:text-white/60"
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ))}
        </div>

        {/* Footer */}
        <p className="text-white/20 text-xs mt-4 tracking-widest uppercase">made with linkbio</p>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
