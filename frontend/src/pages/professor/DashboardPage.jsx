import { Link } from 'react-router-dom';
import { BookOpen, ClipboardList, CheckCheck, Hourglass, Activity, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getProfessorDashboard } from '@/services/dashboardService';
import PageHeader from '@/components/common/PageHeader';
import { CardGridSkeleton, EmptyState, ErrorState, PageHeaderSkeleton, SkeletonBlock } from '@/components/common/StateViews';
import StatCard from '@/components/dashboard/StatCard';
import CourseCard from '@/components/courses/CourseCard';
import ProgressBar from '@/components/common/ProgressBar';
import { ProfessorStatusBadge, SubmissionTypeBadge } from '@/components/assignments/StatusBadges';
import { formatDeadline, formatRelativeToNow, pluralize } from '@/utils/formatters';

function SectionCard({ title, action, children }) {
  return (
    <section className="card p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <SkeletonBlock key={index} className="h-28 rounded-xl" />
        ))}
      </div>
      <CardGridSkeleton count={3} />
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useAsyncData(() => getProfessorDashboard(user.id), [user.id]);

  if (loading && !data) return <DashboardSkeleton />;
  if (error) return <ErrorState message="We could not load your dashboard right now." onRetry={reload} />;

  const { stats, courses, recentAssignments, submissionOverview, activity } = data;

  return (
    <div className="space-y-8">
      <PageHeader title={`Welcome back, ${user.name}`} description="Here is what is happening across your courses today." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total courses" value={stats.totalCourses} icon={BookOpen} />
        <StatCard label="Total assignments" value={stats.totalAssignments} icon={ClipboardList} tone="success" />
        <StatCard label="Total submissions" value={stats.totalSubmissions} hint="Students or groups acknowledged" icon={CheckCheck} tone="success" />
        <StatCard label="Pending submissions" value={stats.pendingSubmissions} hint="Still awaiting acknowledgement" icon={Hourglass} tone="warning" />
      </div>

      <section className="space-y-4">
        <h3 className="text-base font-semibold">My Courses</h3>
        {courses.length === 0 ? (
          <EmptyState icon={BookOpen} title="You don't have any courses yet." description="Courses assigned to you will appear here." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                to={`/professor/courses/${course.id}/assignments`}
                ctaLabel="View course"
              />
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <SectionCard title="Recent assignments">
            {recentAssignments.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">No assignments have been created yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {recentAssignments.map((assignment) => (
                  <li key={assignment.id}>
                    <Link to={`/professor/assignments/${assignment.id}`} className="flex flex-col gap-2 py-3.5 transition-colors hover:text-primary-700 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{assignment.title}</p>
                        <p className="text-xs text-slate-500">
                          {assignment.courseCode} · Due {formatDeadline(assignment.deadline)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <SubmissionTypeBadge type={assignment.submissionType} />
                        <ProfessorStatusBadge status={assignment.status} />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard title="Submission overview">
            {submissionOverview.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">Submission progress appears once you create an assignment.</p>
            ) : (
              <div className="space-y-5">
                {submissionOverview.map((assignment) => (
                  <Link key={assignment.id} to={`/professor/assignments/${assignment.id}`} className="block space-y-2 rounded-lg transition-colors hover:text-primary-700">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="truncate font-medium">{assignment.title}</span>
                      <span className="shrink-0 text-xs text-slate-500">
                        {assignment.tracking.submittedCount} of {pluralize(assignment.tracking.total, assignment.tracking.type === 'group' ? 'group' : 'student')}
                      </span>
                    </div>
                    <ProgressBar value={assignment.tracking.percent} barClassName="bg-primary-600" />
                  </Link>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        <SectionCard title="Recent activity">
          {activity.length === 0 ? (
            <EmptyState icon={Activity} title="No activity yet" description="Acknowledgements from students will show up here." />
          ) : (
            <ol className="relative space-y-5 border-l border-slate-200 pl-5">
              {activity.map((item) => (
                <li key={item.id} className="relative">
                  <span className="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary-500 ring-4 ring-white" />
                  <p className="text-sm font-medium">{item.message}</p>
                  <p className="text-xs text-slate-500">{item.detail}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{formatRelativeToNow(item.at)}</p>
                </li>
              ))}
            </ol>
          )}
          <Link to="/professor/assignments" className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary-700 hover:text-primary-800">
            View all assignments
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </SectionCard>
      </div>
    </div>
  );
}
