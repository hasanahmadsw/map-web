import Header from '@/components/layout/header/header';
import Footer from '@/components/layout/footer/footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MAP Media Art Production',
  description:
    'MAP Media Art Production is a leading media production company in the UAE, delivering creative video, film, and digital content across the Middle East.',
};

export default async function PublicPagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="bg-background min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
