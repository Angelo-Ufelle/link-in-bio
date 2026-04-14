import { ProfileData } from "@/types";

export const DEFAULT_PROFILE: ProfileData = {
  name: "Onyedika Azubuike-Ufelle",
  username: "@onyedika_dev",
  bio: "Frontend Developer · Building things with Next.js, TypeScript & Tailwind. Open to opportunities.",
  avatar: "OA",
  socials: [
    { id: "1", platform: "github", url: "https://github.com/Angelo-Ufelle" },
    { id: "2", platform: "twitter", url: "https://twitter.com" },
    { id: "3", platform: "linkedin", url: "https://linkedin.com" },
  ],
  links: [
    {
      id: "1",
      title: "Portfolio Website",
      url: "https://portfolio-delta-eight-vo8bsv5a5h.vercel.app/",
      icon: "🌐",
      active: true,
      clicks: 3,
    },
    {
      id: "2",
      title: "Calendar App",
      url: "https://calender-with-next.vercel.app/",
      icon: "🗂️",
      active: true,
      clicks: 9,
    },
    {
      id: "3",
      title: "GitHub Projects",
      url: "https://github.com/Angelo-Ufelle",
      icon: "💻",
      active: true,
      clicks: 22,
    },
    {
      id: "4",
      title: "Resume / CV",
      url: "https://docs.google.com/document/d/1CZqdSRc-6jwGbYcP1KpzU6FAJOIBaONA/edit?usp=drive_link&ouid=105116392772331475497&rtpof=true&sd=true",
      icon: "📄",
      active: true,
      clicks: 5,
    },
    {
      id: "5",
      title: "Hire Me",
      url: "onyedikaufelle@email.com",
      icon: "✉️",
      active: true,
      clicks: 3,
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
