import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import AppLayout from '@/layouts/AppLayout';
import { GuestRoute, ProtectedRoute, RoleRoute } from '@/routes/guards';
import { useAuth } from '@/hooks/useAuth';
import { getHomePath } from '@/components/layout/navigation';
import { ROLES } from '@/utils/constants';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ProfessorDashboardPage from '@/pages/professor/DashboardPage';
import ProfessorCoursesPage from '@/pages/professor/CoursesPage';
import ProfessorCourseAssignmentsPage from '@/pages/professor/CourseAssignmentsPage';
import ProfessorAssignmentsPage from '@/pages/professor/AssignmentsPage';
import ProfessorAssignmentDetailPage from '@/pages/professor/AssignmentDetailPage';
import StudentDashboardPage from '@/pages/student/DashboardPage';
import StudentCoursesPage from '@/pages/student/CoursesPage';
import StudentAssignmentsPage from '@/pages/student/AssignmentsPage';
import StudentAssignmentDetailPage from '@/pages/student/AssignmentDetailPage';
import StudentGroupsPage from '@/pages/student/GroupsPage';
import StudentCourseGroupPage from '@/pages/student/CourseGroupPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import NotFoundPage from '@/pages/errors/NotFoundPage';

function HomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? getHomePath(user.role) : '/login'} replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />

      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path={`/${ROLES.PROFESSOR}`} element={<RoleRoute role={ROLES.PROFESSOR} />}>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ProfessorDashboardPage />} />
            <Route path="courses" element={<ProfessorCoursesPage />} />
            <Route path="courses/:courseId/assignments" element={<ProfessorCourseAssignmentsPage />} />
            <Route path="assignments" element={<ProfessorAssignmentsPage />} />
            <Route path="assignments/:assignmentId" element={<ProfessorAssignmentDetailPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path={`/${ROLES.STUDENT}`} element={<RoleRoute role={ROLES.STUDENT} />}>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboardPage />} />
            <Route path="courses" element={<StudentCoursesPage />} />
            <Route path="courses/:courseId/assignments" element={<StudentAssignmentsPage />} />
            <Route path="assignments" element={<StudentAssignmentsPage />} />
            <Route path="assignments/:assignmentId" element={<StudentAssignmentDetailPage />} />
            <Route path="groups" element={<StudentGroupsPage />} />
            <Route path="groups/:courseId" element={<StudentCourseGroupPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
