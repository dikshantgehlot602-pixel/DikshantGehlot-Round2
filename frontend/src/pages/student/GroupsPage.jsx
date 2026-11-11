import { Link } from 'react-router-dom';
import { UsersRound, Plus, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAsyncData } from '@/hooks/useAsyncData';
import { listStudentGroupMemberships } from '@/services/groupService';
import PageHeader from '@/components/common/PageHeader';
import { CardGridSkeleton, EmptyState, ErrorState, PageHeaderSkeleton } from '@/components/common/StateViews';
import Badge from '@/components/common/Badge';
import Avatar from '@/components/common/Avatar';
import { buttonClasses } from '@/components/common/Button';
import { formatDateTime } from '@/utils/formatters';

function GroupCard({ membership }) {
  const { course, group } = membership;
  return (
    <article className="card flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between gap-2">
        <Badge>{course.code}</Badge>
        <Link to={`/student/groups/${course.id}`} className="inline-flex items-center gap-1 text-xs font-medium text-primary-700 hover:text-primary-800">
          Manage <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>
      <div>
        <h3 className="text-base font-semibold">{group.name}</h3>
        <p className="mt-1 text-xs text-slate-500">{course.name}</p>
      </div>
      <div className="flex -space-x-2">
        {group.members.slice(0, 5).map((member) => (
          <Avatar key={member.id} name={member.name} size="sm" className="ring-2 ring-white" />
        ))}
        {group.members.length > 5 && (
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600 ring-2 ring-white">
            +{group.members.length - 5}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-500">Leader: <span className="font-medium text-navy-900">{group.leader.name}</span></p>
      <p className="text-xs text-slate-400">Created {formatDateTime(group.createdAt)}</p>
    </article>
  );
}

function NoGroupCourseCard({ course }) {
  return (
    <article className="card flex items-center justify-between gap-4 p-5">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Badge>{course.code}</Badge>
          <span className="text-xs text-slate-500">No group</span>
        </div>
        <h3 className="mt-2 truncate text-sm font-medium">{course.name}</h3>
      </div>
      <Link to={`/student/groups/${course.id}`} className={buttonClasses({ variant: 'secondary', size: 'sm' })}>
        Create or join
      </Link>
    </article>
  );
}

export default function GroupsPage() {
  const { user } = useAuth();
  const { data: memberships, loading, error, reload } = useAsyncData(() => listStudentGroupMemberships(user.id), [user.id]);

  if (loading && !memberships) {
    return (
      <div className="space-y-8">
        <PageHeaderSkeleton />
        <CardGridSkeleton count={3} />
      </div>
    );
  }

  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  const withGroup = memberships.filter((item) => item.group);
  const withoutGroup = memberships.filter((item) => !item.group);

  return (
    <div className="space-y-8">
      <PageHeader
        title="My groups"
        description="Each course lets you join one group. The group leader submits work on behalf of every member."
      />

      {memberships.length === 0 ? (
        <EmptyState icon={UsersRound} title="No courses with group work" description="You have not been enrolled in a course that uses group assignments yet." />
      ) : (
        <div className="space-y-8">
          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Groups I belong to</h3>
            {withGroup.length === 0 ? (
              <EmptyState
                icon={Plus}
                title="You are not part of any group"
                description="You are not part of any group. Create or join one to submit this assignment."
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {withGroup.map((membership) => (
                  <GroupCard key={membership.course.id} membership={membership} />
                ))}
              </div>
            )}
          </section>

          {withoutGroup.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Courses without a group</h3>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {withoutGroup.map((membership) => (
                  <NoGroupCourseCard key={membership.course.id} course={membership.course} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
