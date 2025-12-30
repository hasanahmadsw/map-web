import MotionWrapper from '@/components/shared/motion/motion-wrapper';
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
    <MotionWrapper
      className="mx-auto max-w-5xl space-y-6 text-center"
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <MotionWrapper
        className="p-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
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
      </MotionWrapper>

      <MotionWrapper
        className="grid grid-cols-2 gap-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        {features.map((feature, index) => (
          <MotionWrapper
            key={feature.text}
            className="glass-card flex items-center gap-3 rounded-xl p-4"
            whileHover={{
              scale: 1.02,
              y: -2,
              transition: { type: 'spring', stiffness: 300 },
            }}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <div className="bg-primary/10 rounded-lg p-2">
              <feature.icon className="text-primary h-4 w-4" />
            </div>
            <span className="text-foreground text-xs font-medium md:text-sm">{feature.text}</span>
          </MotionWrapper>
        ))}
      </MotionWrapper>

      <TrustIndicator label="Rated 5/5 by 200+ Clients" />
    </MotionWrapper>
  );
}
