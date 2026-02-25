interface WorkflowStep {
  step: string;
  title: string;
  description: string;
}

interface WorkflowSectionProps {
  steps: WorkflowStep[];
}

export function WorkflowSection({ steps }: WorkflowSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold md:text-2xl tracking-tight">Workflow / Process</h2>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed md:text-base">
          From planning to breakdown, our proven workflow ensures smooth production and reliable delivery.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
        {steps.map((item, i) => (
          <div key={i} className="rounded-xl border border-border/60 bg-muted/20 p-6">
            <span className="text-primary text-2xl font-bold">{item.step}</span>
            <h3 className="mt-2 font-semibold">{item.title}</h3>
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
