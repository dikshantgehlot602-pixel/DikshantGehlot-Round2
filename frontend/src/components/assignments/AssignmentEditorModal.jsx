import { useState } from 'react';
import { toast } from 'sonner';
import Modal from '@/components/common/Modal';
import AssignmentForm from '@/components/forms/AssignmentForm';
import { createAssignment, updateAssignment } from '@/services/assignmentService';
import { getErrorMessage } from '@/services/apiClient';

export default function AssignmentEditorModal({ open, professorId, courseId, assignment, onClose }) {
  const [saving, setSaving] = useState(false);
  const isEditing = Boolean(assignment);
  const hasSubmissions = isEditing && assignment.tracking.submittedCount > 0;

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      if (isEditing) {
        await updateAssignment(assignment.id, professorId, values);
        toast.success('Assignment updated. Existing submissions were kept.');
      } else {
        await createAssignment(professorId, courseId, values);
        toast.success('Assignment created and published to students.');
      }
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      size="lg"
      title={isEditing ? 'Edit assignment' : 'Create assignment'}
      description={isEditing ? 'Changes apply immediately. Submission records are preserved.' : 'Students in this course will see it straight away.'}
      onClose={onClose}
    >
      <AssignmentForm
        key={assignment?.id ?? 'new'}
        assignment={assignment}
        hasSubmissions={hasSubmissions}
        submitting={saving}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
}
