import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, BookOpen, Crown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getStudentAssignment } from '@/services/assignmentService';
import Badge from '@/components/common/Badge';
import { ErrorState, PageHeaderSkeleton, SkeletonBlock } from '@/components/common/StateViews';
import { StudentStatusBadge, SubmissionTypeBadge } from '@/components/assignments/StatusBadges';
import AcknowledgementPanel from '@/components/assignments/AcknowledgementPanel';
import OneDriveLinkButton from '@/components/assignments/OneDriveLinkButton';
import { formatDateTime, formatDeadline } from '@/utils/formatters';

export default function AssignmentDetailPage() {
  const { assignmentId } = useParams();
  const { user } = useAuth();
  const { data, loading, error, reload } = useAsyncData(() => getStudentAssignment(assignmentId, user.id), [assignmentId, user.id]);

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <PageHeaderSkeleton />
        <SkeletonBlock className="h-64 rounded-xl" />
      </div>
    );
  }

  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  const { assignment, course } = data;

  return (
    <div className="space-y-6">
      <Link to={`/student/courses/${course.id}/assignments`} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-navy-900">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to {course.code} assignments
      </Link>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <StudentStatusBadge assignment={assignment} />
          <SubmissionTypeBadge type={assignment.submissionType} />
          <Badge>{course.code}</Badge>
        </div>
        <h2 className="text-2xl font-semibold">{assignment.title}</h2>
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
              <p className="text-xs font-medium text-slate-500">Course</p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium">
                <BookOpen className="h-4 w-4 text-slate-400" aria-hidden="true" />
                {course.name}
              </p>
            </div>
          </div>
          {assignment.acknowledgedAt && (
            <div className="rounded-lg bg-emerald-50 p-4">
              <p className="text-xs font-medium text-emerald-700">Acknowledged</p>
              <p className="mt-1 text-sm font-medium text-emerald-800">
                {formatDateTime(assignment.acknowledgedAt)} by {assignment.acknowledgedByName}
              </p>
            </div>
          )}
          <OneDriveLinkButton href={assignment.oneDriveLink} />
        </section>

        <section className="space-y-4">
          <AcknowledgementPanel assignment={assignment} studentId={user.id} />
          {assignment.groupName && (
            <div className="card space-y-3 p-5">
              <h3 className="text-sm font-semibold">Your group</h3>
              <p className="inline-flex items-center gap-1.5 text-sm font-medium">
                <Crown className="h-4 w-4 text-amber-500" aria-hidden="true" />
                {assignment.groupName}
              </p>
              {assignment.leaderName && (
                <p className="text-xs text-slate-500">
                  {assignment.isLeader ? 'You are the group leader.' : `Leader: ${assignment.leaderName}`}
                </p>
              )}
              <Link
                to={`/student/groups/${course.id}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary-700 hover:text-primary-800"
              >
                Manage group
                <ArrowLeft className="h-3 w-3 rotate-180" aria-hidden="true" />
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
