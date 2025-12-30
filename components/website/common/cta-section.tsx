import Link from 'next/link';

interface CTAButton {
  text: string;
  href: string;
}

interface CTASectionProps {
  title: string;
  description: string;
  buttons: CTAButton[];
  titleClassName?: string;
  descriptionClassName?: string;
}

export function CTASection({
  title,
  description,
  buttons,
  titleClassName = 'text-3xl font-medium md:text-4xl',
  descriptionClassName = 'text-muted-foreground mx-auto max-w-2xl text-base md:text-lg',
}: CTASectionProps) {
  return (
    <div className="glass-card space-y-6 rounded-3xl p-10 md:p-16">
      <div className="space-y-4 text-center">
        <h2 className={titleClassName}>{title}</h2>
        <p className={descriptionClassName}>{description}</p>

        <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
          {buttons.map(button => (
            <Link key={button.href} href={button.href}>
              <button className="glass-button cursor-pointer rounded-full px-8 py-4 text-base font-medium transition-all duration-200 hover:scale-105">
                {button.text}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
