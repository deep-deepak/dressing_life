import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Product } from '@/types';
import type { ProductPayload } from '@/services';
import { Modal, Button, Input, Textarea, Select } from '@/components/ui';
import { CATEGORIES } from '@/services/mock/products.data';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: ProductPayload) => Promise<void>;
  product?: Product;
}

export function ProductFormModal({ isOpen, onClose, onSubmit, product }: ProductFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductPayload>();

  useEffect(() => {
    if (isOpen) {
      reset(
        product
          ? {
              name: product.name,
              slug: product.slug,
              description: product.description,
              price: product.price,
              compareAtPrice: product.compareAtPrice,
              category: product.category,
              fit: product.fit,
              fabric: product.fabric,
              sku: product.sku,
              stock: product.stock,
              status: product.status ?? 'active',
            }
          : { status: 'active' },
      );
    }
  }, [isOpen, product, reset]);

  const submit = async (values: ProductPayload) => {
    await onSubmit({ ...values, price: Number(values.price), stock: Number(values.stock) });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Edit Product' : 'Add Product'}
      size="lg"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button form="product-form" type="submit" size="sm" isLoading={isSubmitting}>
            {product ? 'Save Changes' : 'Create Product'}
          </Button>
        </>
      }
    >
      <form id="product-form" onSubmit={handleSubmit(submit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Name" error={errors.name?.message} {...register('name', { required: 'Name is required' })} />
        <Input label="Slug" error={errors.slug?.message} {...register('slug', { required: 'Slug is required' })} />
        <Input label="SKU" {...register('sku')} />
        <Select
          label="Category"
          placeholder="Select category"
          options={CATEGORIES.map((c) => ({ value: c, label: c }))}
          error={errors.category?.message}
          {...register('category', { required: 'Category is required' })}
        />
        <Input label="Fit" error={errors.fit?.message} {...register('fit', { required: 'Fit is required' })} />
        <Input label="Fabric" error={errors.fabric?.message} {...register('fabric', { required: 'Fabric is required' })} />
        <Input label="Price (₹)" type="number" error={errors.price?.message} {...register('price', { required: 'Price is required', min: 0 })} />
        <Input label="Compare-at Price (₹)" type="number" {...register('compareAtPrice')} />
        <Input label="Stock" type="number" error={errors.stock?.message} {...register('stock', { required: 'Stock is required', min: 0 })} />
        <Select
          label="Status"
          options={[
            { value: 'active', label: 'Active' },
            { value: 'draft', label: 'Draft' },
            { value: 'archived', label: 'Archived' },
          ]}
          {...register('status')}
        />
        <div className="sm:col-span-2">
          <Textarea label="Description" error={errors.description?.message} {...register('description', { required: 'Description is required' })} />
        </div>
      </form>
    </Modal>
  );
}
