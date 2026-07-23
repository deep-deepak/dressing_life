import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { LoginPayload } from '@/types';
import { login } from '@/services';
import { useAuthStore } from '@/store';
import { ROUTES } from '@/constants/routes';
import { Button, Input } from '@/components/ui';

export default function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [formError, setFormError] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginPayload>();

  const onSubmit = async (values: LoginPayload) => {
    try {
      setFormError(undefined);
      const { user, token } = await login(values);
      setUser(user, token);
      navigate(ROUTES.PROFILE);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold">Welcome Back</h1>
        <p className="text-sm text-brand-gray-500">Log in to track orders and manage your wishlist.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {formError && <p className="text-sm text-brand-red-600">{formError}</p>}
        <Input
          label="Email"
          type="email"
          placeholder="john@example.com"
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

      <p className="text-center text-sm text-brand-gray-500">
        Don't have an account?{' '}
        <Link to={ROUTES.REGISTER} className="font-medium text-brand-black underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
