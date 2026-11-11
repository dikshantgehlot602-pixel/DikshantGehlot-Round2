import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, UserRound, BookOpenCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/common/Button';
import { FormField, PasswordInput, inputClassName } from '@/components/common/FormField';
import { getHomePath } from '@/components/layout/navigation';
import { ROLES, MIN_PASSWORD_LENGTH } from '@/utils/constants';
import { getErrorMessage } from '@/services/apiClient';
import { registerSchema } from '@/utils/validationSchemas';

const ROLE_OPTIONS = [
  { value: ROLES.STUDENT, label: 'Student', description: 'Join courses, groups and submit work.', icon: UserRound },
  { value: ROLES.PROFESSOR, label: 'Professor', description: 'Manage courses and track submissions.', icon: BookOpenCheck },
];

export default function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', role: undefined },
  });

  const onSubmit = async (values) => {
    try {
      const user = await signUp(values);
      toast.success('Account created. Welcome to JoinEazy!');
      navigate(getHomePath(user.role), { replace: true });
    } catch (error) {
      setError('email', { message: getErrorMessage(error) });
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600 text-white lg:hidden">
          <GraduationCap className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold">Create your account</h1>
          <p className="mt-2 text-sm text-slate-600">Choose your role so we can set up the right workspace.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <fieldset className="space-y-2">
          <legend className="mb-2 text-sm font-medium text-navy-900">I am a</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {ROLE_OPTIONS.map(({ value, label, description, icon: Icon }) => (
              <label
                key={value}
                className="group flex cursor-pointer gap-3 rounded-xl border border-slate-300 bg-white p-4 shadow-sm transition-all duration-150 hover:border-primary-300 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50 has-[:checked]:ring-4 has-[:checked]:ring-primary-100"
              >
                <input type="radio" value={value} className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500" {...register('role')} />
                <span>
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <Icon className="h-4 w-4 text-primary-600" aria-hidden="true" />
                    {label}
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">{description}</span>
                </span>
              </label>
            ))}
          </div>
          {errors.role && (
            <p role="alert" className="text-xs text-rose-600">
              {errors.role.message}
            </p>
          )}
        </fieldset>

        <FormField label="Full name" htmlFor="name" error={errors.name?.message}>
          <input id="name" autoComplete="name" placeholder="Jane Doe" className={inputClassName(Boolean(errors.name))} {...register('name')} />
        </FormField>

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

        <FormField label="Password" htmlFor="password" error={errors.password?.message} hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}>
          <PasswordInput id="password" autoComplete="new-password" error={errors.password} {...register('password')} />
        </FormField>

        <FormField label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
          <PasswordInput id="confirmPassword" autoComplete="new-password" error={errors.confirmPassword} {...register('confirmPassword')} />
        </FormField>

        <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary-700 hover:text-primary-800">
          Sign in
        </Link>
      </p>
    </div>
  );
}
