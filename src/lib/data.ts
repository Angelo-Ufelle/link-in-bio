import { ProfileData } from "@/types";

export const DEFAULT_PROFILE: ProfileData = {
  name: "Onyedika Azubuike-Ufelle",
  username: "@onyedika_dev",
  bio: "Frontend Developer · Building things with Next.js, TypeScript & Tailwind. Open to opportunities.",
  avatar: "OA",
  socials: [
    { id: "1", platform: "github", url: "https://github.com" },
    { id: "2", platform: "twitter", url: "https://twitter.com" },
    { id: "3", platform: "linkedin", url: "https://linkedin.com" },
  ],
  links: [
    {
      id: "1",
      title: "Portfolio Website",
      url: "https://onyedika.dev",
      icon: "🌐",
      active: true,
      clicks: 142,
    },
    {
      id: "2",
      title: "Job Tracker App",
      url: "https://jobtrack.vercel.app",
      icon: "🗂️",
      active: true,
      clicks: 89,
    },
    {
      id: "3",
      title: "GitHub Projects",
      url: "https://github.com/onyedika",
      icon: "💻",
      active: true,
      clicks: 203,
    },
    {
      id: "4",
      title: "Resume / CV",
      url: "https://onyedika.dev/resume.pdf",
      icon: "📄",
      active: true,
      clicks: 67,
    },
    {
      id: "5",
      title: "Hire Me",
      url: "mailto:onyedika@email.com",
      icon: "✉️",
      active: false,
      clicks: 31,
    },
  ],
};

export function loadProfile(): ProfileData {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  const stored = localStorage.getItem("link-in-bio-profile");
  return stored ? JSON.parse(stored) : DEFAULT_PROFILE;
}

export function saveProfile(data: ProfileData): void {
  localStorage.setItem("link-in-bio-profile", JSON.stringify(data));
}
