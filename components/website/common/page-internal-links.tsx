import Link from 'next/link';

export interface InternalLink {
  text: string;
  href: string;
}

interface PageInternalLinksProps {
  title: string;
  description: string;
  links: InternalLink[];
}

export function PageInternalLinks({ title, description, links }: PageInternalLinksProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/20 p-6">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      <p className="text-muted-foreground mb-6 text-sm leading-relaxed">{description}</p>
      <div className="flex flex-wrap gap-4">
        {links.map((link, i) => (
          <Link
            key={i}
            href={link.href}
            className="text-primary hover:underline text-sm font-medium"
          >
            {link.text}
          </Link>
        ))}
      </div>
    </div>
  );
}
