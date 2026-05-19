import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { loginUser, clearError } from '../redux/slices/authSlice';
import { loginSchema } from '../validations/auth.validation';
import type { LoginFields } from '../validations/auth.validation';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error, dispatch } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema) as any,
    defaultValues: {
      email: '',
      password: '',
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

  const onSubmit = (data: LoginFields) => {
    dispatch(loginUser(data));
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-50">
            Welcome back
          </h3>
          <p className="mt-1.5 text-sm text-slate-400 dark:text-slate-500 font-medium">
            Sign in to access your leads dashboard
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 text-xs font-semibold text-rose-500 dark:text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@company.com"
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

          <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <div className="text-center text-sm font-semibold">
          <span className="text-slate-400 dark:text-slate-500">
            New to GigFlow?{' '}
          </span>
          <Link
            to="/register"
            className="text-brand-500 hover:text-brand-600 transition-colors"
          >
            Create an account
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
