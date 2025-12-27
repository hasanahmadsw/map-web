import MotionWrapper from '@/components/shared/motion/motion-wrapper';

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
    <MotionWrapper
      className="space-y-4 text-center"
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Icon Badge */}
      {Icon && (
        <MotionWrapper
          className="mb-6 inline-flex items-center gap-3"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">{BadgeText}</span>
        </MotionWrapper>
      )}

      {/* Main Heading */}
      <MotionWrapper
        as="h3"
        className="text-foreground text-3xl leading-tight font-bold md:text-4xl"
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {title}
        {highlightedText && (
          <span className="text-primary relative mx-2 inline-block">
            {' '}
            {highlightedText}
            <MotionWrapper
              className="from-primary to-primary/70 absolute -bottom-2 left-0 h-1 w-full rounded-full bg-linear-to-r"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </span>
        )}
      </MotionWrapper>

      {/* Optional Description */}
      {description && (
        <MotionWrapper
          as="p"
          className="text-muted-foreground mx-auto max-w-2xl pt-1 text-base"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {description}
        </MotionWrapper>
      )}
    </MotionWrapper>
  );
}
