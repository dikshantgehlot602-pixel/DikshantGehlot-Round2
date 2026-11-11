import { useState } from 'react';
import { toast } from 'sonner';
import { RotateCcw, ShieldCheck, Mail, UserCircle, CalendarDays, Stethoscope } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { resetDatabase } from '@/services/database';
import { clearStoredSession } from '@/services/authService';
import { useLogout } from '@/hooks/useLogout';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/common/Button';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Badge from '@/components/common/Badge';
import { ROLE_LABELS } from '@/utils/constants';
import { formatDateTime } from '@/utils/formatters';

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="truncate text-sm font-medium text-navy-900">{value}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const logout = useLogout();
  const [resetOpen, setResetOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleReset = () => {
    setResetting(true);
    try {
      resetDatabase();
      clearStoredSession();
      toast.success('Demo data reset. You will be signed out.');
      setResetOpen(false);
      setTimeout(() => logout(), 600);
    } catch {
      toast.error('Could not reset the demo data. Please try again.');
      setResetting(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader title="My profile" description="Your account details and demo data controls." />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card flex flex-col items-center gap-3 p-6 text-center lg:col-span-1">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-primary-800 ring-4 ring-white">
            <UserCircle className="h-10 w-10" aria-hidden="true" />
          </span>
          <h3 className="text-lg font-semibold">{user.name}</h3>
          <Badge tone="primary" icon={ShieldCheck}>
            {ROLE_LABELS[user.role] ?? user.role}
          </Badge>
        </section>

        <section className="card space-y-3 p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold">Account details</h3>
          <DetailRow icon={UserCircle} label="Full name" value={user.name} />
          <DetailRow icon={Mail} label="Email" value={user.email} />
          <DetailRow icon={ShieldCheck} label="Role" value={ROLE_LABELS[user.role] ?? user.role} />
          {user.createdAt && <DetailRow icon={CalendarDays} label="Member since" value={formatDateTime(user.createdAt)} />}
        </section>
      </div>

      <section className="card space-y-4 border-amber-200 p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
            <Stethoscope className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-sm font-semibold">Demo data</h3>
            <p className="mt-1 text-sm text-slate-600">
              Reset every user, course, assignment, group and submission back to the original seeded sample. You will be signed out afterwards.
            </p>
          </div>
        </div>
        <Button variant="secondary" icon={RotateCcw} onClick={() => setResetOpen(true)}>
          Reset demo data
        </Button>
      </section>

      <ConfirmDialog
        open={resetOpen}
        title="Reset all demo data?"
        description="This restores the original seed data and erases any changes you made."
        confirmLabel="Reset and sign out"
        tone="danger"
        loading={resetting}
        onConfirm={handleReset}
        onClose={() => setResetOpen(false)}
      >
        <p className="text-sm text-slate-700">
          You will be returned to the login screen. This is useful before reviewing the app from a clean state.
        </p>
      </ConfirmDialog>
    </div>
  );
}
