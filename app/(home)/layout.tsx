import TopBar from '@/components/layout/bar/top-bar';
import Footer from '@/components/layout/footer/footer';
import Header from '@/components/layout/header/header';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Media Production and Broadcasting Solutions',
  description:
    'Latest news, breaking stories, and in-depth analysis from around the world. Stay informed with our comprehensive coverage of politics, technology, business, and more.',
};

export default async function PublicPagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopBar />
      <Header />
      {children}
      <Footer />
    </>
  );
}
