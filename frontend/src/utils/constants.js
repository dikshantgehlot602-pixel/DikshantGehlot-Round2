export const ROLES = {
  STUDENT: 'student',
  PROFESSOR: 'professor',
};

export const ROLE_LABELS = {
  [ROLES.STUDENT]: 'Student',
  [ROLES.PROFESSOR]: 'Professor',
};

export const SUBMISSION_TYPES = {
  INDIVIDUAL: 'individual',
  GROUP: 'group',
};

export const SUBMISSION_TYPE_LABELS = {
  [SUBMISSION_TYPES.INDIVIDUAL]: 'Individual',
  [SUBMISSION_TYPES.GROUP]: 'Group',
};

export const STORAGE_KEYS = {
  DATABASE: 'joineazy.db.v1',
  SESSION: 'joineazy.session.v1',
};

export const DATA_CHANGED_EVENT = 'joineazy:data-changed';

export const SESSION_DURATION_MS = {
  DEFAULT: 12 * 60 * 60 * 1000,
  REMEMBER_ME: 30 * 24 * 60 * 60 * 1000,
};

export const SERVICE_LATENCY_MS = 350;

export const MIN_PASSWORD_LENGTH = 8;

export const GROUP_NAME_LENGTH = { min: 3, max: 40 };

export const COURSE_THEMES = {
  blue: { tile: 'bg-primary-50 text-primary-700 ring-primary-100', bar: 'bg-primary-500' },
  emerald: { tile: 'bg-emerald-50 text-emerald-700 ring-emerald-100', bar: 'bg-emerald-500' },
  amber: { tile: 'bg-amber-50 text-amber-700 ring-amber-100', bar: 'bg-amber-500' },
  slate: { tile: 'bg-slate-100 text-slate-700 ring-slate-200', bar: 'bg-slate-600' },
};

export const DEMO_ACCOUNTS = {
  professor: { email: 'professor@joineazy.com', password: 'Professor123', label: 'Professor' },
  student: { email: 'student@joineazy.com', password: 'Student123', label: 'Student' },
};
