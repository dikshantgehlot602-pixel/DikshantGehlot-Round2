import { Users, UsersRound, Crown } from 'lucide-react';
import Avatar from '@/components/common/Avatar';
import { EmptyState } from '@/components/common/StateViews';
import { SUBMISSION_TYPES } from '@/utils/constants';
import { formatDateTime } from '@/utils/formatters';

function matchesQuery(unit, query) {
  if (!query) return true;
  const term = query.toLowerCase();
  const haystack = [unit.name, unit.email, unit.leader?.name, ...(unit.members?.map((member) => member.name) ?? [])];
  return haystack.filter(Boolean).some((value) => value.toLowerCase().includes(term));
}

function IndividualRow({ unit }) {
  return (
    <li className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar name={unit.name} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{unit.name}</p>
          <p className="truncate text-xs text-slate-500">{unit.email}</p>
        </div>
      </div>
      {unit.submission ? (
        <p className="text-xs text-slate-600 sm:text-right">
          <span className="font-medium text-emerald-700">Acknowledged</span>
          <br />
          {formatDateTime(unit.submission.acknowledgedAt)}
        </p>
      ) : (
        <p className="text-xs font-medium text-amber-700">Not yet acknowledged</p>
      )}
    </li>
  );
}

function GroupRow({ unit }) {
  return (
    <li className="space-y-3 px-5 py-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
            <UsersRound className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{unit.name}</p>
            <p className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Crown className="h-3 w-3 text-amber-500" aria-hidden="true" />
              Leader: {unit.leader?.name ?? 'Unassigned'}
            </p>
          </div>
        </div>
        {unit.submission ? (
          <p className="text-xs text-slate-600 sm:text-right">
            <span className="font-medium text-emerald-700">Acknowledged by {unit.submission.acknowledgedByName}</span>
            <br />
            {formatDateTime(unit.submission.acknowledgedAt)}
          </p>
        ) : (
          <p className="text-xs font-medium text-amber-700">Not yet submitted</p>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {unit.members.map((member) => (
          <span key={member.id} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-700">
            {member.name}
          </span>
        ))}
      </div>
    </li>
  );
}

export default function SubmissionList({ tracking, view, query }) {
  const units = (view === 'submitted' ? tracking.submitted : tracking.pending).filter((unit) => matchesQuery(unit, query));
  const isGroup = tracking.type === SUBMISSION_TYPES.GROUP;

  if (units.length === 0) {
    const emptyTitle = query
      ? 'No matches found'
      : view === 'submitted'
        ? `No ${isGroup ? 'groups' : 'students'} have submitted yet`
        : 'Everyone has submitted';
    return <EmptyState icon={Users} title={emptyTitle} description={query ? 'Try a different name or clear the search.' : undefined} />;
  }

  return (
    <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
      {units.map((unit) => (isGroup ? <GroupRow key={unit.id} unit={unit} /> : <IndividualRow key={unit.id} unit={unit} />))}
    </ul>
  );
}
