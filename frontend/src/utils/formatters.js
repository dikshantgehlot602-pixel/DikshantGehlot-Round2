import { format, formatDistanceToNowStrict, isPast, isToday, isTomorrow } from 'date-fns';

export function formatDate(value) {
  return format(new Date(value), 'MMM d, yyyy');
}

export function formatTime(value) {
  return format(new Date(value), 'h:mm a');
}

export function formatDateTime(value) {
  return format(new Date(value), 'MMM d, yyyy · h:mm a');
}

export function formatDeadline(value) {
  const date = new Date(value);
  if (isToday(date)) return `Today, ${format(date, 'h:mm a')}`;
  if (isTomorrow(date)) return `Tomorrow, ${format(date, 'h:mm a')}`;
  return format(date, 'EEE, MMM d · h:mm a');
}

export function formatRelativeToNow(value) {
  return `${formatDistanceToNowStrict(new Date(value))}${isPast(new Date(value)) ? ' ago' : ' from now'}`;
}

export function isDeadlinePassed(deadline) {
  return isPast(new Date(deadline));
}

export function toDeadlineIso(dateValue, timeValue) {
  const parsed = new Date(`${dateValue}T${timeValue}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

export function splitDeadline(isoValue) {
  const date = new Date(isoValue);
  return { date: format(date, 'yyyy-MM-dd'), time: format(date, 'HH:mm') };
}

export function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export function toPercent(part, total) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}
