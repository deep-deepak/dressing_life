import { useState } from 'react';
import { Plus, SquarePen, Trash2 } from 'lucide-react';
import type { Role, RolePayload } from '@/types';
import { createRole, deleteRole, getPermissions, getRoles, updateRole } from '@/services';
import { useAsync, useDisclosure } from '@/hooks';
import { Button, ConfirmDialog, Table, type TableColumn } from '@/components/ui';
import { PageHeader } from '@/components/admin';
import { RoleFormModal } from './RoleFormModal';

export default function AdminRolesPage() {
  const [reloadKey, setReloadKey] = useState(0);
  const { data: roles, isLoading, error } = useAsync(() => getRoles(), [reloadKey]);
  const { data: permissions, isLoading: permissionsLoading } = useAsync(() => getPermissions(), []);

  const formModal = useDisclosure();
  const deleteDialog = useDisclosure();
  const [editingRole, setEditingRole] = useState<Role | undefined>();
  const [deletingRole, setDeletingRole] = useState<Role | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);

  const openCreate = () => {
    setEditingRole(undefined);
    formModal.open();
  };

  const openEdit = (role: Role) => {
    setEditingRole(role);
    formModal.open();
  };

  const handleSubmit = async (payload: RolePayload) => {
    if (editingRole) {
      await updateRole(editingRole.id, payload);
    } else {
      await createRole(payload);
    }
    setReloadKey((k) => k + 1);
  };

  const confirmDelete = async () => {
    if (!deletingRole) return;
    setIsDeleting(true);
    await deleteRole(deletingRole.id);
    setIsDeleting(false);
    deleteDialog.close();
    setReloadKey((k) => k + 1);
  };

  const totalPermissions = permissions?.length ?? 0;

  const columns: TableColumn<Role>[] = [
    { key: 'name', header: 'Role', render: (r) => <span className="font-medium">{r.name}</span> },
    { key: 'description', header: 'Description', render: (r) => <span className="text-brand-gray-600">{r.description}</span> },
    { key: 'usersCount', header: 'Users', render: (r) => r.usersCount },
    {
      key: 'permissions',
      header: 'Permissions',
      render: (r) => (
        <span className="text-brand-gray-600">
          {r.permissions.length} / {totalPermissions} permissions
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (r) => (
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => openEdit(r)} className="text-brand-gray-500 hover:text-brand-black" aria-label={`Edit ${r.name}`}>
            <SquarePen size={16} />
          </button>
          <button
            type="button"
            onClick={() => {
              setDeletingRole(r);
              deleteDialog.open();
            }}
            className="text-brand-gray-500 hover:text-brand-red-700"
            aria-label={`Delete ${r.name}`}
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
        title="Roles & Permissions"
        description="Define admin roles and control access to modules."
        action={
          <Button icon={<Plus size={16} />} onClick={openCreate} disabled={permissionsLoading}>
            Add Role
          </Button>
        }
      />

      {error && <p className="text-sm text-brand-red-600">{error}</p>}

      <Table
        columns={columns}
        data={roles ?? []}
        rowKey={(r) => r.id}
        isLoading={isLoading}
        emptyTitle="No roles found"
        emptyDescription="Create a role to get started."
      />

      <RoleFormModal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        onSubmit={handleSubmit}
        role={editingRole}
        permissions={permissions ?? []}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        onConfirm={confirmDelete}
        title="Delete Role"
        description={`Are you sure you want to delete "${deletingRole?.name}"? This cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
