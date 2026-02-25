import { settingsService } from '@/services/settings.service';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

async function ContactDetails() {
  const { data: settings } = await settingsService.getSettings();

  const items = [
    {
      icon: Mail,
      label: 'Email',
      value: settings?.contact?.email || 'N/A',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: settings?.contact?.phone || 'N/A',
    },
    {
      icon: MapPin,
      label: 'Address',
      value: settings?.contact?.address || 'N/A',
    },
    {
      icon: Clock,
      label: 'Working Hours',
      value: settings?.contact?.workingHours || 'N/A',
    },
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
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-start gap-4 rounded-xl border border-border/60 bg-muted/20 p-4 transition-colors hover:bg-muted/30"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
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
