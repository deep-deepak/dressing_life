import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Coupon, CouponPayload } from '@/types';
import { Modal, Button, Input, Select } from '@/components/ui';

interface CouponFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CouponPayload) => Promise<void>;
  coupon?: Coupon;
}

export function CouponFormModal({ isOpen, onClose, onSubmit, coupon }: CouponFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CouponPayload>();

  useEffect(() => {
    if (isOpen) {
      reset(
        coupon
          ? {
              code: coupon.code,
              type: coupon.type,
              value: coupon.value,
              minOrderValue: coupon.minOrderValue,
              usageLimit: coupon.usageLimit,
              startDate: coupon.startDate,
              endDate: coupon.endDate,
            }
          : { type: 'percentage' },
      );
    }
  }, [isOpen, coupon, reset]);

  const submit = async (values: CouponPayload) => {
    await onSubmit({
      ...values,
      value: Number(values.value),
      minOrderValue: values.minOrderValue ? Number(values.minOrderValue) : undefined,
      usageLimit: Number(values.usageLimit),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={coupon ? 'Edit Coupon' : 'Add Coupon'}
      size="lg"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button form="coupon-form" type="submit" size="sm" isLoading={isSubmitting}>
            {coupon ? 'Save Changes' : 'Create Coupon'}
          </Button>
        </>
      }
    >
      <form id="coupon-form" onSubmit={handleSubmit(submit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Code" error={errors.code?.message} {...register('code', { required: 'Code is required' })} />
        <Select
          label="Type"
          options={[
            { value: 'percentage', label: 'Percentage' },
            { value: 'fixed', label: 'Fixed Amount' },
          ]}
          error={errors.type?.message}
          {...register('type', { required: 'Type is required' })}
        />
        <Input
          label="Value"
          type="number"
          error={errors.value?.message}
          {...register('value', { required: 'Value is required', min: 0 })}
        />
        <Input label="Min Order Value (₹)" type="number" {...register('minOrderValue')} />
        <Input
          label="Usage Limit"
          type="number"
          error={errors.usageLimit?.message}
          {...register('usageLimit', { required: 'Usage limit is required', min: 1 })}
        />
        <Input
          label="Start Date"
          type="date"
          error={errors.startDate?.message}
          {...register('startDate', { required: 'Start date is required' })}
        />
        <Input
          label="End Date"
          type="date"
          error={errors.endDate?.message}
          {...register('endDate', { required: 'End date is required' })}
        />
      </form>
    </Modal>
  );
}
