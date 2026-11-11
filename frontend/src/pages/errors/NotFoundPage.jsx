import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getHomePath } from '@/components/layout/navigation';
import { buttonClasses } from '@/components/common/Button';

export default function NotFoundPage() {
  const { user } = useAuth();
  const home = user ? getHomePath(user.role) : '/login';

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 ring-1 ring-primary-100">
        <Compass className="h-8 w-8" aria-hidden="true" />
      </span>
      <p className="mt-6 text-4xl font-semibold tabular-nums">404</p>
      <h1 className="mt-2 text-xl font-semibold">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-600">
        The page you are looking for may have moved, been removed, or never existed.
      </p>
      <Link to={home} className={`${buttonClasses({ variant: 'primary', size: 'md' })} mt-6`}>
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to {user ? 'your dashboard' : 'login'}
      </Link>
    </div>
  );
}
