"use client";
import { useState, useEffect } from "react";
import { ProfileData, LinkItem, SocialLink } from "@/types";
import { loadProfile, saveProfile } from "@/lib/data";

type Tab = "links" | "profile" | "analytics";

const PLATFORMS = ["github", "twitter", "linkedin", "instagram", "youtube"] as const;

const EMOJI_OPTIONS = ["🌐", "💻", "📄", "✉️", "🎨", "🚀", "📱", "🎯", "💡", "🔗", "📊", "🎓", "🏆", "💼"];

export default function AdminDashboard() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [tab, setTab] = useState<Tab>("links");
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [showAddLink, setShowAddLink] = useState(false);
  const [saved, setSaved] = useState(false);

  const [newLink, setNewLink] = useState<Omit<LinkItem, "id" | "clicks">>({
    title: "", url: "", icon: "🔗", active: true,
  });

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  if (!profile) return null;

  const handleSave = (updated: ProfileData) => {
    setProfile(updated);
    saveProfile(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addLink = () => {
    if (!newLink.title || !newLink.url) return;
    const updated = {
      ...profile,
      links: [...profile.links, { ...newLink, id: Date.now().toString(), clicks: 0 }],
    };
    handleSave(updated);
    setNewLink({ title: "", url: "", icon: "🔗", active: true });
    setShowAddLink(false);
  };

  const deleteLink = (id: string) => {
    handleSave({ ...profile, links: profile.links.filter((l) => l.id !== id) });
  };

  const toggleActive = (id: string) => {
    handleSave({
      ...profile,
      links: profile.links.map((l) => l.id === id ? { ...l, active: !l.active } : l),
    });
  };

  const saveEditedLink = () => {
    if (!editingLink) return;
    handleSave({
      ...profile,
      links: profile.links.map((l) => l.id === editingLink.id ? editingLink : l),
    });
    setEditingLink(null);
  };

  const moveLink = (id: string, dir: "up" | "down") => {
    const idx = profile.links.findIndex((l) => l.id === id);
    if ((dir === "up" && idx === 0) || (dir === "down" && idx === profile.links.length - 1)) return;
    const links = [...profile.links];
    const swap = dir === "up" ? idx - 1 : idx + 1;
    [links[idx], links[swap]] = [links[swap], links[idx]];
    handleSave({ ...profile, links });
  };

  const totalClicks = profile.links.reduce((s, l) => s + l.clicks, 0);

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#D4581A]/60 focus:bg-[#D4581A]/5 transition-all";

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Header */}
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">LinkBio <span className="text-[#D4581A]">Admin</span></h1>
          <p className="text-white/30 text-xs mt-0.5">Manage your profile & links</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-xs text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20 animate-pulse">
              ✓ Saved
            </span>
          )}
        </div>
      </header>

      {/* Stats bar */}
      <div className="border-b border-white/5 px-6 py-4 grid grid-cols-3 gap-4">
        {[
          { label: "Total Links", value: profile.links.length },
          { label: "Active", value: profile.links.filter((l) => l.active).length },
          { label: "Total Clicks", value: totalClicks },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-2xl font-bold text-[#D4581A]">{s.value}</p>
            <p className="text-white/30 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 px-6">
        {(["links", "profile", "analytics"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-all ${
              tab === t
                ? "border-[#D4581A] text-[#D4581A]"
                : "border-transparent text-white/40 hover:text-white/70"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="p-6 max-w-2xl mx-auto">

        {/* LINKS TAB */}
        {tab === "links" && (
          <div className="space-y-4">
            {/* Add link */}
            {!showAddLink ? (
              <button
                onClick={() => setShowAddLink(true)}
                className="w-full py-3 border border-dashed border-white/20 rounded-2xl text-white/40 text-sm hover:border-[#D4581A]/50 hover:text-[#D4581A] transition-all"
              >
                + Add New Link
              </button>
            ) : (
              <div className="bg-white/5 border border-[#D4581A]/30 rounded-2xl p-4 space-y-3">
                <p className="text-sm font-semibold text-[#D4581A]">New Link</p>
                <div className="grid grid-cols-2 gap-3">
                  <input className={inputClass} placeholder="Title" value={newLink.title} onChange={(e) => setNewLink({ ...newLink, title: e.target.value })} />
                  <input className={inputClass} placeholder="URL" value={newLink.url} onChange={(e) => setNewLink({ ...newLink, url: e.target.value })} />
                </div>
                <div>
                  <p className="text-xs text-white/30 mb-2">Icon</p>
                  <div className="flex flex-wrap gap-2">
                    {EMOJI_OPTIONS.map((e) => (
                      <button
                        key={e}
                        onClick={() => setNewLink({ ...newLink, icon: e })}
                        className={`w-9 h-9 rounded-xl text-lg transition-all ${newLink.icon === e ? "bg-[#D4581A]/30 ring-2 ring-[#D4581A]" : "bg-white/5 hover:bg-white/10"}`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={addLink} className="flex-1 py-2 bg-[#D4581A] text-white text-sm font-semibold rounded-xl hover:bg-[#b8461a] transition-colors">
                    Add Link
                  </button>
                  <button onClick={() => setShowAddLink(false)} className="px-4 py-2 bg-white/5 text-white/50 text-sm rounded-xl hover:bg-white/10 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Link list */}
            {profile.links.map((link, i) => (
              <div key={link.id}>
                {editingLink?.id === link.id ? (
                  <div className="bg-white/5 border border-[#D4581A]/30 rounded-2xl p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input className={inputClass} value={editingLink.title} onChange={(e) => setEditingLink({ ...editingLink, title: e.target.value })} />
                      <input className={inputClass} value={editingLink.url} onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {EMOJI_OPTIONS.map((e) => (
                        <button key={e} onClick={() => setEditingLink({ ...editingLink, icon: e })}
                          className={`w-9 h-9 rounded-xl text-lg transition-all ${editingLink.icon === e ? "bg-[#D4581A]/30 ring-2 ring-[#D4581A]" : "bg-white/5 hover:bg-white/10"}`}>
                          {e}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={saveEditedLink} className="flex-1 py-2 bg-[#D4581A] text-white text-sm font-semibold rounded-xl hover:bg-[#b8461a] transition-colors">Save</button>
                      <button onClick={() => setEditingLink(null)} className="px-4 py-2 bg-white/5 text-white/50 text-sm rounded-xl hover:bg-white/10 transition-colors">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${link.active ? "bg-white/5 border-white/10" : "bg-white/[0.02] border-white/5 opacity-50"}`}>
                    <span className="text-xl w-8 text-center">{link.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{link.title}</p>
                      <p className="text-xs text-white/30 truncate">{link.url}</p>
                    </div>
                    <span className="text-xs text-white/30 shrink-0">{link.clicks} clicks</span>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => moveLink(link.id, "up")} disabled={i === 0} className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-20 transition-colors text-xs">↑</button>
                      <button onClick={() => moveLink(link.id, "down")} disabled={i === profile.links.length - 1} className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-20 transition-colors text-xs">↓</button>
                      <button onClick={() => toggleActive(link.id)} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors text-xs ${link.active ? "bg-emerald-400/20 text-emerald-400 hover:bg-red-400/20 hover:text-red-400" : "bg-white/5 text-white/30 hover:text-white"}`}>
                        {link.active ? "●" : "○"}
                      </button>
                      <button onClick={() => setEditingLink(link)} className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-[#D4581A] transition-colors text-xs">✎</button>
                      <button onClick={() => deleteLink(link.id)} className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-red-400 transition-colors text-xs">✕</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* PROFILE TAB */}
        {tab === "profile" && (
          <div className="space-y-5">
            <div className="space-y-3">
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest mb-1.5 block">Display Name</label>
                <input className={inputClass} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest mb-1.5 block">Username</label>
                <input className={inputClass} value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest mb-1.5 block">Bio</label>
                <textarea className={`${inputClass} resize-none`} rows={3} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest mb-1.5 block">Avatar Initials</label>
                <input className={inputClass} maxLength={2} value={profile.avatar} onChange={(e) => setProfile({ ...profile, avatar: e.target.value.toUpperCase() })} />
              </div>
            </div>

            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Social Links</p>
              <div className="space-y-2">
                {profile.socials.map((s) => (
                  <div key={s.id} className="flex items-center gap-3">
                    <span className="text-white/40 text-xs w-20 capitalize">{s.platform}</span>
                    <input className={`${inputClass} flex-1`} value={s.url} onChange={(e) => setProfile({
                      ...profile,
                      socials: profile.socials.map((x) => x.id === s.id ? { ...x, url: e.target.value } : x),
                    })} />
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => handleSave(profile)} className="w-full py-3 bg-[#D4581A] text-white font-semibold rounded-2xl hover:bg-[#b8461a] transition-colors">
              Save Profile
            </button>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {tab === "analytics" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-3xl font-bold text-[#D4581A]">{totalClicks}</p>
                <p className="text-white/40 text-xs mt-1">Total Clicks</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-3xl font-bold text-[#D4581A]">{profile.links.filter((l) => l.active).length}</p>
                <p className="text-white/40 text-xs mt-1">Active Links</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Click Distribution</p>
              {[...profile.links].sort((a, b) => b.clicks - a.clicks).map((link) => {
                const pct = totalClicks > 0 ? (link.clicks / totalClicks) * 100 : 0;
                return (
                  <div key={link.id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/60">{link.icon} {link.title}</span>
                      <span className="text-white/40">{link.clicks} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#D4581A] rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
