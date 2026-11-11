import { getInitials } from '@/utils/formatters';

const SIZE_CLASSES = {
  sm: 'h-7 w-7 text-[11px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-14 w-14 text-lg',
};

export default function Avatar({ name, size = 'md', className = '' }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-800 ring-2 ring-white ${SIZE_CLASSES[size]} ${className}`}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
}
