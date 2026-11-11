import { CircleCheck, TriangleAlert, Clock, UserRound, UsersRound, Hourglass } from 'lucide-react';
import Badge from '@/components/common/Badge';
import { SUBMISSION_TYPES } from '@/utils/constants';

export function ProfessorStatusBadge({ status }) {
  if (status === 'complete') return <Badge tone="success" icon={CircleCheck}>Complete</Badge>;
  if (status === 'overdue') return <Badge tone="danger" icon={TriangleAlert}>Overdue</Badge>;
  return <Badge tone="primary" icon={Clock}>Open</Badge>;
}

export function StudentStatusBadge({ assignment }) {
  if (assignment.isSubmitted) return <Badge tone="success" icon={CircleCheck}>Submitted</Badge>;
  if (assignment.isOverdue) return <Badge tone="danger" icon={TriangleAlert}>Overdue</Badge>;
  if (assignment.needsGroup) return <Badge tone="warning" icon={UsersRound}>Needs group</Badge>;
  return <Badge tone="neutral" icon={Hourglass}>Pending</Badge>;
}

export function SubmissionTypeBadge({ type }) {
  if (type === SUBMISSION_TYPES.GROUP) return <Badge tone="primary" icon={UsersRound}>Group</Badge>;
  return <Badge tone="neutral" icon={UserRound}>Individual</Badge>;
}
