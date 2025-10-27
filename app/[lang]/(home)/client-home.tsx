"use client";

import { BookOpen, Calendar, Clock, Globe, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { NewsCard } from "@/components/news-card";
import { TagCard } from "@/components/tag-card";
import { TopicCard } from "@/components/topic-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { articles } from "@/data/articles";
import { tags } from "@/data/tags";
import { topics } from "@/data/topics";
import { useLang } from "@/hooks/useLang";

export default function ClientHome() {
  const lang = useLang();
  const [searchQuery, setSearchQuery] = useState("");
  const allArticles = Object.values(articles).flat();
  const latestArticles = allArticles
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 6);

  // Get featured topics
  const featuredTopics = topics.slice(0, 4);

  // Get popular tags
  const popularTags = tags.slice(0, 8);

  // Filter articles based on search
  const filteredArticles = allArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 ">
        {/* Hero Section - News Website Style */}
        <section className="mb-16">
          {/* Main Hero Article */}
          <div className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Badge variant="default" className="text-sm">
                    {latestArticles[0]?.topic.name}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(latestArticles[0]?.publishedAt || "").toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">{latestArticles[0]?.title}</h1>
                <p className="text-xl text-muted-foreground leading-relaxed">{latestArticles[0]?.excerpt}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{latestArticles[0]?.readTime} min read</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {latestArticles[0]?.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag.slug} variant="secondary" className="text-xs">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href={`/${lang}/news/${latestArticles[0]?.slug}`}>Read Full Article</Link>
                </Button>
              </div>
              <div className="relative h-80 lg:h-96 rounded-xl overflow-hidden">
                <img
                  src={`https://picsum.photos/800/600?random=${latestArticles[0]?.id}`}
                  alt={latestArticles[0]?.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </div>
          {/* Breaking News Ticker */}
          <div className="my-8 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="font-semibold text-sm text-red-600">BREAKING NEWS</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Latest: {latestArticles[4]?.title}</span>
              <span>•</span>
              <span>New policy announced in Congress</span>
              <span>•</span>
              <span>Tech industry faces new regulations</span>
            </div>
          </div>

          {/* Featured Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.slice(1, 4).map((article, index) => (
              <div key={article.id} className="group cursor-pointer">
                <Link href={`/${lang}/news/${article.slug}`}>
                  <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                    <img
                      src={`https://picsum.photos/400/300?random=${article.id}`}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="default" className="text-xs">
                        {article.topic.name}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(article.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span>•</span>
                      <Clock className="h-3 w-3" />
                      <span>{article.readTime} min</span>
                    </div>
                    <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Search Results or Featured Content */}
        {searchQuery ? (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Search Results ({filteredArticles.length})</h2>
              <Button variant="outline" onClick={() => setSearchQuery("")} className="gap-2">
                Clear Search
              </Button>
            </div>

            {filteredArticles.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-semibold mb-4">No articles found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search terms or browse our topics and tags.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button asChild>
                    <Link href="/topics">Browse Topics</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/tags">Explore Tags</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* {filteredArticles.map((article) => (
                  <NewsCard lang={lang} key={article.id} article={article} variant="vertical" className="h-full" />
                ))} */}
              </div>
            )}
          </section>
        ) : (
          <>
            {/* Latest Articles */}
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  Latest Articles
                </h2>
                <Button asChild variant="outline">
                  <Link href="/news">View All Articles</Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* {latestArticles.map((article) => (
                  <NewsCard lang={lang} key={article.id} article={article} variant="vertical" className="h-full" />
                ))} */}
              </div>
            </section>

            {/* Featured Topics */}
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <Globe className="h-8 w-8 text-primary" />
                  Explore Topics
                </h2>
                <Button asChild variant="outline">
                  <Link href="/topics">View All Topics</Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredTopics.map((topic) => (
                  <TopicCard lang={lang} key={topic.slug} topic={topic} className="h-full" />
                ))}
              </div>
            </section>

            {/* Popular Tags */}
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-primary" />
                  Popular Tags
                </h2>
                <Button asChild variant="outline">
                  <Link href="/tags">View All Tags</Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {popularTags.slice(0, 6).map((tag) => (
                  <TagCard lang={lang} key={tag.slug} tag={tag} className="h-full" />
                ))}
              </div>
            </section>

            {/* Featured Article Highlight */}
            <section className="mb-16">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="default">{latestArticles[0]?.topic.name}</Badge>
                      <Badge variant="secondary">{latestArticles[0]?.tags[0]?.name}</Badge>
                    </div>
                    <h3 className="text-3xl font-bold mb-4 leading-tight">{latestArticles[0]?.title}</h3>
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{latestArticles[0]?.excerpt}</p>
                    <div className="flex items-center gap-6 text-muted-foreground mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(latestArticles[0]?.publishedAt || "").toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{latestArticles[0]?.readTime} min read</span>
                      </div>
                    </div>
                    <Button asChild size="lg">
                      <Link href={`/${lang}/news/${latestArticles[0]?.slug}`}>Read Full Article</Link>
                    </Button>
                  </div>
                  <div className="relative h-64 lg:h-80 rounded-xl overflow-hidden">
                    <img
                      src={`https://picsum.photos/600/400?random=${latestArticles[0]?.id}`}
                      alt={latestArticles[0]?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Call to Action */}
        <section className="text-center py-16 border-t">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore More?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Dive deeper into our comprehensive coverage of global events, emerging trends, and in-depth analysis from
            expert journalists.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/news">Browse All News</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/topics">Explore Topics</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/tags">Discover Tags</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
