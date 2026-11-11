import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import Button from '@/components/common/Button';
import { FormField, inputClassName } from '@/components/common/FormField';
import { requestPasswordReset } from '@/services/authService';
import { getErrorMessage } from '@/services/apiClient';
import { forgotPasswordSchema } from '@/utils/validationSchemas';

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState('');
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: '' } });

  const onSubmit = async ({ email }) => {
    try {
      const result = await requestPasswordReset(email);
      setMessage(result.message);
    } catch (error) {
      setError('email', { message: getErrorMessage(error) });
    }
  };

  if (message) {
    return (
      <div className="space-y-6 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <MailCheck className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold">Check your inbox</h1>
          <p className="mt-2 text-sm text-slate-600">{message}</p>
        </div>
        <Link to="/login" className="inline-block text-sm font-medium text-primary-700 hover:text-primary-800">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="mb-3 inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-200">
          Demo feature
        </span>
        <h1 className="text-2xl font-semibold">Reset your password</h1>
        <p className="mt-2 text-sm text-slate-600">Enter your account email. In this demo, no email is actually sent.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <input id="email" type="email" autoComplete="email" className={inputClassName(Boolean(errors.email))} {...register('email')} />
        </FormField>
        <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
          Send reset link
        </Button>
      </form>
      <Link to="/login" className="block text-center text-sm font-medium text-primary-700 hover:text-primary-800">
        Back to sign in
      </Link>
    </div>
  );
}
