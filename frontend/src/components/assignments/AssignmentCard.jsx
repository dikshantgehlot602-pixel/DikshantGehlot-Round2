import { Link } from 'react-router-dom';
import { CalendarDays, Pencil, ArrowRight } from 'lucide-react';
import Button, { buttonClasses } from '@/components/common/Button';
import SubmissionTracker from './SubmissionTracker';
import { ProfessorStatusBadge, SubmissionTypeBadge } from './StatusBadges';
import { formatDeadline } from '@/utils/formatters';

export default function AssignmentCard({ assignment, showCourse = false, onEdit }) {
  return (
    <article className="card flex flex-col gap-5 p-5 transition-shadow duration-200 hover:shadow-card-hover sm:flex-row sm:items-start">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <ProfessorStatusBadge status={assignment.status} />
          <SubmissionTypeBadge type={assignment.submissionType} />
          {showCourse && <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">{assignment.courseCode}</span>}
        </div>
        <div>
          <h3 className="text-base font-semibold leading-snug">{assignment.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-600">{assignment.description}</p>
        </div>
        <p className="inline-flex items-center gap-1.5 text-xs text-slate-600">
          <CalendarDays className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
          Due {formatDeadline(assignment.deadline)}
        </p>
        <SubmissionTracker tracking={assignment.tracking} />
      </div>

      <div className="flex shrink-0 gap-2 sm:w-40 sm:flex-col">
        <Link to={`/professor/assignments/${assignment.id}`} className={buttonClasses({ size: 'sm', fullWidth: true })}>
          View details
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Button variant="secondary" size="sm" icon={Pencil} fullWidth onClick={() => onEdit(assignment)}>
          Edit
        </Button>
      </div>
    </article>
  );
}

