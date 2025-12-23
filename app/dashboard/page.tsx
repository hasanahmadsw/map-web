import { DashboardHome } from '@/components/dashboard/home/dashboard-home';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function Page() {
  return (
    <section className="pb-8">
      <DashboardHome />
    </section>
  );
}
