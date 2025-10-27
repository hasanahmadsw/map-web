import Link from "next/link";
import { Tag } from "@/data/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TagCardProps {
  tag: Tag;
  className?: string;
  lang: string;
}

export function TagCard({ tag, className, lang   }: TagCardProps) {
  return (
    <Link href={`/${lang}/tags/${tag.slug}`} className="block">
      <Card className={`hover:shadow-md transition-all duration-200 hover:-translate-y-1 ${className || ""}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-foreground">#{tag.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">{tag.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
