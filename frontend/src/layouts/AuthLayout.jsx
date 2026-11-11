import { Outlet } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 lg:flex-row">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-navy-900 p-12 text-white lg:flex lg:w-[44%]">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500">
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold">JoinEazy</span>
        </div>
        <div className="max-w-md space-y-5">
          <h2 className="text-3xl font-semibold leading-[1.2]">Run your courses, assignments and teams from one calm workspace.</h2>
          <p className="text-sm leading-[1.5] text-slate-300">
            Professors track every submission at a glance. Students acknowledge their work and coordinate with their group leader in seconds.
          </p>
        </div>
        <p className="text-xs text-slate-400">Demo build: all data is stored locally in this browser.</p>
      </aside>
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
