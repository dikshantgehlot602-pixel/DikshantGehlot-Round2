import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export function useLogout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  return () => {
    signOut();
    toast.success('You have been signed out.');
    navigate('/login', { replace: true });
  };
}
