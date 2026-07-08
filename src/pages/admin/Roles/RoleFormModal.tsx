import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Permission, Role, RolePayload } from '@/types';
import { Modal, Button, Input } from '@/components/ui';

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: RolePayload) => Promise<void>;
  role?: Role;
  permissions: Permission[];
}

interface RoleFormValues {
  name: string;
  description: string;
}

function groupPermissions(permissions: Permission[]): Record<string, Permission[]> {
  return permissions.reduce<Record<string, Permission[]>>((acc, permission) => {
    (acc[permission.group] ??= []).push(permission);
    return acc;
  }, {});
}

export function RoleFormModal({ isOpen, onClose, onSubmit, role, permissions }: RoleFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RoleFormValues>();

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const grouped = groupPermissions(permissions);

  useEffect(() => {
    if (isOpen) {
      reset(role ? { name: role.name, description: role.description } : { name: '', description: '' });
      setSelectedKeys(role ? [...role.permissions] : []);
    }
  }, [isOpen, role, reset]);

  const togglePermission = (key: string) => {
    setSelectedKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const toggleGroup = (groupPermissions: Permission[]) => {
    const groupKeys = groupPermissions.map((p) => p.key);
    const allSelected = groupKeys.every((k) => selectedKeys.includes(k));
    setSelectedKeys((prev) =>
      allSelected ? prev.filter((k) => !groupKeys.includes(k)) : [...new Set([...prev, ...groupKeys])],
    );
  };

  const submit = async (values: RoleFormValues) => {
    await onSubmit({ ...values, permissions: selectedKeys });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={role ? 'Edit Role' : 'Add Role'}
      size="lg"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button form="role-form" type="submit" size="sm" isLoading={isSubmitting}>
            {role ? 'Save Changes' : 'Create Role'}
          </Button>
        </>
      }
    >
      <form id="role-form" onSubmit={handleSubmit(submit)} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Name" error={errors.name?.message} {...register('name', { required: 'Name is required' })} />
          <Input
            label="Description"
            error={errors.description?.message}
            {...register('description', { required: 'Description is required' })}
          />
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-display text-sm uppercase tracking-wide">Permissions</h3>
          <div className="flex flex-col gap-5">
            {Object.entries(grouped).map(([group, groupPerms]) => {
              const groupKeys = groupPerms.map((p) => p.key);
              const allSelected = groupKeys.every((k) => selectedKeys.includes(k));
              return (
                <div key={group} className="border border-brand-gray-200 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-brand-gray-600">{group}</span>
                    <button
                      type="button"
                      onClick={() => toggleGroup(groupPerms)}
                      className="text-xs font-medium text-brand-red-700 hover:underline"
                    >
                      {allSelected ? 'Clear all' : 'Select all'}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {groupPerms.map((permission) => (
                      <label key={permission.key} className="flex items-center gap-2.5 text-sm text-brand-black">
                        <input
                          type="checkbox"
                          className="size-4 accent-brand-black"
                          checked={selectedKeys.includes(permission.key)}
                          onChange={() => togglePermission(permission.key)}
                        />
                        {permission.label}
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </form>
    </Modal>
  );
}
