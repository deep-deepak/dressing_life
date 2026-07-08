import type { BlogPost, BlogPostPayload, CmsPage, CmsPagePayload } from '@/types';
import { BLOG_POSTS, CMS_PAGES } from '../mock/admin/cms.data';
import { simulateDelay } from '../simulateDelay';

const today = () => new Date().toISOString().slice(0, 10);

export async function getCmsPages(): Promise<CmsPage[]> {
  return simulateDelay([...CMS_PAGES]);
}

export async function createCmsPage(payload: CmsPagePayload): Promise<CmsPage> {
  const newPage: CmsPage = { id: `pg-${crypto.randomUUID().slice(0, 8)}`, updatedAt: today(), ...payload };
  CMS_PAGES.unshift(newPage);
  return simulateDelay(newPage);
}

export async function updateCmsPage(id: string, payload: CmsPagePayload): Promise<CmsPage> {
  const index = CMS_PAGES.findIndex((p) => p.id === id);
  if (index === -1) throw new Error('Page not found.');
  CMS_PAGES[index] = { ...CMS_PAGES[index], ...payload, updatedAt: today() };
  return simulateDelay(CMS_PAGES[index]);
}

export async function deleteCmsPage(id: string): Promise<void> {
  const index = CMS_PAGES.findIndex((p) => p.id === id);
  if (index !== -1) CMS_PAGES.splice(index, 1);
  return simulateDelay(undefined);
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return simulateDelay([...BLOG_POSTS]);
}

export async function createBlogPost(payload: BlogPostPayload): Promise<BlogPost> {
  const newPost: BlogPost = { id: `bl-${crypto.randomUUID().slice(0, 8)}`, publishedAt: today(), ...payload };
  BLOG_POSTS.unshift(newPost);
  return simulateDelay(newPost);
}

export async function updateBlogPost(id: string, payload: BlogPostPayload): Promise<BlogPost> {
  const index = BLOG_POSTS.findIndex((p) => p.id === id);
  if (index === -1) throw new Error('Blog post not found.');
  BLOG_POSTS[index] = { ...BLOG_POSTS[index], ...payload };
  return simulateDelay(BLOG_POSTS[index]);
}

export async function deleteBlogPost(id: string): Promise<void> {
  const index = BLOG_POSTS.findIndex((p) => p.id === id);
  if (index !== -1) BLOG_POSTS.splice(index, 1);
  return simulateDelay(undefined);
}
