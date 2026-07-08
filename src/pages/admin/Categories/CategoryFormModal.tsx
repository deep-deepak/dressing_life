import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Category, CategoryPayload } from '@/types';
import { Modal, Button, Input, Select } from '@/components/ui';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CategoryPayload) => Promise<void>;
  category?: Category;
  categories: Category[];
}

export function CategoryFormModal({ isOpen, onClose, onSubmit, category, categories }: CategoryFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryPayload>();

  useEffect(() => {
    if (isOpen) {
      reset(
        category
          ? {
              name: category.name,
              slug: category.slug,
              parentId: category.parentId,
              image: category.image,
              status: category.status,
            }
          : { status: 'active' },
      );
    }
  }, [isOpen, category, reset]);

  const submit = async (values: CategoryPayload) => {
    await onSubmit({ ...values, parentId: values.parentId || undefined });
    onClose();
  };

  const parentOptions = categories.filter((c) => c.id !== category?.id).map((c) => ({ value: c.id, label: c.name }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? 'Edit Category' : 'Add Category'}
      size="md"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button form="category-form" type="submit" size="sm" isLoading={isSubmitting}>
            {category ? 'Save Changes' : 'Create Category'}
          </Button>
        </>
      }
    >
      <form id="category-form" onSubmit={handleSubmit(submit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Name" error={errors.name?.message} {...register('name', { required: 'Name is required' })} />
        <Input label="Slug" error={errors.slug?.message} {...register('slug', { required: 'Slug is required' })} />
        <div className="sm:col-span-2">
          <Input label="Image URL" {...register('image')} />
        </div>
        <Select
          label="Parent Category"
          placeholder="No parent — top level"
          options={parentOptions}
          {...register('parentId')}
        />
        <Select
          label="Status"
          options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
          {...register('status')}
        />
      </form>
    </Modal>
  );
}
