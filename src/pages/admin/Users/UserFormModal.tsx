import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { AdminUser, AdminUserPayload } from '@/types';
import { Modal, Button, Input, Select } from '@/components/ui';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: AdminUserPayload) => Promise<void>;
  user?: AdminUser;
}

export function UserFormModal({ isOpen, onClose, onSubmit, user }: UserFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminUserPayload>();

  useEffect(() => {
    if (isOpen) {
      reset(
        user
          ? {
              name: user.name,
              email: user.email,
              role: user.role,
              status: user.status,
            }
          : { role: 'support', status: 'active' },
      );
    }
  }, [isOpen, user, reset]);

  const submit = async (values: AdminUserPayload) => {
    await onSubmit(values);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? 'Edit User' : 'Add User'}
      size="md"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button form="user-form" type="submit" size="sm" isLoading={isSubmitting}>
            {user ? 'Save Changes' : 'Create User'}
          </Button>
        </>
      }
    >
      <form id="user-form" onSubmit={handleSubmit(submit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input label="Name" error={errors.name?.message} {...register('name', { required: 'Name is required' })} />
        </div>
        <div className="sm:col-span-2">
          <Input
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register('email', { required: 'Email is required' })}
          />
        </div>
        <Select
          label="Role"
          options={[
            { value: 'admin', label: 'Admin' },
            { value: 'manager', label: 'Manager' },
            { value: 'support', label: 'Support' },
          ]}
          error={errors.role?.message}
          {...register('role', { required: 'Role is required' })}
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
