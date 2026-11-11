import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ClipboardList, Plus, Send, Hourglass } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAsyncData } from '@/hooks/useAsyncData';
import { listCourseAssignments } from '@/services/assignmentService';
import Button from '@/components/common/Button';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import { CardGridSkeleton, EmptyState, ErrorState, PageHeaderSkeleton } from '@/components/common/StateViews';
import AssignmentCard from '@/components/assignments/AssignmentCard';
import AssignmentEditorModal from '@/components/assignments/AssignmentEditorModal';

export default function CourseAssignmentsPage() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const { data, loading, error, reload } = useAsyncData(() => listCourseAssignments(courseId, user.id), [courseId, user.id]);
  const [editorState, setEditorState] = useState({ open: false, assignment: null });

  const totals = useMemo(() => {
    if (!data) return { submitted: 0, pending: 0 };
    return data.assignments.reduce(
      (sum, assignment) => ({
        submitted: sum.submitted + assignment.tracking.submittedCount,
        pending: sum.pending + assignment.tracking.pendingCount,
      }),
      { submitted: 0, pending: 0 }
    );
  }, [data]);

  const openEditor = (assignment = null) => setEditorState({ open: true, assignment });
  const closeEditor = () => setEditorState({ open: false, assignment: null });

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <PageHeaderSkeleton />
        <CardGridSkeleton count={2} />
      </div>
    );
  }

  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  const { course, assignments } = data;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Assignments"
        description={`${course.name} · ${course.code}`}
        actions={
          <Button icon={Plus} onClick={() => openEditor()}>
            Create assignment
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total assignments" value={assignments.length} icon={ClipboardList} />
        <StatCard label="Submitted" value={totals.submitted} hint="Across all assignments" icon={Send} tone="success" />
        <StatCard label="Pending" value={totals.pending} hint="Across all assignments" icon={Hourglass} tone="warning" />
      </div>

      {assignments.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No assignments have been created for this course."
          description="Create the first assignment to start tracking student submissions."
          action={<Button icon={Plus} onClick={() => openEditor()}>Create assignment</Button>}
        />
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} onEdit={openEditor} />
          ))}
        </div>
      )}

      <AssignmentEditorModal
        open={editorState.open}
        professorId={user.id}
        courseId={courseId}
        assignment={editorState.assignment}
        onClose={closeEditor}
      />
    </div>
  );
}
