import { Users, Briefcase, Award, Globe } from 'lucide-react';

interface Statistic {
  icon: typeof Users;
  value: string;
  label: string;
}

// Default statistics - you can customize these or fetch from API
const statistics: Statistic[] = [
  {
    icon: Users,
    value: '1000+',
    label: 'Happy Clients',
  },
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

export function StatisticsSection() {
  return (
    <section className="relative container w-full max-w-7xl overflow-hidden py-16">
      <div className="glass-card grid grid-cols-2 gap-8 rounded-2xl p-8 md:grid-cols-4 md:p-12">
        {statistics.map((stat, index) => {
          const Icon = stat.icon;
          const isLastInMobileRow = (index + 1) % 2 === 0;
          const isLastInDesktopRow = (index + 1) % 4 === 0;
          return (
            <div
              key={index}
              className={`space-y-2 text-center ${
                !isLastInMobileRow ? 'border-border/50 border-r' : ''
              } ${!isLastInDesktopRow ? 'md:border-border/50 md:border-r' : 'md:border-r-0'}`}
            >
              <div className="flex justify-center">
                <Icon className="text-muted-foreground h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-medium">{stat.value}</p>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
