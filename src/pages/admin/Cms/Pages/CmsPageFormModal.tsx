import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { CmsPage, CmsPagePayload } from '@/types';
import { Modal, Button, Input, Textarea, Select } from '@/components/ui';

interface CmsPageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CmsPagePayload) => Promise<void>;
  page?: CmsPage;
}

export function CmsPageFormModal({ isOpen, onClose, onSubmit, page }: CmsPageFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CmsPagePayload>();

  useEffect(() => {
    if (isOpen) {
      reset(
        page
          ? { title: page.title, slug: page.slug, content: page.content, status: page.status }
          : { status: 'draft' },
      );
    }
  }, [isOpen, page, reset]);

  const submit = async (values: CmsPagePayload) => {
    await onSubmit(values);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={page ? 'Edit Page' : 'Add Page'}
      size="lg"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button form="cms-page-form" type="submit" size="sm" isLoading={isSubmitting}>
            {page ? 'Save Changes' : 'Create Page'}
          </Button>
        </>
      }
    >
      <form id="cms-page-form" onSubmit={handleSubmit(submit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Title" error={errors.title?.message} {...register('title', { required: 'Title is required' })} />
        <Input label="Slug" error={errors.slug?.message} {...register('slug', { required: 'Slug is required' })} />
        <Select
          label="Status"
          options={[
            { value: 'published', label: 'Published' },
            { value: 'draft', label: 'Draft' },
          ]}
          {...register('status')}
        />
        <div className="sm:col-span-2">
          <Textarea label="Content" error={errors.content?.message} {...register('content', { required: 'Content is required' })} />
        </div>
      </form>
    </Modal>
  );
}
