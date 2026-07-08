import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { BlogPost, BlogPostPayload } from '@/types';
import { Modal, Button, Input, Textarea, Select } from '@/components/ui';

interface BlogPostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: BlogPostPayload) => Promise<void>;
  post?: BlogPost;
}

type BlogPostFormValues = Omit<BlogPostPayload, 'tags'> & { tags: string };

export function BlogPostFormModal({ isOpen, onClose, onSubmit, post }: BlogPostFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BlogPostFormValues>();

  useEffect(() => {
    if (isOpen) {
      reset(
        post
          ? {
              title: post.title,
              slug: post.slug,
              excerpt: post.excerpt,
              content: post.content,
              author: post.author,
              coverImage: post.coverImage,
              status: post.status,
              tags: post.tags.join(', '),
            }
          : { status: 'draft', tags: '' },
      );
    }
  }, [isOpen, post, reset]);

  const submit = async (values: BlogPostFormValues) => {
    const tags = values.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    await onSubmit({ ...values, tags });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={post ? 'Edit Blog Post' : 'Add Blog Post'}
      size="lg"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button form="blog-post-form" type="submit" size="sm" isLoading={isSubmitting}>
            {post ? 'Save Changes' : 'Create Post'}
          </Button>
        </>
      }
    >
      <form id="blog-post-form" onSubmit={handleSubmit(submit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Title" error={errors.title?.message} {...register('title', { required: 'Title is required' })} />
        <Input label="Slug" error={errors.slug?.message} {...register('slug', { required: 'Slug is required' })} />
        <Input label="Author" error={errors.author?.message} {...register('author', { required: 'Author is required' })} />
        <Input label="Cover Image URL" error={errors.coverImage?.message} {...register('coverImage', { required: 'Cover image is required' })} />
        <Select
          label="Status"
          options={[
            { value: 'published', label: 'Published' },
            { value: 'draft', label: 'Draft' },
          ]}
          {...register('status')}
        />
        <Input label="Tags" placeholder="comma, separated, tags" {...register('tags')} />
        <div className="sm:col-span-2">
          <Textarea label="Excerpt" error={errors.excerpt?.message} {...register('excerpt', { required: 'Excerpt is required' })} />
        </div>
        <div className="sm:col-span-2">
          <Textarea label="Content" error={errors.content?.message} {...register('content', { required: 'Content is required' })} />
        </div>
      </form>
    </Modal>
  );
}
