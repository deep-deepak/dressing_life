export type CmsStatus = 'published' | 'draft';

export interface CmsPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: CmsStatus;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  coverImage: string;
  status: CmsStatus;
  tags: string[];
  publishedAt: string;
}

export interface CmsPagePayload {
  title: string;
  slug: string;
  content: string;
  status: CmsStatus;
}

export interface BlogPostPayload {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  coverImage: string;
  status: CmsStatus;
  tags: string[];
}
