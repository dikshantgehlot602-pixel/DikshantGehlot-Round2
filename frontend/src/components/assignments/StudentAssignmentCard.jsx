import { Link } from 'react-router-dom';
import { CalendarDays, CircleCheck, CircleCheckBig, Clock } from 'lucide-react';
import { buttonClasses } from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { StudentStatusBadge, SubmissionTypeBadge } from './StatusBadges';
import OneDriveLinkButton from './OneDriveLinkButton';
import { SUBMISSION_TYPES } from '@/utils/constants';
import { formatDateTime, formatDeadline } from '@/utils/formatters';

export default function StudentAssignmentCard({ assignment }) {
  const isGroup = assignment.submissionType === SUBMISSION_TYPES.GROUP;
  return (
    <article
      className={`card flex flex-col gap-4 p-5 transition-shadow duration-200 hover:shadow-card-hover ${
        assignment.isOverdue ? 'border-rose-200 ring-1 ring-rose-100' : ''
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <StudentStatusBadge assignment={assignment} />
        <SubmissionTypeBadge type={assignment.submissionType} />
        <Badge>{assignment.courseCode}</Badge>
      </div>

      <div className="min-w-0 flex-1 space-y-1.5">
        <h3 className="text-base font-semibold leading-snug">{assignment.title}</h3>
        <p className="line-clamp-2 text-sm text-slate-600">{assignment.description}</p>
      </div>

      <div className="space-y-2 text-xs text-slate-600">
        <p className={`inline-flex items-center gap-1.5 ${assignment.isOverdue ? 'font-medium text-rose-700' : ''}`}>
          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
          Due {formatDeadline(assignment.deadline)}
        </p>
        {assignment.acknowledgedAt && (
          <p className="inline-flex items-center gap-1.5 text-emerald-700">
            <CircleCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Acknowledged on {formatDateTime(assignment.acknowledgedAt)}
          </p>
        )}
        {isGroup && assignment.groupName && (
          <p className="inline-flex items-center gap-1.5">
            <CircleCheckBig className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            {assignment.groupName}
          </p>
        )}
        {!assignment.isSubmitted && !assignment.isOverdue && (
          <p className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            {assignment.canAcknowledge ? 'Ready for your acknowledgement' : 'Awaiting acknowledgement'}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        <Link to={`/student/assignments/${assignment.id}`} className={buttonClasses({ size: 'sm' })}>
          View details
        </Link>
        <OneDriveLinkButton href={assignment.oneDriveLink} />
      </div>
    </article>
  );
}
