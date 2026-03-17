import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { DEFAULT_SETTINGS } from '@/constants/constant';
import { ApiResponse } from '@/types/common.types';
import { Settings } from '@/types/settings.types';
import { settingsService } from '@/services/settings.service';

async function ContactDetails() {
  const settings = await settingsService.getSettings().catch(err => {
    console.error(err);
    return { data: DEFAULT_SETTINGS } as unknown as ApiResponse<Settings>;
  });

  const items = [
    { icon: Mail, label: 'Email', value: settings.data?.contact?.email },
    { icon: Phone, label: 'Phone', value: settings.data?.contact?.phone },
    { icon: MapPin, label: 'Address', value: settings.data?.contact?.address },
    { icon: Clock, label: 'Working Hours', value: settings.data?.contact?.workingHours },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold md:text-2xl">Get in Touch</h2>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          Reach out to discuss your project, request a quote, or learn more about our services. We respond
          within 24–48 hours.
        </p>
      </div>

      <div className="space-y-4">
        {items.map(item => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="border-border/60 bg-muted/20 hover:bg-muted/30 flex items-start gap-4 rounded-xl border p-4 transition-colors"
            >
              <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                <Icon className="text-primary size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium">{item.label}</h3>
                <p className="text-muted-foreground mt-0.5 text-sm">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ContactDetails;
