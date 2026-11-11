import { BookOpen } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAsyncData } from '@/hooks/useAsyncData';
import { listProfessorCourses } from '@/services/courseService';
import PageHeader from '@/components/common/PageHeader';
import { CardGridSkeleton, EmptyState, ErrorState, PageHeaderSkeleton } from '@/components/common/StateViews';
import CourseCard from '@/components/courses/CourseCard';

export default function CoursesPage() {
  const { user } = useAuth();
  const { data: courses, loading, error, reload } = useAsyncData(() => listProfessorCourses(user.id), [user.id]);

  return (
    <div className="space-y-6">
      <PageHeader title="My Courses" description="Courses you teach. Open one to manage its assignments and submissions." />

      {loading && !courses && (
        <div className="space-y-6">
          <PageHeaderSkeleton />
          <CardGridSkeleton count={3} />
        </div>
      )}
      {error && <ErrorState message="We could not load your courses." onRetry={reload} />}
      {courses && courses.length === 0 && (
        <EmptyState icon={BookOpen} title="You don't have any courses yet." description="Once a course is assigned to you, it will be listed here." />
      )}
      {courses && courses.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              to={`/professor/courses/${course.id}/assignments`}
              ctaLabel="View assignments"
            />
          ))}
        </div>
      )}
    </div>
  );
}
