import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Upload } from 'lucide-react';
import type { Product, ProductColor, ProductSize } from '@/types';
import { getCategories, uploadProductImages, type ProductPayload } from '@/services';
import { Modal, Button, Input, Textarea, Select } from '@/components/ui';
import { useAsync } from '@/hooks';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: ProductPayload) => Promise<void>;
  product?: Product;
}

const ALL_SIZES: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export function ProductFormModal({ isOpen, onClose, onSubmit, product }: ProductFormModalProps) {
  const { data: categories } = useAsync(() => getCategories(), []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductPayload>();

  const [images, setImages] = useState<string[]>([]);
  const [colors, setColors] = useState<ProductColor[]>([]);
  const [sizes, setSizes] = useState<ProductSize[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>();

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
      setImages(product?.images ?? []);
      setColors(product?.colors ?? []);
      setSizes(product?.sizes ?? []);
      setUploadError(undefined);
    }
  }, [isOpen, product, reset]);

  const onFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    try {
      setUploadError(undefined);
      setIsUploading(true);
      const urls = await uploadProductImages(Array.from(files));
      setImages((prev) => [...prev, ...urls]);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to upload images.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (url: string) => setImages((prev) => prev.filter((i) => i !== url));

  const addColor = () => setColors((prev) => [...prev, { name: '', hex: '#000000' }]);
  const updateColor = (index: number, patch: Partial<ProductColor>) =>
    setColors((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  const removeColor = (index: number) => setColors((prev) => prev.filter((_, i) => i !== index));

  const toggleSize = (size: ProductSize) =>
    setSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]));

  const submit = async (values: ProductPayload) => {
    await onSubmit({
      ...values,
      price: Number(values.price),
      stock: Number(values.stock),
      images,
      colors,
      sizes,
    });
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
          options={(categories ?? []).map((c) => ({ value: c, label: c }))}
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

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label className="text-xs font-medium uppercase tracking-wide text-brand-gray-600">Images</label>
          {uploadError && <p className="text-xs text-brand-red-600">{uploadError}</p>}
          <div className="flex flex-wrap gap-3">
            {images.map((url) => (
              <div key={url} className="relative size-20 shrink-0 overflow-hidden border border-brand-gray-200">
                <img src={url} alt="" className="size-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  aria-label="Remove image"
                  className="absolute top-0.5 right-0.5 bg-brand-black/70 p-0.5 text-brand-white hover:bg-brand-red-700"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex size-20 shrink-0 flex-col items-center justify-center gap-1 border border-dashed border-brand-gray-300 text-brand-gray-400 hover:border-brand-black hover:text-brand-black disabled:opacity-50"
            >
              <Upload size={16} />
              <span className="text-[10px]">{isUploading ? 'Uploading…' : 'Add'}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => onFilesSelected(e.target.files)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label className="text-xs font-medium uppercase tracking-wide text-brand-gray-600">Colors</label>
          <div className="flex flex-col gap-2">
            {colors.map((color, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="color"
                  value={color.hex}
                  onChange={(e) => updateColor(index, { hex: e.target.value })}
                  className="h-9 w-10 shrink-0 cursor-pointer border border-brand-gray-300"
                />
                <Input
                  placeholder="Color name"
                  value={color.name}
                  onChange={(e) => updateColor(index, { name: e.target.value })}
                  className="flex-1"
                />
                <button type="button" onClick={() => removeColor(index)} aria-label="Remove color" className="text-brand-gray-400 hover:text-brand-red-700">
                  <X size={16} />
                </button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addColor} className="self-start">
              + Add Color
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label className="text-xs font-medium uppercase tracking-wide text-brand-gray-600">Sizes</label>
          <div className="flex flex-wrap gap-2">
            {ALL_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={
                  sizes.includes(size)
                    ? 'h-9 min-w-9 border border-brand-black bg-brand-black px-3 text-sm text-brand-white'
                    : 'h-9 min-w-9 border border-brand-gray-300 px-3 text-sm text-brand-black hover:border-brand-black'
                }
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
}
