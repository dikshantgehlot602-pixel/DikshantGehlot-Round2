import { BookOpen, ClipboardList, LayoutDashboard, UserCircle, UsersRound } from 'lucide-react';
import { ROLES } from '@/utils/constants';

export const NAV_ITEMS = {
  [ROLES.PROFESSOR]: [
    { label: 'Dashboard', to: '/professor/dashboard', icon: LayoutDashboard },
    { label: 'My Courses', to: '/professor/courses', icon: BookOpen },
    { label: 'Assignments', to: '/professor/assignments', icon: ClipboardList },
    { label: 'Profile', to: '/professor/profile', icon: UserCircle },
  ],
  [ROLES.STUDENT]: [
    { label: 'Dashboard', to: '/student/dashboard', icon: LayoutDashboard },
    { label: 'My Courses', to: '/student/courses', icon: BookOpen },
    { label: 'Assignments', to: '/student/assignments', icon: ClipboardList },
    { label: 'My Group', to: '/student/groups', icon: UsersRound },
    { label: 'Profile', to: '/student/profile', icon: UserCircle },
  ],
};

export function getHomePath(role) {
  return `/${role}/dashboard`;
}

const PAGE_TITLES = [
  [/\/dashboard$/, 'Dashboard'],
  [/\/courses\/[^/]+\/assignments$/, 'Course assignments'],
  [/\/courses$/, 'My Courses'],
  [/\/assignments\/[^/]+$/, 'Assignment details'],
  [/\/assignments$/, 'Assignments'],
  [/\/groups(\/[^/]+)?$/, 'My Group'],
  [/\/profile$/, 'Profile'],
];

export function getPageTitle(pathname) {
  const match = PAGE_TITLES.find(([pattern]) => pattern.test(pathname));
  return match ? match[1] : 'JoinEazy';
}
