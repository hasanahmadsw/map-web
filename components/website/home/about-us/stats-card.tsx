import MotionWrapper from '@/components/shared/motion/motion-wrapper';
import { Briefcase, Award, Globe } from 'lucide-react';

interface Statistic {
  value: string;
  title: string;
  description: string;
}

const statistics: Statistic[] = [
  {
    value: '500+',
    title: 'Projects Completed',
    description: 'Delivering exceptional results across diverse projects with precision and excellence',
  },
  {
    value: '50+',
    title: 'Awards Won',
    description: 'Recognized for outstanding achievements and innovation in our industry',
  },
  {
    value: '20+',
    title: 'Countries Served',
    description: 'Expanding our reach globally with trusted partnerships and quality service',
  },
];

export default function StatsCard() {
  return (
    <MotionWrapper
      className="relative"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="bg-background divide-border/50 border-border/50 relative flex flex-col divide-y rounded-lg border md:flex-row md:divide-x md:divide-y-0">
        {statistics.map((stat, index) => (
          <MotionWrapper
            key={stat.title}
            className="flex flex-1 flex-col px-6 py-8 text-center md:px-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <div className="text-foreground mb-2 text-3xl font-semibold md:text-4xl">{stat.value}</div>
            <h3 className="text-foreground mb-3 text-base font-semibold md:text-lg">{stat.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{stat.description}</p>
          </MotionWrapper>
        ))}
      </div>
    </MotionWrapper>
  );
}
