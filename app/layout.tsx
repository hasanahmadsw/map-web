import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/app/globals.css';
import { cookies } from 'next/headers';
import { Toaster } from 'sonner';
import { ConditionalNavbar } from '@/components/layout/nav/conditional-navbar';
import { ConditionalFooter } from '@/components/layout/conditional-footer';
import QueryProvider from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import NextTopLoader from 'nextjs-toploader';

import { myCookies, readCookieFromCookies } from '@/utils/cookies';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Reporters Directory',
  description: 'Discover and connect with journalists from around the world',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: Readonly<RootLayoutProps>) {
  const authToken = await readCookieFromCookies(myCookies.auth, await cookies());
  const isAuthenticated = !!authToken;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <NextTopLoader color="var(--color-primary)" showSpinner={false} />
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  fontSize: '0.875rem',
                  textAlign: 'start',
                },
                className: `antialiased`,
              }}
            />

            <ConditionalNavbar isAuthenticated={isAuthenticated} />
            {children}
            <ConditionalFooter />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
