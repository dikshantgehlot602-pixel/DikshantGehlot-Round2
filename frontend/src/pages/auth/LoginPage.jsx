import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/common/Button';
import { FormField, PasswordInput, inputClassName } from '@/components/common/FormField';
import { getHomePath } from '@/components/layout/navigation';
import { DEMO_ACCOUNTS } from '@/utils/constants';
import { getErrorMessage } from '@/services/apiClient';
import { loginSchema } from '@/utils/validationSchemas';

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState('');
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = async (values) => {
    setFormError('');
    try {
      const user = await signIn(values);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(location.state?.from ?? getHomePath(user.role), { replace: true });
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  };

  const fillDemo = (account) => {
    setValue('email', account.email, { shouldValidate: true });
    setValue('password', account.password, { shouldValidate: true });
    setFormError('');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Sign in to JoinEazy</h1>
        <p className="mt-2 text-sm text-slate-600">Welcome back. Enter your details to continue.</p>
      </div>

      {formError && (
        <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@school.edu"
            className={inputClassName(Boolean(errors.email))}
            {...register('email')}
          />
        </FormField>

        <FormField label="Password" htmlFor="password" error={errors.password?.message}>
          <PasswordInput id="password" autoComplete="current-password" placeholder="Enter your password" error={errors.password} {...register('password')} />
        </FormField>

        <div className="flex items-center justify-between gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" {...register('rememberMe')} />
            Remember me for 30 days
          </label>
          <Link to="/forgot-password" className="text-sm font-medium text-primary-700 hover:text-primary-800">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
          Sign in
        </Button>
      </form>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
        <p className="text-sm font-semibold">Demo credentials</p>
        <p className="mt-1 text-xs text-slate-500">Use either account to explore the full workflow.</p>
        <div className="mt-3 space-y-2">
          {Object.values(DEMO_ACCOUNTS).map((account) => (
            <div key={account.email} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2.5">
              <div className="min-w-0 text-xs">
                <p className="font-medium text-navy-900">{account.label}</p>
                <p className="truncate text-slate-600">{account.email}</p>
                <p className="text-slate-500">Password: {account.password}</p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => fillDemo(account)}>
                Use
              </Button>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-slate-600">
        New to JoinEazy?{' '}
        <Link to="/register" className="font-medium text-primary-700 hover:text-primary-800">
          Create an account
        </Link>
      </p>
    </div>
  );
}
