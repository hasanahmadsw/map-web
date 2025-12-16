import { Card, CardContent } from '@/components/ui/card';

import { Settings } from 'lucide-react';

import { settingsService } from '@/services/settings.service';

import EditSettingsForm from '@/components/dashboard/settings/edit-settings-form';

export default async function SettingsPage() {
  const { data: settings } = await settingsService.getSettings();

  if (!settings) {
    return (
      <div className="space-y-6 p-4">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Settings Management</h1>
          <p className="text-muted-foreground">Manage your settings and their translations.</p>
        </header>
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Settings className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-medium">Failed to load settings</h3>
              <p className="text-muted-foreground">Failed to load settings</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Settings Management</h1>
        <p className="text-muted-foreground">Manage your settings and their translations.</p>
      </header>

      <EditSettingsForm settings={settings} />
    </div>
  );
}
