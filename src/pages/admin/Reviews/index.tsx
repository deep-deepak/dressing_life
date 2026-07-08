import { useMemo, useState } from 'react';
import { Check, Search, Star, Trash2, X } from 'lucide-react';
import type { AdminReview, ReviewStatus } from '@/types';
import { deleteReview, getAdminReviews, moderateReview } from '@/services';
import { useAsync, useDisclosure, usePagination } from '@/hooks';
import { Badge, ConfirmDialog, Input, Pagination, Select, Table, type TableColumn } from '@/components/ui';
import { PageHeader } from '@/components/admin';
import { cn } from '@/utils';

const STATUS_VARIANT: Record<ReviewStatus, 'dark' | 'red' | 'outline'> = {
  pending: 'outline',
  approved: 'dark',
  rejected: 'red',
};

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={14}
          className={cn(i < rating ? 'fill-brand-red-700 text-brand-red-700' : 'fill-none text-brand-gray-300')}
        />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ReviewStatus | ''>('');
  const [rating, setRating] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const { data: reviews, isLoading, error } = useAsync(() => getAdminReviews(), [reloadKey]);

  const deleteDialog = useDisclosure();
  const [deletingReview, setDeletingReview] = useState<AdminReview | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [moderatingId, setModeratingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let results = reviews ?? [];
    if (status) results = results.filter((r) => r.status === status);
    if (rating) results = results.filter((r) => r.rating === Number(rating));
    if (search) {
      const q = search.toLowerCase();
      results = results.filter((r) => r.productName.toLowerCase().includes(q) || r.author.toLowerCase().includes(q));
    }
    return results;
  }, [reviews, status, rating, search]);

  const { page, setPage, totalPages, paginated } = usePagination(filtered, 8);

  const handleModerate = async (id: string, newStatus: ReviewStatus) => {
    setModeratingId(id);
    await moderateReview(id, newStatus);
    setModeratingId(null);
    setReloadKey((k) => k + 1);
  };

  const confirmDelete = async () => {
    if (!deletingReview) return;
    setIsDeleting(true);
    await deleteReview(deletingReview.id);
    setIsDeleting(false);
    deleteDialog.close();
    setReloadKey((k) => k + 1);
  };

  const columns: TableColumn<AdminReview>[] = [
    { key: 'product', header: 'Product', render: (r) => <span className="font-medium">{r.productName}</span> },
    { key: 'author', header: 'Author', render: (r) => r.author },
    { key: 'rating', header: 'Rating', render: (r) => <RatingStars rating={r.rating} /> },
    {
      key: 'comment',
      header: 'Comment',
      className: 'max-w-xs',
      render: (r) => <p className="line-clamp-2 text-brand-gray-600">{r.comment}</p>,
    },
    { key: 'date', header: 'Date', render: (r) => r.date },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={STATUS_VARIANT[r.status]}>{r.status}</Badge> },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (r) => (
        <div className="flex justify-end gap-2">
          {r.status !== 'approved' && (
            <button
              type="button"
              onClick={() => handleModerate(r.id, 'approved')}
              disabled={moderatingId === r.id}
              className="text-brand-gray-500 hover:text-brand-black disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={`Approve review by ${r.author}`}
            >
              <Check size={16} />
            </button>
          )}
          {r.status !== 'rejected' && (
            <button
              type="button"
              onClick={() => handleModerate(r.id, 'rejected')}
              disabled={moderatingId === r.id}
              className="text-brand-gray-500 hover:text-brand-red-700 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={`Reject review by ${r.author}`}
            >
              <X size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setDeletingReview(r);
              deleteDialog.open();
            }}
            className="text-brand-gray-500 hover:text-brand-red-700"
            aria-label={`Delete review by ${r.author}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Reviews" description="Moderate customer product reviews." />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:w-72">
          <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-brand-gray-400" />
          <Input placeholder="Search by product or author" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select
          placeholder="All statuses"
          options={[
            { value: 'pending', label: 'Pending' },
            { value: 'approved', label: 'Approved' },
            { value: 'rejected', label: 'Rejected' },
          ]}
          value={status}
          onChange={(e) => setStatus(e.target.value as ReviewStatus | '')}
          className="sm:w-52"
        />
        <Select
          placeholder="All ratings"
          options={[5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${n} Star${n > 1 ? 's' : ''}` }))}
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="sm:w-44"
        />
      </div>

      {error && <p className="text-sm text-brand-red-600">{error}</p>}

      <Table
        columns={columns}
        data={paginated}
        rowKey={(r) => r.id}
        isLoading={isLoading}
        emptyTitle="No reviews found"
        emptyDescription="Try adjusting your search or filters."
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        onConfirm={confirmDelete}
        title="Delete Review"
        description={`Are you sure you want to delete this review by "${deletingReview?.author}"? This cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
