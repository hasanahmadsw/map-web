import EditSettingsForm from "@/components/settings/edit-settings-form";
import { settingsService } from "@/services/settings.service";
import { Lang, getTranslations } from "@/utils/dictionary-utils";

export default async function EditSettingsPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
const  t  = await getTranslations(lang);
const data = await settingsService.getSettings({ lang });
const settings = data.data;

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-4">
      
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t.settings?.editSettings}
          </h1>
            <p className="text-muted-foreground">
              {t.settings?.editSettingsDescription }
          </p>
        </div>
      </div>

      <EditSettingsForm settings={settings} />
    </div>
  );
}