export interface Topic {
  slug: string;
  name: string;
  description: string;
}

export interface Tag {
  slug: string;
  name: string;
  description: string;
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  role: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: number;
  url: string;
  topic: Topic;
  tags: Tag[];
  author?: Author;
}
