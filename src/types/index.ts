export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon: string;
  active: boolean;
  clicks: number;
}

export interface ProfileData {
  name: string;
  username: string;
  bio: string;
  avatar: string;
  links: LinkItem[];
  socials: SocialLink[];
}

export interface SocialLink {
  id: string;
  platform: "twitter" | "github" | "linkedin" | "instagram" | "youtube";
  url: string;
}
