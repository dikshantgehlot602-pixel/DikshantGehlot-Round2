const TONES = {
  primary: 'bg-primary-50 text-primary-700 ring-primary-100',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  warning: 'bg-amber-50 text-amber-700 ring-amber-100',
  danger: 'bg-rose-50 text-rose-700 ring-rose-100',
};

export default function StatCard({ label, value, hint, icon: Icon, tone = 'primary' }) {
  return (
    <div className="card flex items-start justify-between gap-4 p-5 transition-shadow duration-200 hover:shadow-card-hover">
      <div className="min-w-0">
        <p className="text-sm text-slate-600">{label}</p>
        <p className="mt-2 text-2xl font-semibold tabular-nums text-navy-900">{value}</p>
        {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      </div>
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset ${TONES[tone]}`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
    </div>
  );
}
