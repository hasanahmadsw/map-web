
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Edit, Trash2, Mail, Phone, Globe, Facebook, Twitter, Linkedin, Instagram, Link } from "lucide-react";

import { Lang, getTranslations } from "@/utils/dictionary-utils";
import { settingsService } from "@/services/settings.service";
import { SettingsGeneral } from "@/components/settings/settings-general";

function getSocialIcon(platform: string) {
  switch (platform.toLowerCase()) {
    case "facebook":
      return Facebook;
    case "twitter":
      return Twitter;
    case "linkedin":
      return Linkedin;
    case "instagram":
      return Instagram;
    default:
      return Globe;
  }
}

export default async function SettingsPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const t = await getTranslations(lang as Lang);
  const settingsT = t.settings || {};
const {data : settings} = await settingsService.getSettings({ lang });
console.log(settings)

  if (!settings) {
    return (
      <div className="space-y-6 p-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {settingsT.settingsManagement}
          </h1>
          <p className="text-muted-foreground">
            {settingsT.settingsManagementDescription}
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {t.settings?.failedToLoadSettings }
              </h3>
              <p className="text-muted-foreground">
                {settingsT.failedToLoadSettings }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {settingsT.settingsManagement}
        </h1>
        <p className="text-muted-foreground">
          {settingsT.settingsManagementDescription}
        </p>
      </div>

    <SettingsGeneral settings={settings} />
    </div>
  );
}