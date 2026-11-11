import { useMemo, useState } from 'react';
import { Search, ClipboardList } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAsyncData } from '@/hooks/useAsyncData';
import { listProfessorAssignments } from '@/services/assignmentService';
import PageHeader from '@/components/common/PageHeader';
import { CardGridSkeleton, EmptyState, ErrorState, PageHeaderSkeleton } from '@/components/common/StateViews';
import AssignmentCard from '@/components/assignments/AssignmentCard';
import AssignmentEditorModal from '@/components/assignments/AssignmentEditorModal';
import { inputClassName } from '@/components/common/FormField';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'open', label: 'Open' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'complete', label: 'Complete' },
];

const DEADLINE_OPTIONS = [
  { value: 'all', label: 'Any deadline' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'passed', label: 'Deadline passed' },
];

export default function AssignmentsPage() {
  const { user } = useAuth();
  const { data: assignments, loading, error, reload } = useAsyncData(() => listProfessorAssignments(user.id), [user.id]);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deadlineFilter, setDeadlineFilter] = useState('all');
  const [editorState, setEditorState] = useState({ open: false, assignment: null });

  const courseOptions = useMemo(() => {
    const seen = new Map();
    (assignments ?? []).forEach((item) => seen.set(item.courseId, item.courseCode));
    return [...seen.entries()].map(([id, code]) => ({ id, code }));
  }, [assignments]);

  const filtered = useMemo(() => {
    const now = Date.now();
    const term = search.trim().toLowerCase();
    return (assignments ?? []).filter((item) => {
      if (term && !`${item.title} ${item.courseName} ${item.courseCode}`.toLowerCase().includes(term)) return false;
      if (courseFilter !== 'all' && item.courseId !== courseFilter) return false;
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      const passed = Date.parse(item.deadline) < now;
      if (deadlineFilter === 'upcoming' && passed) return false;
      if (deadlineFilter === 'passed' && !passed) return false;
      return true;
    });
  }, [assignments, search, courseFilter, statusFilter, deadlineFilter]);

  const openEditor = (assignment) => setEditorState({ open: true, assignment });
  const closeEditor = () => setEditorState({ open: false, assignment: null });

  return (
    <div className="space-y-6">
      <PageHeader title="Assignments" description="Every assignment across your courses, with live submission progress." />

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
        <select aria-label="Filter by course" value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)} className={inputClassName(false)}>
          <option value="all">All courses</option>
          {courseOptions.map((course) => (
            <option key={course.id} value={course.id}>
              {course.code}
            </option>
          ))}
        </select>
        <select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className={inputClassName(false)}>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select aria-label="Filter by deadline" value={deadlineFilter} onChange={(event) => setDeadlineFilter(event.target.value)} className={inputClassName(false)}>
          {DEADLINE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {loading && !assignments && (
        <div className="space-y-6">
          <PageHeaderSkeleton />
          <CardGridSkeleton count={2} />
        </div>
      )}
      {error && <ErrorState message="We could not load assignments." onRetry={reload} />}

      {assignments && assignments.length === 0 && (
        <EmptyState icon={ClipboardList} title="No assignments yet" description="Open one of your courses to create the first assignment." />
      )}

      {assignments && assignments.length > 0 && filtered.length === 0 && (
        <EmptyState icon={Search} title="No assignments match these filters" description="Adjust the filters or clear the search to see more." />
      )}

      {filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} showCourse onEdit={openEditor} />
          ))}
        </div>
      )}

      <AssignmentEditorModal
        open={editorState.open}
        professorId={user.id}
        courseId={editorState.assignment?.courseId}
        assignment={editorState.assignment}
        onClose={closeEditor}
      />
    </div>
  );
}
