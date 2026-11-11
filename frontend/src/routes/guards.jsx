import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getHomePath } from '@/components/layout/navigation';

export function ProtectedRoute() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}

export function RoleRoute({ role }) {
  const { user } = useAuth();
  if (user.role !== role) {
    return <Navigate to={getHomePath(user.role)} replace />;
  }
  return <Outlet />;
}

export function GuestRoute() {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={getHomePath(user.role)} replace />;
  }
  return <Outlet />;
}
