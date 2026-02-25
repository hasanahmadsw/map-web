interface SectionHeaderProps {
  title: string;
  highlightedText?: string;
  description?: string;
  Icon?: React.ElementType;
  BadgeText?: string;
}

export default function SectionHeader({
  title,
  highlightedText,
  description,
  Icon,
  BadgeText,
}: SectionHeaderProps) {
  return (
    <div className="space-y-4 text-center">
      {/* Icon Badge */}
      {Icon && (
        <div className="mb-6 inline-flex items-center gap-3">
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">{BadgeText}</span>
        </div>
      )}

      {/* Main Heading */}
      <h3 className="text-foreground text-3xl leading-tight font-bold md:text-4xl">
        {title}
        {highlightedText && (
          <span className="text-primary relative mx-2 inline-block">
            {' '}
            {highlightedText}
            <span className="from-primary to-primary/70 absolute -bottom-2 left-0 h-1 w-full rounded-full bg-linear-to-r" />
          </span>
        )}
      </h3>

      {/* Optional Description */}
      {description && (
        <p className="text-muted-foreground mx-auto max-w-2xl pt-1 text-base">
          {description}
        </p>
      )}
    </div>
  );
}
