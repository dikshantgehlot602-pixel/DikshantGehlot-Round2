import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Plus, LogIn, LogOut, Crown, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAsyncData } from '@/hooks/useAsyncData';
import {
  getCourseGroupsOverview,
  createGroup as createGroupService,
  joinGroup as joinGroupService,
  leaveGroup as leaveGroupService,
} from '@/services/groupService';
import { getErrorMessage } from '@/services/apiClient';
import PageHeader from '@/components/common/PageHeader';
import Button, { buttonClasses } from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { ErrorState, PageHeaderSkeleton, SkeletonBlock } from '@/components/common/StateViews';
import { inputClassName } from '@/components/common/FormField';
import GroupForm from '@/components/forms/GroupForm';
import { formatDateTime } from '@/utils/formatters';

export default function CourseGroupPage() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const { data, loading, error, reload } = useAsyncData(() => getCourseGroupsOverview(courseId, user.id), [courseId, user.id]);

  const [createOpen, setCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [joinQuery, setJoinQuery] = useState('');

  const handleCreate = async (name) => {
    setSubmitting(true);
    try {
      await createGroupService(courseId, user.id, name);
      toast.success('Group created. You are the leader.');
      setCreateOpen(false);
    } catch (createError) {
      toast.error(getErrorMessage(createError));
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoin = async (groupId) => {
    try {
      await joinGroupService(groupId, user.id);
      toast.success('You joined the group.');
    } catch (joinError) {
      toast.error(getErrorMessage(joinError));
    }
  };

  const handleLeave = async () => {
    setSubmitting(true);
    try {
      await leaveGroupService(courseId, user.id);
      toast.success('You left the group.');
      setLeaveOpen(false);
    } catch (leaveError) {
      toast.error(getErrorMessage(leaveError));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <PageHeaderSkeleton />
        <SkeletonBlock className="h-40 rounded-xl" />
        <SkeletonBlock className="h-64 rounded-xl" />
      </div>
    );
  }

  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  const { course, myGroup, groups } = data;
  const joinableGroups = groups.filter((group) => !group.isMine);
  const term = joinQuery.trim().toLowerCase();
  const filteredJoinable = joinableGroups.filter(
    (group) => !term || `${group.name} ${group.leader?.name ?? ''}`.toLowerCase().includes(term)
  );

  return (
    <div className="space-y-6">
      <Link to="/student/groups" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-navy-900">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to my groups
      </Link>

      <PageHeader title={`${course.code} groups`} description={course.name} />

      <section className="card space-y-4 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold">My group</h3>
          {!myGroup && (
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" icon={Plus} onClick={() => setCreateOpen(true)}>
                Create group
              </Button>
            </div>
          )}
        </div>

        {!myGroup ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm text-amber-900">
              You are not part of any group. Create or join one to submit this assignment.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button size="sm" icon={Plus} onClick={() => setCreateOpen(true)}>
                Create group
              </Button>
              <a href="#join-list" className={buttonClasses({ variant: 'secondary', size: 'sm' })}>
                Join group
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-semibold">{myGroup.name}</h4>
                <p className="text-xs text-slate-500">Created {formatDateTime(myGroup.createdAt)}</p>
              </div>
              <Button variant="danger" size="sm" icon={LogOut} onClick={() => setLeaveOpen(true)} disabled={myGroup.hasSubmitted}>
                Leave group
              </Button>
            </div>
            <ul className="divide-y divide-slate-200">
              {myGroup.members.map((member) => (
                <li key={member.id} className="flex items-center justify-between py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{member.name}</p>
                    <p className="truncate text-xs text-slate-500">{member.email}</p>
                  </div>
                  {member.id === myGroup.leader.id && (
                    <Badge tone="warning" icon={Crown}>
                      Leader
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
            {myGroup.hasSubmitted && (
              <p className="text-xs text-slate-500">
                Your group has submitted an assignment for this course, so members can no longer leave.
              </p>
            )}
          </div>
        )}
      </section>

      <section id="join-list" className="card space-y-4 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-semibold">All groups in this course</h3>
          <div className="relative sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              value={joinQuery}
              onChange={(event) => setJoinQuery(event.target.value)}
              placeholder="Search groups"
              aria-label="Search groups"
              className={`${inputClassName(false)} pl-9`}
            />
          </div>
        </div>

        {joinableGroups.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            {myGroup ? 'You are in the only group in this course.' : 'There are no groups to join yet. Create one to get started.'}
          </p>
        ) : filteredJoinable.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">No groups match your search.</p>
        ) : (
          <ul className="divide-y divide-slate-200">
            {filteredJoinable.map((group) => (
              <li key={group.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{group.name}</p>
                  <p className="truncate text-xs text-slate-500">
                    {group.memberCount} member{group.memberCount === 1 ? '' : 's'} · Leader: {group.leader?.name ?? 'Unknown'}
                  </p>
                </div>
                {myGroup ? (
                  <Badge tone="neutral">Already in a group</Badge>
                ) : (
                  <Button size="sm" variant="secondary" icon={LogIn} onClick={() => handleJoin(group.id)}>
                    Join
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <Modal open={createOpen} title="Create a group" description="You will be the group leader and the only member who can acknowledge group submissions." onClose={() => setCreateOpen(false)} size="lg">
        <GroupForm submitting={submitting} onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} />
      </Modal>

      <ConfirmDialog
        open={leaveOpen}
        title="Leave this group?"
        description={myGroup?.name}
        confirmLabel="Leave group"
        tone="danger"
        loading={submitting}
        onConfirm={handleLeave}
        onClose={() => setLeaveOpen(false)}
      >
        <p className="text-sm text-slate-700">
          You will no longer be able to submit group work for this course. If you are the leader, leadership passes to another member.
        </p>
      </ConfirmDialog>
    </div>
  );
}
