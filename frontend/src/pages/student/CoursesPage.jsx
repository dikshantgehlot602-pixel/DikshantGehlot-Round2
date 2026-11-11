import { BookOpen } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAsyncData } from '@/hooks/useAsyncData';
import { listStudentCourses } from '@/services/courseService';
import PageHeader from '@/components/common/PageHeader';
import { CardGridSkeleton, EmptyState, ErrorState, PageHeaderSkeleton } from '@/components/common/StateViews';
import CourseCard from '@/components/courses/CourseCard';
import { pluralize } from '@/utils/formatters';

export default function CoursesPage() {
  const { user } = useAuth();
  const { data: courses, loading, error, reload } = useAsyncData(() => listStudentCourses(user.id), [user.id]);

  if (loading && !courses) {
    return (
      <div className="space-y-8">
        <PageHeaderSkeleton />
        <CardGridSkeleton count={3} />
      </div>
    );
  }

  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  return (
    <div className="space-y-8">
      <PageHeader title="My courses" description="Every course you are enrolled in, with your submission progress so far." />
      {courses.length === 0 ? (
        <EmptyState icon={BookOpen} title="No courses yet" description="You will see your courses here once a professor enrols you." />
      ) : (
        <>
          <p className="text-sm text-slate-500">{pluralize(courses.length, 'course')}</p>
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
        </>
      )}
    </div>
  );
}
