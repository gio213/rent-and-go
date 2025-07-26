import React from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Github, Mail, Linkedin, Heart } from "lucide-react";
import { footerLinks, socialLinks } from "@/constants/footerLinks";
import Link from "next/link";
import Logo from "./Logo";
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t mt-auto supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <Logo width={200} height={200} />

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium font-finger">Quick Links</h4>
            <div className="flex flex-col space-y-2">
              {footerLinks.map((link) => (
                <Button
                  key={link.href}
                  variant="ghost"
                  size="sm"
                  className="justify-start px-0 h-auto font-normal text-sm opacity-70 hover:opacity-100 font-finger"
                  asChild
                >
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium font-finger">Connect</h4>
            <div className="flex gap-2">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <Button
                    key={social.href}
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    asChild
                  >
                    <a
                      href={social.href}
                      aria-label={social.label}
                      target={social.external ? "_blank" : undefined}
                      rel={social.external ? "noopener noreferrer" : undefined}
                    >
                      <IconComponent className="h-4 w-4" />
                    </a>
                  </Button>
                );
              })}
            </div>
            <p className="text-xs opacity-60 font-finger">
              Let's build something amazing together
            </p>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm opacity-70 font-finger">
            <span>
              &copy; {currentYear} Giorgi Patsia. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs opacity-60 font-finger">
            <span>Made with</span>
            <Heart className="h-3 w-3 fill-current" />
            <span>and React</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
