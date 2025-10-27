import Link from "next/link";
import { Topic } from "@/data/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TopicCardProps {
  topic: Topic;
  className?: string;
  lang: string;
}

export function TopicCard({ topic, className, lang }: TopicCardProps) {
  return (
    <Link href={`/${lang}/topics/${topic.slug}`} className="block">
      <Card className={`hover:shadow-lg transition-all duration-200 hover:-translate-y-1 ${className || ""}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold text-foreground">{topic.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{topic.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
