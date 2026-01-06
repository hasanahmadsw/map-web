import { processSteps } from './data';

export function BroadcastsProcessSection() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-semibold md:text-4xl">How It Works</h2>
        <p className="text-muted-foreground mt-2 text-base md:text-lg">
          Simple steps to get your broadcast production started
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {processSteps.map((item, index) => (
          <div
            key={index}
            className="group glass-card relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
