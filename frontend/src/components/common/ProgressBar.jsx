export default function ProgressBar({ value, label, barClassName = 'bg-primary-600', showValue = true }) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="space-y-1.5">
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>{label}</span>
          {showValue && <span className="font-semibold text-navy-900">{clamped}%</span>}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
        <div className={`h-full rounded-full transition-all duration-500 ease-out ${barClassName}`} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
