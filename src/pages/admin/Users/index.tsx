import { useMemo, useState } from 'react';
import { Plus, Search, SquarePen, Trash2 } from 'lucide-react';
import type { AdminUser, AdminUserPayload, AdminUserRole } from '@/types';
import { createAdminUser, deleteAdminUser, getAdminUsers, updateAdminUser } from '@/services';
import { useAsync, useDisclosure, usePagination } from '@/hooks';
import { Badge, Button, ConfirmDialog, Input, Pagination, Select, Table, type TableColumn } from '@/components/ui';
import { PageHeader } from '@/components/admin';
import { UserFormModal } from './UserFormModal';

const ROLE_VARIANT: Record<AdminUserRole, 'dark' | 'red' | 'outline'> = {
  admin: 'red',
  manager: 'dark',
  support: 'outline',
};

const STATUS_VARIANT: Record<AdminUser['status'], 'dark' | 'red' | 'outline'> = {
  active: 'dark',
  inactive: 'outline',
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<AdminUserRole | ''>('');
  const [reloadKey, setReloadKey] = useState(0);
  const { data: users, isLoading, error } = useAsync(() => getAdminUsers(), [reloadKey]);

  const formModal = useDisclosure();
  const deleteDialog = useDisclosure();
  const [editingUser, setEditingUser] = useState<AdminUser | undefined>();
  const [deletingUser, setDeletingUser] = useState<AdminUser | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = useMemo(() => {
    let results = users ?? [];
    if (role) results = results.filter((u) => u.role === role);
    if (search) {
      const q = search.toLowerCase();
      results = results.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    return results;
  }, [users, role, search]);

  const { page, setPage, totalPages, paginated } = usePagination(filtered, 8);

  const openCreate = () => {
    setEditingUser(undefined);
    formModal.open();
  };

  const openEdit = (user: AdminUser) => {
    setEditingUser(user);
    formModal.open();
  };

  const handleSubmit = async (payload: AdminUserPayload) => {
    if (editingUser) {
      await updateAdminUser(editingUser.id, payload);
    } else {
      await createAdminUser(payload);
    }
    setReloadKey((k) => k + 1);
  };

  const confirmDelete = async () => {
    if (!deletingUser) return;
    setIsDeleting(true);
    await deleteAdminUser(deletingUser.id);
    setIsDeleting(false);
    deleteDialog.close();
    setReloadKey((k) => k + 1);
  };

  const columns: TableColumn<AdminUser>[] = [
    {
      key: 'name',
      header: 'User',
      render: (u) => (
        <div className="flex items-center gap-3">
          {u.avatarUrl ? (
            <img src={u.avatarUrl} alt={u.name} className="size-10 shrink-0 rounded-full object-cover" />
          ) : (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-black text-xs font-semibold text-brand-white">
              {u.name.charAt(0)}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-medium">{u.name}</span>
            <span className="text-xs text-brand-gray-500">{u.email}</span>
          </div>
        </div>
      ),
    },
    { key: 'role', header: 'Role', render: (u) => <Badge variant={ROLE_VARIANT[u.role]}>{u.role}</Badge> },
    { key: 'status', header: 'Status', render: (u) => <Badge variant={STATUS_VARIANT[u.status]}>{u.status}</Badge> },
    { key: 'lastLogin', header: 'Last Login', render: (u) => u.lastLogin ?? '—' },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (u) => (
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => openEdit(u)} className="text-brand-gray-500 hover:text-brand-black" aria-label={`Edit ${u.name}`}>
            <SquarePen size={16} />
          </button>
          <button
            type="button"
            onClick={() => {
              setDeletingUser(u);
              deleteDialog.open();
            }}
            className="text-brand-gray-500 hover:text-brand-red-700"
            aria-label={`Delete ${u.name}`}
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
        title="Users"
        description="Manage admin, manager, and support staff accounts."
        action={
          <Button icon={<Plus size={16} />} onClick={openCreate}>
            Add User
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:w-72">
          <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-brand-gray-400" />
          <Input placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select
          placeholder="All roles"
          options={[
            { value: 'admin', label: 'Admin' },
            { value: 'manager', label: 'Manager' },
            { value: 'support', label: 'Support' },
          ]}
          value={role}
          onChange={(e) => setRole(e.target.value as AdminUserRole | '')}
          className="sm:w-52"
        />
      </div>

      {error && <p className="text-sm text-brand-red-600">{error}</p>}

      <Table
        columns={columns}
        data={paginated}
        rowKey={(u) => u.id}
        isLoading={isLoading}
        emptyTitle="No users found"
        emptyDescription="Try adjusting your search or filters."
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <UserFormModal isOpen={formModal.isOpen} onClose={formModal.close} onSubmit={handleSubmit} user={editingUser} />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        onConfirm={confirmDelete}
        title="Delete User"
        description={`Are you sure you want to delete "${deletingUser?.name}"? This cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
