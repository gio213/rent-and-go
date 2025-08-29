import React from "react";
import { Heart } from "lucide-react";
import { socialLinks, footerLinks } from "@/constants/footerLinks";
import Link from "next/link";
import Logo from "./Logo";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        {/* Main Content */}
        <div className="flex flex-col items-center space-y-6">
          {/* Logo */}
          <Logo width={140} height={70} />

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {footerLinks.slice(0, 5).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <Link
                  key={social.href}
                  href={social.href}
                  aria-label={social.label}
                  target={social.external ? "_blank" : undefined}
                  rel={social.external ? "noopener noreferrer" : undefined}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <IconComponent className="h-5 w-5" />
                </Link>
              );
            })}
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>&copy; {currentYear} Giorgi Patsia</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <span>Made with</span>
              <Heart className="h-3 w-3 fill-current text-red-500" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
