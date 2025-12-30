import TopBar from '@/components/layout/bar/top-bar';
import Footer from '@/components/layout/footer/footer';
import Header from '@/components/layout/header/header';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Media Production Company in UAE | MAP Media Art Production',
  description:
    'MAP Media Art Production is a leading media production company in the UAE, delivering creative video, film, and digital content across the Middle East.',
};

export default async function PublicPagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopBar />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
