import { UpdateProfileForm } from '@/components/dashboard/profile/form/update-profile-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function EditProfilePage() {
  return (
    <div className="space-y-6 p-4">
      <header className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/profile">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
          <p className="text-muted-foreground">Edit your profile information</p>
        </div>
      </header>

      <UpdateProfileForm />
    </div>
  );
}
