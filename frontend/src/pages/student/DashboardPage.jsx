import { BookOpen, CircleCheck, ClipboardList, Hourglass } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getStudentDashboard } from '@/services/dashboardService';
import PageHeader from '@/components/common/PageHeader';
import { CardGridSkeleton, EmptyState, ErrorState, PageHeaderSkeleton } from '@/components/common/StateViews';
import StatCard from '@/components/dashboard/StatCard';
import CourseCard from '@/components/courses/CourseCard';
import StudentAssignmentCard from '@/components/assignments/StudentAssignmentCard';
import { pluralize } from '@/utils/formatters';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useAsyncData(() => getStudentDashboard(user.id), [user.id]);

  if (loading && !data) {
    return (
      <div className="space-y-8">
        <PageHeaderSkeleton />
        <CardGridSkeleton count={4} />
        <CardGridSkeleton count={3} />
      </div>
    );
  }

  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  const { stats, courses, upcoming } = data;
  const firstName = user.name.split(' ')[0];

  return (
    <div className="space-y-8">
      <PageHeader title={`Welcome back, ${firstName}`} description="Track your courses, deadlines and acknowledgements in one place." />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Summary">
        <StatCard label="Enrolled courses" value={stats.enrolledCourses} icon={BookOpen} tone="primary" />
        <StatCard label="Total assignments" value={stats.totalAssignments} icon={ClipboardList} tone="primary" />
        <StatCard label="Submitted" value={stats.submittedAssignments} icon={CircleCheck} tone="success" />
        <StatCard label="Pending" value={stats.pendingAssignments} icon={Hourglass} tone="warning" />
      </section>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h3 className="text-lg font-semibold">Your courses</h3>
          <span className="text-sm text-slate-500">{pluralize(courses.length, 'course')}</span>
        </div>
        {courses.length === 0 ? (
          <EmptyState icon={BookOpen} title="No courses yet" description="You will see your courses here once a professor enrols you." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                to={`/student/courses/${course.id}/assignments`}
                ctaLabel="View assignments"
                professorLine={`Taught by ${course.professorName}`}
                progress={course.progress}
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h3 className="text-lg font-semibold">Needs your attention</h3>
          <span className="text-sm text-slate-500">{pluralize(upcoming.length, 'open item')}</span>
        </div>
        {upcoming.length === 0 ? (
          <EmptyState
            icon={CircleCheck}
            title="You are all caught up"
            description="Every assignment you can currently submit has been acknowledged."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {upcoming.map((assignment) => (
              <StudentAssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
