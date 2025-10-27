interface NewsHeaderProps {
  title: string;
  description: string;
}

export function NewsHeader({ title, description }: NewsHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
