import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Montserrat } from "next/font/google";
import { ThemeProvider } from "@/providers/themeProvide";
import Header from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";
import PageWrapper from "@/components/PageWrapper";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages } from "next-intl/server";
import { AuthProvider } from "@/context/authContext";
import SearchProvider from "@/context/search-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: "500",
});
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: "500",
});

export const metadata: Metadata = {
  title: "Rent & Go",
  description: "Car rental service",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Load messages for the current locale
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${montserrat.variable} antialiased font-montserrat`}
      >
        <SearchProvider>
          <ThemeProvider
            defaultTheme="system"
            attribute={"class"}
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider messages={messages}>
              <AuthProvider>
                <Header />
                <SmoothScroll />
                <PageWrapper className="min-h-screen w-full">
                  {children}
                  <Toaster />
                </PageWrapper>

                <Footer />
              </AuthProvider>
            </NextIntlClientProvider>
          </ThemeProvider>
        </SearchProvider>
        <Analytics />
      </body>
    </html>
  );
}
