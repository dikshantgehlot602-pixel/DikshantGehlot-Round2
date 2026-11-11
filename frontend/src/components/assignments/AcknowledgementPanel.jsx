import { useState } from 'react';
import { toast } from 'sonner';
import { CheckCircle2, Lock, UsersRound, CircleCheckBig } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { acknowledgeGroupSubmission, acknowledgeIndividualSubmission } from '@/services/submissionService';
import { getErrorMessage } from '@/services/apiClient';
import { SUBMISSION_TYPES } from '@/utils/constants';
import { formatDateTime } from '@/utils/formatters';

function SubmittedBanner({ assignment }) {
  const isGroup = assignment.submissionType === SUBMISSION_TYPES.GROUP;
  return (
    <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 animate-scale-in">
      <CircleCheckBig className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
      <div>
        <p className="text-sm font-semibold text-emerald-800">Submitted</p>
        <p className="mt-0.5 text-sm text-emerald-700">
          {isGroup ? `Acknowledged by ${assignment.acknowledgedByName} on ` : 'Acknowledged on '}
          {formatDateTime(assignment.acknowledgedAt)}
        </p>
      </div>
    </div>
  );
}

export default function AcknowledgementPanel({ assignment, studentId }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const isGroup = assignment.submissionType === SUBMISSION_TYPES.GROUP;

  if (assignment.isSubmitted) return <SubmittedBanner assignment={assignment} />;

  if (isGroup && assignment.needsGroup) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <UsersRound className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
          <p className="text-sm text-amber-900">You are not part of any group. Create or join one to submit this assignment.</p>
        </div>
        <Link to={`/student/groups/${assignment.courseId}`} className="shrink-0 text-sm font-medium text-primary-700 hover:text-primary-800">
          Go to my group
        </Link>
      </div>
    );
  }

  if (isGroup && !assignment.isLeader) {
    return (
      <div className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-5">
        <Lock className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-navy-900">Only your group leader can acknowledge this submission</p>
          <p className="mt-1 text-sm text-slate-600">
            Leader: <span className="font-medium text-navy-900">{assignment.leaderName}</span>. Once they confirm the upload, your status updates automatically.
          </p>
        </div>
      </div>
    );
  }

  const isIndividual = !isGroup;
  const buttonLabel = isIndividual ? 'Yes, I have submitted' : 'Yes, our group has submitted';
  const confirmText = isIndividual
    ? 'You confirm that your work has been uploaded to the OneDrive folder for this assignment.'
    : `You confirm that ${assignment.groupName} has uploaded its work to the OneDrive folder. Every group member will see this acknowledgement.`;

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      if (isIndividual) {
        await acknowledgeIndividualSubmission(assignment.id, studentId);
        toast.success('Submission acknowledged. Your professor can now see it.');
      } else {
        await acknowledgeGroupSubmission(assignment.id, studentId);
        toast.success(`${assignment.groupName} is marked as submitted for every member.`);
      }
      setConfirmOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-primary-100 bg-primary-50/50 p-5">
      <div>
        <p className="text-sm font-semibold text-navy-900">Ready to acknowledge?</p>
        <p className="mt-1 text-sm text-slate-600">
          {isIndividual
            ? 'Upload your work to the OneDrive folder first, then confirm here.'
            : 'As group leader, confirm once your group has uploaded its work to the OneDrive folder.'}
        </p>
      </div>
      <Button icon={CheckCircle2} onClick={() => setConfirmOpen(true)}>
        {buttonLabel}
      </Button>

      <ConfirmDialog
        open={confirmOpen}
        title="Confirm submission"
        description={assignment.title}
        confirmLabel="Confirm submission"
        loading={submitting}
        onConfirm={handleConfirm}
        onClose={() => setConfirmOpen(false)}
      >
        <p className="text-sm text-slate-700">{confirmText}</p>
        <p className="mt-3 text-xs text-slate-500">The current date and time will be saved and cannot be changed.</p>
      </ConfirmDialog>
    </div>
  );
}
