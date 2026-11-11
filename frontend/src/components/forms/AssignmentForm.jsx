import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import Button from '@/components/common/Button';
import { FormField, inputClassName } from '@/components/common/FormField';
import { SUBMISSION_TYPE_LABELS, SUBMISSION_TYPES } from '@/utils/constants';
import { splitDeadline, toDeadlineIso } from '@/utils/formatters';
import { assignmentSchema } from '@/utils/validationSchemas';

const EMPTY_VALUES = {
  title: '',
  description: '',
  deadlineDate: '',
  deadlineTime: '23:59',
  oneDriveLink: '',
  submissionType: undefined,
};

function toFormValues(assignment) {
  if (!assignment) return EMPTY_VALUES;
  const { date, time } = splitDeadline(assignment.deadline);
  return {
    title: assignment.title,
    description: assignment.description,
    deadlineDate: date,
    deadlineTime: time,
    oneDriveLink: assignment.oneDriveLink,
    submissionType: assignment.submissionType,
  };
}

export default function AssignmentForm({ assignment, hasSubmissions, submitting, onSubmit, onCancel }) {
  const isEditing = Boolean(assignment);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(assignmentSchema),
    defaultValues: toFormValues(assignment),
  });

  useEffect(() => {
    reset(toFormValues(assignment));
  }, [assignment, reset]);

  const submit = (values) => {
    const deadline = toDeadlineIso(values.deadlineDate, values.deadlineTime);
    if (!deadline) {
      setError('deadlineDate', { message: 'Enter a valid deadline date and time.' });
      return;
    }
    onSubmit({
      title: values.title,
      description: values.description,
      deadline,
      oneDriveLink: values.oneDriveLink,
      submissionType: values.submissionType,
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
      <FormField label="Assignment title" htmlFor="title" error={errors.title?.message}>
        <input id="title" placeholder="e.g. Responsive Portfolio Page" className={inputClassName(Boolean(errors.title))} {...register('title')} />
      </FormField>

      <FormField label="Description" htmlFor="description" error={errors.description?.message}>
        <textarea
          id="description"
          rows={4}
          placeholder="Explain what students need to deliver and how it will be assessed."
          className={`${inputClassName(Boolean(errors.description))} resize-y`}
          {...register('description')}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Deadline date" htmlFor="deadlineDate" error={errors.deadlineDate?.message}>
          <input id="deadlineDate" type="date" className={inputClassName(Boolean(errors.deadlineDate))} {...register('deadlineDate')} />
        </FormField>
        <FormField label="Deadline time" htmlFor="deadlineTime" error={errors.deadlineTime?.message}>
          <input id="deadlineTime" type="time" className={inputClassName(Boolean(errors.deadlineTime))} {...register('deadlineTime')} />
        </FormField>
      </div>

      <FormField label="OneDrive link" htmlFor="oneDriveLink" error={errors.oneDriveLink?.message} hint="Students open this folder to upload their work.">
        <input
          id="oneDriveLink"
          type="url"
          placeholder="https://1drv.ms/f/s!..."
          className={inputClassName(Boolean(errors.oneDriveLink))}
          {...register('oneDriveLink')}
        />
      </FormField>

      <FormField
        label="Submission type"
        htmlFor="submissionType"
        error={errors.submissionType?.message}
        hint={hasSubmissions ? 'Locked because students have already submitted for this assignment.' : undefined}
      >
        <select id="submissionType" disabled={hasSubmissions} className={inputClassName(Boolean(errors.submissionType))} {...register('submissionType')}>
          <option value="">Select a type</option>
          {Object.values(SUBMISSION_TYPES).map((type) => (
            <option key={type} value={type}>
              {SUBMISSION_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
      </FormField>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {isEditing ? 'Save changes' : 'Create assignment'}
        </Button>
      </div>
    </form>
  );
}
