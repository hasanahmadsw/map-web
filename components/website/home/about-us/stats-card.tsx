import MotionWrapper from '@/components/shared/motion/motion-wrapper';
import { Users, Briefcase, Award, Globe, Camera, Video, Mic } from 'lucide-react';

interface Statistic {
  icon: typeof Users;
  value: string;
  label: string;
}

const statistics: Statistic[] = [
  {
    icon: Briefcase,
    value: '500+',
    label: 'Projects Completed',
  },
  {
    icon: Award,
    value: '50+',
    label: 'Awards Won',
  },
  {
    icon: Globe,
    value: '20+',
    label: 'Countries Served',
  },
];

export default async function StatsCard() {
  const icons = [{ icon: Camera }, { icon: Video }, { icon: Mic }];

  return (
    <MotionWrapper
      className="relative"
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <div className="border-border/20 bg-card/80 relative rounded-3xl border p-8 shadow-2xl backdrop-blur-xl">
        {/* Glow Effect */}
        <div className="from-primary/10 to-secondary/10 absolute inset-0 rounded-3xl bg-linear-to-r opacity-50 blur-xl" />

        {/* Content */}
        <div className="relative z-10">
          {/* Animated Icons Grid */}
          <div className="mb-8 grid grid-cols-3 gap-4">
            {icons.map((item, index) => (
              <MotionWrapper
                key={index}
                className="flex justify-center"
                whileHover={{
                  scale: 1.1,
                  y: -5,
                  transition: { type: 'spring', stiffness: 300 },
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div
                  className={`bg-primary flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg`}
                >
                  <item.icon className="text-primary-foreground h-8 w-8" />
                </div>
              </MotionWrapper>
            ))}
          </div>

          {/* Main Stat */}
          <MotionWrapper
            className="mb-4 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
          >
            <div className="bg-primary mb-2 bg-clip-text text-6xl font-bold text-transparent">1000+</div>
            <div className="text-muted-foreground text-lg font-semibold">Happy Clients</div>
          </MotionWrapper>

          {/* Sub Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            {statistics.map((stat, index) => (
              <MotionWrapper
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <div className="text-primary text-2xl font-bold">{stat.value}</div>
                <div className="text-muted-foreground text-xs">{stat.label}</div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </div>
    </MotionWrapper>
  );
}
