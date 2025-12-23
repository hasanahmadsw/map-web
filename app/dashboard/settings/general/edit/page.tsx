import EditSettingsForm from '@/components/dashboard/settings/edit-settings-form';
import { settingsService } from '@/services/settings.service';

export default async function EditSettingsPage() {
  const data = await settingsService.getSettings();
  const settings = data.data;

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Settings</h1>
          <p className="text-muted-foreground">Edit the settings for the website</p>
        </div>
      </div>

      <EditSettingsForm settings={settings} />
    </div>
  );
}
