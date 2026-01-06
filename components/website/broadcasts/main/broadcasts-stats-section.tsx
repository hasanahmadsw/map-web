import { stats } from './data';

export function BroadcastsStatsSection() {
  return (
    <div className="glass-card rounded-3xl p-8 md:p-12">
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">Our Track Record</h2>
          <p className="text-muted-foreground mt-2 text-base md:text-lg">
            Trusted by broadcast professionals across the region
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="bg-primary/10 mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full">
                  <Icon className="text-primary h-8 w-8" />
                </div>
                <div className="text-foreground mb-1 text-3xl font-bold md:text-4xl">{stat.value}</div>
                <div className="text-muted-foreground text-sm font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
