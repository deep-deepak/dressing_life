import { useState } from 'react';
import { Plus, SquarePen, Trash2 } from 'lucide-react';
import type { BlogPost, BlogPostPayload } from '@/types';
import { createBlogPost, deleteBlogPost, getBlogPosts, updateBlogPost } from '@/services';
import { useAsync, useDisclosure, usePagination } from '@/hooks';
import { Badge, Button, ConfirmDialog, Pagination, Table, type TableColumn } from '@/components/ui';
import { PageHeader } from '@/components/admin';
import { CmsTabs } from '../CmsTabs';
import { BlogPostFormModal } from './BlogPostFormModal';

export default function AdminCmsBlogsPage() {
  const [reloadKey, setReloadKey] = useState(0);
  const { data: posts, isLoading, error } = useAsync(() => getBlogPosts(), [reloadKey]);

  const { page, setPage, totalPages, paginated } = usePagination(posts ?? [], 8);

  const formModal = useDisclosure();
  const deleteDialog = useDisclosure();
  const [editingPost, setEditingPost] = useState<BlogPost | undefined>();
  const [deletingPost, setDeletingPost] = useState<BlogPost | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);

  const openCreate = () => {
    setEditingPost(undefined);
    formModal.open();
  };

  const openEdit = (post: BlogPost) => {
    setEditingPost(post);
    formModal.open();
  };

  const handleSubmit = async (payload: BlogPostPayload) => {
    if (editingPost) {
      await updateBlogPost(editingPost.id, payload);
    } else {
      await createBlogPost(payload);
    }
    setReloadKey((k) => k + 1);
  };

  const confirmDelete = async () => {
    if (!deletingPost) return;
    setIsDeleting(true);
    await deleteBlogPost(deletingPost.id);
    setIsDeleting(false);
    deleteDialog.close();
    setReloadKey((k) => k + 1);
  };

  const columns: TableColumn<BlogPost>[] = [
    {
      key: 'cover',
      header: 'Cover',
      render: (p) => <img src={p.coverImage} alt={p.title} className="h-16 w-24 object-cover" />,
    },
    {
      key: 'title',
      header: 'Title',
      render: (p) => (
        <div className="flex flex-col">
          <span className="font-medium">{p.title}</span>
          <span className="text-xs text-brand-gray-500">/{p.slug}</span>
        </div>
      ),
    },
    { key: 'author', header: 'Author', render: (p) => p.author },
    {
      key: 'status',
      header: 'Status',
      render: (p) => <Badge variant={p.status === 'published' ? 'dark' : 'outline'}>{p.status}</Badge>,
    },
    { key: 'publishedAt', header: 'Published', render: (p) => p.publishedAt },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (p) => (
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => openEdit(p)} className="text-brand-gray-500 hover:text-brand-black" aria-label={`Edit ${p.title}`}>
            <SquarePen size={16} />
          </button>
          <button
            type="button"
            onClick={() => {
              setDeletingPost(p);
              deleteDialog.open();
            }}
            className="text-brand-gray-500 hover:text-brand-red-700"
            aria-label={`Delete ${p.title}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="CMS"
        description="Manage static pages and blog content."
        action={
          <Button icon={<Plus size={16} />} onClick={openCreate}>
            Add Blog Post
          </Button>
        }
      />

      <CmsTabs />

      {error && <p className="text-sm text-brand-red-600">{error}</p>}

      <Table
        columns={columns}
        data={paginated}
        rowKey={(p) => p.id}
        isLoading={isLoading}
        emptyTitle="No blog posts found"
        emptyDescription="Create a post to publish it on the storefront."
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <BlogPostFormModal isOpen={formModal.isOpen} onClose={formModal.close} onSubmit={handleSubmit} post={editingPost} />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        onConfirm={confirmDelete}
        title="Delete Blog Post"
        description={`Are you sure you want to delete "${deletingPost?.title}"? This cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
