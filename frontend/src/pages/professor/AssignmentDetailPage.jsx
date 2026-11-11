import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Pencil, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getProfessorAssignment } from '@/services/assignmentService';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { ErrorState, PageHeaderSkeleton, SkeletonBlock } from '@/components/common/StateViews';
import { inputClassName } from '@/components/common/FormField';
import SubmissionTracker from '@/components/assignments/SubmissionTracker';
import SubmissionList from '@/components/assignments/SubmissionList';
import OneDriveLinkButton from '@/components/assignments/OneDriveLinkButton';
import AssignmentEditorModal from '@/components/assignments/AssignmentEditorModal';
import { ProfessorStatusBadge, SubmissionTypeBadge } from '@/components/assignments/StatusBadges';
import { formatDateTime, formatDeadline } from '@/utils/formatters';

export default function AssignmentDetailPage() {
  const { assignmentId } = useParams();
  const { user } = useAuth();
  const { data, loading, error, reload } = useAsyncData(() => getProfessorAssignment(assignmentId, user.id), [assignmentId, user.id]);
  const [view, setView] = useState('submitted');
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(false);

  const counts = useMemo(() => {
    if (!data) return null;
    return { submitted: data.tracking.submitted.length, pending: data.tracking.pending.length };
  }, [data]);

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <PageHeaderSkeleton />
        <SkeletonBlock className="h-48 rounded-xl" />
        <SkeletonBlock className="h-80 rounded-xl" />
      </div>
    );
  }

  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  const { assignment, course, tracking } = data;
  const isGroup = assignment.submissionType === 'group';

  return (
    <div className="space-y-6">
      <Link to={`/professor/courses/${course.id}/assignments`} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-navy-900">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to {course.code} assignments
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <ProfessorStatusBadge status={assignment.status} />
            <SubmissionTypeBadge type={assignment.submissionType} />
            <Badge>{course.code}</Badge>
          </div>
          <h2 className="text-2xl font-semibold">{assignment.title}</h2>
        </div>
        <Button variant="secondary" icon={Pencil} onClick={() => setEditing(true)} className="shrink-0">
          Edit assignment
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card space-y-5 p-5 sm:p-6 lg:col-span-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-500">Description</h3>
            <p className="mt-2 whitespace-pre-line text-sm leading-[1.5] text-navy-900">{assignment.description}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">Deadline</p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium">
                <CalendarDays className="h-4 w-4 text-slate-400" aria-hidden="true" />
                {formatDeadline(assignment.deadline)}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">Last updated</p>
              <p className="mt-1 text-sm font-medium">{formatDateTime(assignment.updatedAt)}</p>
            </div>
          </div>
          <OneDriveLinkButton href={assignment.oneDriveLink} />
        </section>

        <section className="card space-y-4 p-5 sm:p-6">
          <h3 className="text-sm font-semibold">Submission progress</h3>
          <p className="text-3xl font-semibold tabular-nums">{tracking.percent}%</p>
          <SubmissionTracker tracking={tracking} />
          <p className="text-xs text-slate-500">
            {isGroup ? 'Counts groups in this course that have an acknowledged submission.' : 'Counts enrolled students who have acknowledged their submission.'}
          </p>
        </section>
      </div>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div role="tablist" aria-label="Submission status" className="inline-flex rounded-lg bg-slate-100 p-1">
            {[
              { id: 'submitted', label: 'Submitted', count: counts.submitted },
              { id: 'pending', label: 'Pending', count: counts.pending },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={view === tab.id}
                onClick={() => setView(tab.id)}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all duration-150 ${
                  view === tab.id ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                {tab.label} <span className="ml-1 text-xs text-slate-500">{tab.count}</span>
              </button>
            ))}
          </div>
          <div className="relative sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={isGroup ? 'Search group, leader or member' : 'Search student name or email'}
              aria-label="Search submissions"
              className={`${inputClassName(false)} pl-9`}
            />
          </div>
        </div>
        <SubmissionList tracking={tracking} view={view} query={query.trim()} />
      </section>

      <AssignmentEditorModal open={editing} professorId={user.id} courseId={course.id} assignment={assignment} onClose={() => setEditing(false)} />
    </div>
  );
}
