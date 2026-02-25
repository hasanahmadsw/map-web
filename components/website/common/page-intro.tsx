interface PageIntroProps {
  title: string;
  paragraphs: string[];
}

export function PageIntro({ title, paragraphs }: PageIntroProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold md:text-2xl">{title}</h2>
      {paragraphs.map((p, i) => (
        <p key={i} className="text-muted-foreground text-sm leading-relaxed md:text-base">
          {p}
        </p>
      ))}
    </div>
  );
}
