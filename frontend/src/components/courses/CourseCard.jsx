import { Link } from 'react-router-dom';
import { BookOpen, BrainCircuit, Briefcase, Code, Layers, Users, ClipboardList, ArrowRight } from 'lucide-react';
import { buttonClasses } from '@/components/common/Button';
import { COURSE_THEMES } from '@/utils/constants';
import { pluralize } from '@/utils/formatters';

const COURSE_ICONS = {
  code: Code,
  layers: Layers,
  brain: BrainCircuit,
  briefcase: Briefcase,
};

export default function CourseCard({ course, to, ctaLabel, professorLine, progress }) {
  const theme = COURSE_THEMES[course.theme] ?? COURSE_THEMES.blue;
  const Icon = COURSE_ICONS[course.icon] ?? BookOpen;

  return (
    <article className="card group flex flex-col p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-3">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${theme.tile}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold tracking-wide text-slate-700">{course.code}</span>
      </div>

      <h3 className="mt-4 text-base font-semibold leading-snug">{course.name}</h3>
      {professorLine && <p className="mt-1 text-xs text-slate-500">{professorLine}</p>}
      <p className="mt-2 line-clamp-2 text-sm text-slate-600">{course.description}</p>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
          {pluralize(course.studentCount, 'student')}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ClipboardList className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
          {pluralize(course.assignmentCount, 'assignment')}
        </span>
      </div>

      {progress && (
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-xs text-slate-600">
            <span>Completion</span>
            <span className="font-semibold text-navy-900">{progress.percent}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={progress.percent} aria-valuemin={0} aria-valuemax={100}>
            <div className={`h-full rounded-full transition-all duration-500 ${theme.bar}`} style={{ width: `${progress.percent}%` }} />
          </div>
        </div>
      )}

      <div className="mt-auto pt-5">
        <Link to={to} className={buttonClasses({ variant: 'secondary', size: 'sm', fullWidth: true })}>
          {ctaLabel}
          <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
