import { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { ContactFormValues } from '@/types';
import { submitContactForm } from '@/services';
import { SITE_CONFIG } from '@/constants/site';
import { Button, Container, Input, SectionHeading, Textarea } from '@/components/ui';

export default function ContactUsPage() {
  const [status, setStatus] = useState<'idle' | 'success'>('idle');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>();

  const onSubmit = async (values: ContactFormValues) => {
    await submitContactForm(values);
    setStatus('success');
    reset();
  };

  return (
    <Container className="section-y">
      <SectionHeading eyebrow="Get in Touch" title="Contact Us" align="center" className="mx-auto mb-14" />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[320px_1fr]">
        <div className="flex flex-col gap-6">
          {[
            { icon: Mail, label: 'Email', value: SITE_CONFIG.email },
            { icon: Phone, label: 'Phone', value: SITE_CONFIG.phone },
            { icon: MapPin, label: 'Studio', value: SITE_CONFIG.address },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center bg-brand-black text-brand-white">
                <Icon size={18} />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-brand-gray-400">{label}</p>
                <p className="text-sm text-brand-black">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {status === 'success' && (
            <div className="border border-brand-black bg-brand-gray-50 px-4 py-3 text-sm">
              Thanks for reaching out — we'll get back to you within 24 hours.
            </div>
          )}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              label="Full Name"
              placeholder="John Doe"
              error={errors.name?.message}
              {...register('name', { required: 'Name is required' })}
            />
            <Input
              label="Email"
              type="email"
              placeholder="john@example.com"
              error={errors.email?.message}
              {...register('email', { required: 'Email is required' })}
            />
          </div>
          <Input
            label="Subject"
            placeholder="Order inquiry"
            error={errors.subject?.message}
            {...register('subject', { required: 'Subject is required' })}
          />
          <Textarea
            label="Message"
            placeholder="Tell us how we can help..."
            error={errors.message?.message}
            {...register('message', { required: 'Message is required' })}
          />
          <Button type="submit" size="lg" isLoading={isSubmitting} className="w-fit">
            Send Message
          </Button>
        </form>
      </div>
    </Container>
  );
}
