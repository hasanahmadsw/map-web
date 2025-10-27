import { ArrowLeft, Calendar, Clock, FileText, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { articles } from "@/data/articles";
import { reporters } from "@/data/reporters";

interface ReporterPageProps {
  params: {
    username: string;
  };
}

export default function ReporterPage({ params }: ReporterPageProps) {
  const reporter = reporters.find((r) => r.username === params.username);

  if (!reporter) {
    notFound();
  }

  const reporterArticles = articles[reporter.id] || [];
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button asChild variant="ghost" className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Reporters
            </Link>
          </Button>
        </div>

        {/* Profile Header */}
        <div className="bg-card rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={reporter.avatarUrl} alt={reporter.name} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{reporter.name}</h1>
                  <p className="text-lg text-muted-foreground mb-2">@{reporter.username}</p>
                  {reporter.city && reporter.country && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {reporter.city}, {reporter.country}
                      </span>
                    </div>
                  )}
                </div>

                <Button className="w-full md:w-auto">Follow</Button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {reporter.beats.map((beat) => (
                  <Badge key={beat} variant="secondary">
                    {beat}
                  </Badge>
                ))}
              </div>

              {reporter.bio && <p className="text-muted-foreground leading-relaxed">{reporter.bio}</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Followers</span>
                  </div>
                  <span className="font-semibold">{formatNumber(reporter.followers)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>Publications</span>
                  </div>
                  <span className="font-semibold">{reporter.publications}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Latest Articles */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Latest Articles</CardTitle>
              </CardHeader>
              <CardContent>
                {reporterArticles.length > 0 ? (
                  <div className="space-y-4">
                    {reporterArticles.map((article) => (
                      <div key={article.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                        <h3 className="font-semibold mb-2 hover:text-primary transition-colors">
                          <Link href={article.url}>{article.title}</Link>
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{article.excerpt}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(article.publishedAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{article.readTime} min read</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No articles published yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
