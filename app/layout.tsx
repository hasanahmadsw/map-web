import type { Metadata } from 'next';
import { Mona_Sans } from 'next/font/google';
import '@/app/globals.css';
import { Toaster } from 'sonner';
import QueryProvider from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import NextTopLoader from 'nextjs-toploader';

export const monaSans = Mona_Sans({
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-en',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MAP',
  description: 'Discover and connect with journalists from around the world',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en" className={monaSans.variable} suppressHydrationWarning>
      <body className={`${monaSans.className} antialiased`}>
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
