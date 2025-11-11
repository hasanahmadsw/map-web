import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { cookies } from "next/headers";
import { Toaster } from "sonner";
import { ConditionalNavbar } from "@/components/layout/nav/conditional-navbar";
import { ConditionalFooter } from "@/components/layout/conditional-footer";
import QueryProvider from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { TranslationsProvider } from "@/providers/translations-provider";
import { myCookies, readCookieFromCookies } from "@/utils/cookies";
import { getDirection, getTranslations, sanitizeLang, type Lang } from "@/utils/dictionary-utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reporters Directory",
  description: "Discover and connect with journalists from around the world",
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function RootLayout({ params, children }: Readonly<RootLayoutProps>) {
  const { lang: rawLang } = await params;
  const lang = sanitizeLang(rawLang);
  const translations = await getTranslations(lang);
  const authToken = await readCookieFromCookies(myCookies.auth, await cookies());
  const isAuthenticated = !!authToken;
  return (
    <html lang={lang} dir={getDirection(lang)} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryProvider>
          <TranslationsProvider translations={translations} currentLang={lang}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    fontSize: "0.875rem",
                    textAlign: "start",
                  },
                  className: `antialiased`,
                }}
              />
              <ConditionalNavbar isAuthenticated={isAuthenticated} />
              {children}
              <ConditionalFooter />
            </ThemeProvider>
          </TranslationsProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
