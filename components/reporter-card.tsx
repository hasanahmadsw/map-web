import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, MapPin, Users, FileText } from "lucide-react";
import { Reporter } from "@/data/reporters";

interface ReporterCardProps {
  reporter: Reporter;
  variant?: "default" | "compact";
}

export function ReporterCard({ reporter, variant = "default" }: ReporterCardProps) {
  const initials = reporter.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const formatNumber = (num?: number) => {
    if (!num) return "0";
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (variant === "compact") {
    return (
      <Card className="flex flex-row items-center p-4 hover:shadow-md transition-shadow">
        <Avatar className="h-12 w-12 mr-4">
          <AvatarImage src={reporter.avatarUrl} alt={reporter.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-sm truncate">{reporter.name}</h3>
            {reporter.city && reporter.country && (
              <div className="flex items-center text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="truncate">
                  {reporter.city}, {reporter.country}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-1 mb-2">
            {reporter.beats.slice(0, 2).map((beat) => (
              <Badge key={beat} variant="secondary" className="text-xs">
                {beat}
              </Badge>
            ))}
            {reporter.beats.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{reporter.beats.length - 2}
              </Badge>
            )}
          </div>
          {reporter.bio && <p className="text-xs text-muted-foreground line-clamp-2">{reporter.bio}</p>}
        </div>
        <div className="flex flex-col items-end gap-2 ml-4">
          <div className="text-xs text-muted-foreground text-right">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {formatNumber(reporter.followers)}
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {reporter.publications}
            </div>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href={`/reporters/${reporter.username}`}>View Profile</Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={reporter.avatarUrl} alt={reporter.name} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-1">{reporter.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <User className="h-4 w-4" />
              <span>@{reporter.username}</span>
            </div>
            {reporter.city && reporter.country && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  {reporter.city}, {reporter.country}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex flex-wrap gap-2 mb-3">
          {reporter.beats.map((beat) => (
            <Badge key={beat} variant="secondary">
              {beat}
            </Badge>
          ))}
        </div>
        {reporter.bio && <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{reporter.bio}</p>}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{formatNumber(reporter.followers)} followers</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>{reporter.publications} articles</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/reporters/${reporter.username}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
