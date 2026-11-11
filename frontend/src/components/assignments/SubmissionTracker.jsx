import ProgressBar from '@/components/common/ProgressBar';
import { SUBMISSION_TYPES } from '@/utils/constants';

export default function SubmissionTracker({ tracking }) {
  const unitLabel = tracking.type === SUBMISSION_TYPES.GROUP ? 'groups' : 'students';
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm text-slate-600">
          <span className="text-base font-semibold text-navy-900">
            {tracking.submittedCount} / {tracking.total}
          </span>{' '}
          {tracking.type === SUBMISSION_TYPES.GROUP ? 'groups' : 'students'} submitted
        </p>
        <p className="text-xs text-slate-500">
          {tracking.pendingCount} {unitLabel} pending
        </p>
      </div>
      <ProgressBar value={tracking.percent} barClassName={tracking.percent === 100 ? 'bg-emerald-500' : 'bg-primary-600'} showValue={false} />
    </div>
  );
}
