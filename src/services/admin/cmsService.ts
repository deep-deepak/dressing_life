import type { BlogPost, BlogPostPayload, CmsPage, CmsPagePayload } from '@/types';
import { api } from '../api';

export async function getCmsPages(): Promise<CmsPage[]> {
  const { data } = await api.get<CmsPage[]>('/cms/pages');
  return data;
}

export async function createCmsPage(payload: CmsPagePayload): Promise<CmsPage> {
  const { data } = await api.post<CmsPage>('/cms/pages', payload);
  return data;
}

export async function updateCmsPage(id: string, payload: CmsPagePayload): Promise<CmsPage> {
  const { data } = await api.put<CmsPage>(`/cms/pages/${id}`, payload);
  return data;
}

export async function deleteCmsPage(id: string): Promise<void> {
  await api.delete(`/cms/pages/${id}`);
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data } = await api.get<BlogPost[]>('/cms/blogs');
  return data;
}

export async function createBlogPost(payload: BlogPostPayload): Promise<BlogPost> {
  const { data } = await api.post<BlogPost>('/cms/blogs', payload);
  return data;
}

export async function updateBlogPost(id: string, payload: BlogPostPayload): Promise<BlogPost> {
  const { data } = await api.put<BlogPost>(`/cms/blogs/${id}`, payload);
  return data;
}

export async function deleteBlogPost(id: string): Promise<void> {
  await api.delete(`/cms/blogs/${id}`);
}
