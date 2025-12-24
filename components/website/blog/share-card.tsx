'use client';

import { Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ShareCardProps {
  articleName: string;
  articleSlug: string;
}

export function ShareCard({ articleName, articleSlug }: ShareCardProps) {
  const articleUrl = typeof window !== 'undefined' ? window.location.href : `/blog/${articleSlug}`;

  const handleShare = async (platform: 'twitter' | 'facebook' | 'linkedin' | 'copy') => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = articleName;

    switch (platform) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          '_blank',
        );
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          '_blank',
        );
        break;
      case 'copy':
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(url);
          // You could add a toast notification here
        }
        break;
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <Share2 className="text-primary h-5 w-5" />
          </div>
          <CardTitle className="text-xl">Share Article</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 text-sm">
          Share this article with your friends and colleagues
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="hover:bg-primary/10 cursor-pointer transition-colors"
            onClick={() => handleShare('twitter')}
          >
            Twitter
          </Badge>
          <Badge
            variant="outline"
            className="hover:bg-primary/10 cursor-pointer transition-colors"
            onClick={() => handleShare('facebook')}
          >
            Facebook
          </Badge>
          <Badge
            variant="outline"
            className="hover:bg-primary/10 cursor-pointer transition-colors"
            onClick={() => handleShare('linkedin')}
          >
            LinkedIn
          </Badge>
          <Badge
            variant="outline"
            className="hover:bg-primary/10 cursor-pointer transition-colors"
            onClick={() => handleShare('copy')}
          >
            Copy Link
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
