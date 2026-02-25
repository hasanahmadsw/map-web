import { Radio, Video, Mic, Monitor } from 'lucide-react';
import TrustIndicator from './trust-indicator';

const features = [
  { icon: Radio, text: 'Production Equipment' },
  { icon: Video, text: 'Broadcasting Solutions' },
  { icon: Mic, text: 'Expert Consultation' },
  { icon: Monitor, text: 'Media Solutions' },
];

export default function ContentSection() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 text-center">
      <div className="p-6">
        <p className="text-muted-foreground text-lg leading-relaxed">
          <span className="text-primary text-lg font-bold md:text-2xl">
            Professional Media Services in UAE, Saudi Arabia, and the Middle East
          </span>{' '}
          At MAP Media Art Production, we bring over 25 years of expertise in media production, broadcasting,
          and event management. Based in Dubai and serving the UAE, Saudi Arabia, and the Middle East, we
          specialize in delivering creative solutions tailored to meet your vision. From cinematic productions
          and live event coverage to equipment rentals and satellite broadcasting, our services ensure
          high-quality results every time.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {features.map((feature) => (
          <div
            key={feature.text}
            className="glass-card flex items-center gap-3 rounded-xl p-4"
          >
            <div className="bg-primary/10 rounded-lg p-2">
              <feature.icon className="text-primary h-4 w-4" />
            </div>
            <span className="text-foreground text-xs font-medium md:text-sm">{feature.text}</span>
          </div>
        ))}
      </div>

      <TrustIndicator label="Rated 5/5 by 200+ Clients" />
    </div>
  );
}
