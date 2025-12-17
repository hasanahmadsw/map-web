import ProfileInfo from '@/components/dashboard/profile/form/profile-info';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
};

export default async function ProfilePage() {
  return (
    <div className="space-y-6 p-4">
      <header>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-2">Staff Management Description</p>
      </header>

      <ProfileInfo />
    </div>
  );
}
