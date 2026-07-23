import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { RegisterPayload } from '@/types';
import { register as registerUser } from '@/services';
import { useAuthStore } from '@/store';
import { ROUTES } from '@/constants/routes';
import { Button, Input } from '@/components/ui';

export default function RegisterPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [formError, setFormError] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterPayload>();

  const onSubmit = async (values: RegisterPayload) => {
    try {
      setFormError(undefined);
      const { user, token } = await registerUser(values);
      setUser(user, token);
      navigate(ROUTES.PROFILE);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold">Create Account</h1>
        <p className="text-sm text-brand-gray-500">Join Dressing Life for exclusive drops and offers.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {formError && <p className="text-sm text-brand-red-600">{formError}</p>}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="John"
            error={errors.firstName?.message}
            {...register('firstName', { required: 'Required' })}
          />
          <Input
            label="Last Name"
            placeholder="Doe"
            error={errors.lastName?.message}
            {...register('lastName', { required: 'Required' })}
          />
        </div>
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
          {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
        />
        <Button type="submit" size="lg" isLoading={isSubmitting} className="mt-2 w-full">
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-brand-gray-500">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="font-medium text-brand-black underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
