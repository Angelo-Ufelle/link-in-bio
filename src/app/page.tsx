"use client";
import { useState, useEffect } from "react";
import AdminDashboard from "@/components/AdminDashboard";
import PublicProfile from "@/components/PublicProfile";

export default function Home() {
  const [view, setView] = useState<"public" | "admin">("public");
  return (
    <main className="min-h-screen bg-[#0f0f0f] font-sans">
      {/* Dev toggle */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setView("public")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
            view === "public"
              ? "bg-[#D4581A] text-white border-[#D4581A]"
              : "bg-transparent text-white/40 border-white/20 hover:border-white/40"
          }`}
        >
          Public
        </button>
        <button
          onClick={() => setView("admin")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
            view === "admin"
              ? "bg-[#D4581A] text-white border-[#D4581A]"
              : "bg-transparent text-white/40 border-white/20 hover:border-white/40"
          }`}
        >
          Admin
        </button>
      </div>
      {view === "public" ? <PublicProfile /> : <AdminDashboard />}
    </main>
  );
}
