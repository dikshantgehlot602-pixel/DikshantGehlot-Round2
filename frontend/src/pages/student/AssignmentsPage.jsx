import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ClipboardList, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAsyncData } from '@/hooks/useAsyncData';
import { listStudentAssignments } from '@/services/assignmentService';
import { getStudentCourse } from '@/services/courseService';
import PageHeader from '@/components/common/PageHeader';
import { CardGridSkeleton, EmptyState, ErrorState, PageHeaderSkeleton } from '@/components/common/StateViews';
import StudentAssignmentCard from '@/components/assignments/StudentAssignmentCard';
import { inputClassName } from '@/components/common/FormField';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'pending', label: 'Pending' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'needs-group', label: 'Needs group' },
];

const SORT_OPTIONS = [
  { value: 'deadline-asc', label: 'Deadline (soonest first)' },
  { value: 'deadline-desc', label: 'Deadline (latest first)' },
  { value: 'title', label: 'Title (A to Z)' },
];

export default function AssignmentsPage() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const isScoped = Boolean(courseId);

  const { data: allAssignments, loading: loadingAssignments, error: assignmentError, reload } = useAsyncData(
    () => listStudentAssignments(user.id),
    [user.id]
  );
  const { data: course, loading: loadingCourse, error: courseError } = useAsyncData(
    () => (isScoped ? getStudentCourse(courseId, user.id) : Promise.resolve(null)),
    [courseId, user.id]
  );

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [sort, setSort] = useState('deadline-asc');

  const courseOptions = useMemo(() => {
    const seen = new Map();
    (allAssignments ?? []).forEach((item) => seen.set(item.courseId, { id: item.courseId, code: item.courseCode, name: item.courseName }));
    return [...seen.values()];
  }, [allAssignments]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = (allAssignments ?? []).filter((item) => {
      if (isScoped && item.courseId !== courseId) return false;
      if (courseFilter !== 'all' && item.courseId !== courseFilter) return false;
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (term && !`${item.title} ${item.courseName} ${item.courseCode}`.toLowerCase().includes(term)) return false;
      return true;
    });

    return [...list].sort((first, second) => {
      if (sort === 'title') return first.title.localeCompare(second.title);
      const diff = new Date(first.deadline) - new Date(second.deadline);
      return sort === 'deadline-desc' ? -diff : diff;
    });
  }, [allAssignments, courseId, isScoped, courseFilter, statusFilter, search, sort]);

  const loading = loadingAssignments || (isScoped && loadingCourse);
  const error = assignmentError || courseError;

  if (loading && !allAssignments) {
    return (
      <div className="space-y-8">
        <PageHeaderSkeleton />
        <CardGridSkeleton count={3} />
      </div>
    );
  }

  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  const heading = isScoped ? `${course?.code ?? ''} assignments` : 'My assignments';
  const subheading = isScoped
    ? course?.name ?? 'Assignments for this course'
    : 'Everything you need to submit across your enrolled courses.';

  return (
    <div className="space-y-6">
      <PageHeader title={heading} description={subheading} />

      <div className="card grid gap-3 p-4 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search assignments or courses"
            aria-label="Search assignments"
            className={`${inputClassName(false)} pl-9`}
          />
        </div>
        {!isScoped && (
          <select aria-label="Filter by course" value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)} className={inputClassName(false)}>
            <option value="all">All courses</option>
            {courseOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.code}
              </option>
            ))}
          </select>
        )}
        <select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className={inputClassName(false)}>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select aria-label="Sort assignments" value={sort} onChange={(event) => setSort(event.target.value)} className={inputClassName(false)}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {allAssignments && allAssignments.length === 0 && (
        <EmptyState icon={ClipboardList} title="No assignments yet" description="Your professors have not posted any assignments in your courses." />
      )}

      {allAssignments && allAssignments.length > 0 && filtered.length === 0 && (
        <EmptyState icon={Search} title="No assignments match these filters" description="Adjust the filters or clear the search to see more." />
      )}

      {filtered.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((assignment) => (
            <StudentAssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </div>
      )}
    </div>
  );
}
