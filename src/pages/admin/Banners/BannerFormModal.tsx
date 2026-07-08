import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Banner, BannerPayload } from '@/types';
import { Modal, Button, Input, Select } from '@/components/ui';

interface BannerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: BannerPayload) => Promise<void>;
  banner?: Banner;
}

const POSITION_OPTIONS = [
  { value: 'homepage-hero', label: 'Homepage Hero' },
  { value: 'homepage-promo', label: 'Homepage Promo' },
  { value: 'category-top', label: 'Category Top' },
];

export function BannerFormModal({ isOpen, onClose, onSubmit, banner }: BannerFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BannerPayload>();

  useEffect(() => {
    if (isOpen) {
      reset(
        banner
          ? {
              title: banner.title,
              imageUrl: banner.imageUrl,
              link: banner.link,
              position: banner.position,
              order: banner.order,
              status: banner.status,
              startDate: banner.startDate,
              endDate: banner.endDate,
            }
          : { position: 'homepage-hero', status: 'active', order: 1 },
      );
    }
  }, [isOpen, banner, reset]);

  const submit = async (values: BannerPayload) => {
    await onSubmit({ ...values, order: Number(values.order) });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={banner ? 'Edit Banner' : 'Add Banner'}
      size="lg"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button form="banner-form" type="submit" size="sm" isLoading={isSubmitting}>
            {banner ? 'Save Changes' : 'Create Banner'}
          </Button>
        </>
      }
    >
      <form id="banner-form" onSubmit={handleSubmit(submit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input label="Title" error={errors.title?.message} {...register('title', { required: 'Title is required' })} />
        </div>
        <div className="sm:col-span-2">
          <Input label="Image URL" error={errors.imageUrl?.message} {...register('imageUrl', { required: 'Image URL is required' })} />
        </div>
        <div className="sm:col-span-2">
          <Input label="Link" placeholder="/t-shirts?category=..." {...register('link')} />
        </div>
        <Select
          label="Position"
          options={POSITION_OPTIONS}
          error={errors.position?.message}
          {...register('position', { required: 'Position is required' })}
        />
        <Input label="Order" type="number" error={errors.order?.message} {...register('order', { required: 'Order is required', min: 0 })} />
        <Select
          label="Status"
          options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
          {...register('status')}
        />
        <Input label="Start Date" type="date" {...register('startDate')} />
        <Input label="End Date" type="date" {...register('endDate')} />
      </form>
    </Modal>
  );
}
