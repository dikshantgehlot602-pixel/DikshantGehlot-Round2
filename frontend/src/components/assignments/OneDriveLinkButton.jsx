import { ExternalLink } from 'lucide-react';
import { buttonClasses } from '@/components/common/Button';

export default function OneDriveLinkButton({ href }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={buttonClasses({ variant: 'secondary', size: 'sm' })}>
      <ExternalLink className="h-4 w-4" aria-hidden="true" />
      Open OneDrive folder
    </a>
  );
}
