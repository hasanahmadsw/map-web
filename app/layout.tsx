import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/app/globals.css';
import { Toaster } from 'sonner';
import QueryProvider from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import NextTopLoader from 'nextjs-toploader';

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

            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
