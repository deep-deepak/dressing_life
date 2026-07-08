import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { StoreSettings } from '@/types';
import { getStoreSettings, updateStoreSettings } from '@/services';
import { useAsync } from '@/hooks';
import { Button, Input, PageLoader, Tabs } from '@/components/ui';
import { PageHeader } from '@/components/admin';
import { cn } from '@/utils';

type SettingsTab = 'general' | 'shipping' | 'social';

const TABS: { value: SettingsTab; label: string }[] = [
  { value: 'general', label: 'General' },
  { value: 'shipping', label: 'Shipping & Tax' },
  { value: 'social', label: 'Social' },
];

export default function AdminSettingsPage() {
  const { data: settings, isLoading } = useAsync(() => getStoreSettings(), []);
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [savedMessage, setSavedMessage] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<StoreSettings>();

  useEffect(() => {
    if (settings) reset(settings);
  }, [settings, reset]);

  const submit = async (values: StoreSettings) => {
    const payload: StoreSettings = {
      ...values,
      taxRatePct: Number(values.taxRatePct),
      flatShippingFee: Number(values.flatShippingFee),
      freeShippingThreshold: Number(values.freeShippingThreshold),
    };
    await updateStoreSettings(payload);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  if (isLoading || !settings) return <PageLoader />;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Settings" description="Configure your storefront's general, shipping, and social details." />

      <Tabs tabs={TABS} value={activeTab} onChange={(v) => setActiveTab(v as SettingsTab)} />

      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-6">
        <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2', activeTab !== 'general' && 'hidden')}>
          <Input label="Store Name" {...register('storeName', { required: true })} />
          <Input label="Currency" {...register('currency', { required: true })} />
          <Input label="Support Email" type="email" {...register('supportEmail', { required: true })} />
          <Input label="Support Phone" {...register('supportPhone', { required: true })} />
          <div className="sm:col-span-2">
            <Input label="Logo URL" {...register('logoUrl')} />
          </div>
        </div>

        <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-3', activeTab !== 'shipping' && 'hidden')}>
          <Input label="Tax Rate (%)" type="number" step="0.01" {...register('taxRatePct', { required: true, min: 0 })} />
          <Input label="Flat Shipping Fee (₹)" type="number" step="0.01" {...register('flatShippingFee', { required: true, min: 0 })} />
          <Input
            label="Free Shipping Threshold (₹)"
            type="number"
            step="0.01"
            {...register('freeShippingThreshold', { required: true, min: 0 })}
          />
        </div>

        <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-3', activeTab !== 'social' && 'hidden')}>
          <Input label="Instagram" placeholder="https://instagram.com/yourstore" {...register('socialLinks.instagram')} />
          <Input label="Facebook" placeholder="https://facebook.com/yourstore" {...register('socialLinks.facebook')} />
          <Input label="Twitter" placeholder="https://twitter.com/yourstore" {...register('socialLinks.twitter')} />
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" isLoading={isSubmitting}>
            Save Changes
          </Button>
          {savedMessage && <span className="text-sm text-brand-gray-600">Settings saved.</span>}
        </div>
      </form>
    </div>
  );
}
