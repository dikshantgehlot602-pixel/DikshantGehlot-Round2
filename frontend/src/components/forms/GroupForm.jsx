import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/common/Button';
import { FormField, inputClassName } from '@/components/common/FormField';
import { groupSchema } from '@/utils/validationSchemas';

export default function GroupForm({ submitting, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(groupSchema),
    defaultValues: { name: '' },
  });

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values.name))} className="space-y-5" noValidate>
      <FormField
        label="Group name"
        htmlFor="groupName"
        error={errors.name?.message}
        hint="You will become the group leader and the only member who can submit group work."
      >
        <input id="groupName" placeholder="e.g. Team Pixel" className={inputClassName(Boolean(errors.name))} {...register('name')} />
      </FormField>
      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          Create group
        </Button>
      </div>
    </form>
  );
}
