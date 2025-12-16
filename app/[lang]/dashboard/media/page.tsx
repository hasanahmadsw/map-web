import { MediaGallery } from '@/components/dashboard/media';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Media',
};

export default async function MediaPage() {
  return (
    <div className="space-y-6 p-4">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Media Management</h1>
        <p className="text-muted-foreground">Manage and organize your media files</p>
      </header>

      <MediaGallery />
    </div>
  );
}
