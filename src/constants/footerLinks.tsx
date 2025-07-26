import { Github, Linkedin, Mail } from "lucide-react";

export type FooterLink = {
  href: string;
  label: string;
};

export type SocialLink = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  external?: boolean;
};

export const footerLinks: FooterLink[] = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/about",
    label: "About Us",
  },
  {
    href: "/cars",
    label: "Cars",
  },
  {
    href: "/book",
    label: "Book Now",
  },
  {
    href: "/faq",
    label: "FAQ",
  },
  {
    href: "/contact",
    label: "Contact",
  },
  {
    href: "/terms-of-service",
    label: "Terms of Service",
  },
  {
    href: "/privacy-policy",
    label: "Privacy Policy",
  },
];

export const socialLinks: SocialLink[] = [
  {
    href: "https://github.com/yourusername",
    label: "GitHub",
    icon: Github,
    external: true,
  },
  {
    href: "mailto:youremail@example.com",
    label: "Email",
    icon: Mail,
    external: true,
  },
  {
    href: "https://linkedin.com/in/yourusername",
    label: "LinkedIn",
    icon: Linkedin,
    external: true,
  },
];
