import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { loginAdmin } from '@/services';
import { useAuthStore } from '@/store';
import { ADMIN_ROUTES } from '@/constants/routes';
import { Button, Input } from '@/components/ui';
import { Logo } from '@/components/common';

interface AdminLoginValues {
  email: string;
  password: string;
}

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [formError, setFormError] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginValues>();

  const onSubmit = async (values: AdminLoginValues) => {
    try {
      setFormError(undefined);
      const user = await loginAdmin(values);
      setUser(user);
      navigate(ADMIN_ROUTES.DASHBOARD);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-brand-black px-4 py-10">
      <Logo theme="dark" />

      <div className="flex w-full max-w-sm flex-col gap-6 bg-brand-white p-8">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="font-display text-xl uppercase tracking-wide">Admin Panel</h1>
          <p className="text-sm text-brand-gray-500">Sign in to manage the platform.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {formError && <p className="text-sm text-brand-red-600">{formError}</p>}
          <Input
            label="Email"
            type="email"
            placeholder="admin@dressinglife.com"
            error={errors.email?.message}
            {...register('email', { required: 'Email is required' })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', { required: 'Password is required' })}
          />
          <Button type="submit" size="lg" isLoading={isSubmitting} className="mt-2 w-full">
            Log In
          </Button>
        </form>

        <p className="text-center text-xs text-brand-gray-400">Demo credential: admin@dressinglife.com / admin123</p>
      </div>
    </div>
  );
}
