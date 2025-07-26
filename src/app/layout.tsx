import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/themeProvide";
import Header from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";
import PageWrapper from "@/components/PageWrapper";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rent & Go",
  description: "Car rental service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable}  antialiased`}
      >
        <ThemeProvider
          defaultTheme="system"
          attribute={"class"}
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <SmoothScroll />
          <PageWrapper className="min-h-screen w-full">
            {children} <Toaster />
          </PageWrapper>
          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
