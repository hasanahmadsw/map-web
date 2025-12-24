import { Footer } from '@/components/layout/footer';
import { ConditionalNavbar } from '@/components/layout/nav/conditional-navbar';
import { myCookies, readCookieFromCookies } from '@/utils/cookies';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Media Production and Broadcasting Solutions',
  description:
    'Latest news, breaking stories, and in-depth analysis from around the world. Stay informed with our comprehensive coverage of politics, technology, business, and more.',
};

export default async function PublicPagesLayout({ children }: { children: React.ReactNode }) {
  const authToken = await readCookieFromCookies(myCookies.auth, await cookies());
  const isAuthenticated = !!authToken;

  return (
    <>
      <ConditionalNavbar isAuthenticated={isAuthenticated} />
      {children}
      <Footer />
    </>
  );
}
