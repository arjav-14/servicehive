import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { registerUser, clearError } from '../redux/slices/authSlice';
import { registerSchema } from '../validations/auth.validation';
import type { RegisterFields } from '../validations/auth.validation';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error, dispatch } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema) as any,
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'sales',
    },
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data: any) => {
    dispatch(registerUser(data));
  };

  const roleOptions = [
    { value: 'sales', label: 'Sales Representative' },
    { value: 'admin', label: 'Administrator' },
  ];

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-50">
            Create an account
          </h3>
          <p className="mt-1.5 text-sm text-slate-400 dark:text-slate-500 font-medium">
            Get started with GigFlow smart workspace
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 text-xs font-semibold text-rose-500 dark:text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="john@company.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <Select
            label="Workspace Role"
            options={roleOptions}
            error={errors.role?.message}
            {...register('role')}
          />

          <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
            Get Started
          </Button>
        </form>

        <div className="text-center text-sm font-semibold">
          <span className="text-slate-400 dark:text-slate-500">
            Already have an account?{' '}
          </span>
          <Link
            to="/login"
            className="text-brand-500 hover:text-brand-600 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;
