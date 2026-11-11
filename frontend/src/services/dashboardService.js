import { readDatabase } from './database';
import { listProfessorAssignments, listStudentAssignments } from './assignmentService';
import { listProfessorCourses, listStudentCourses } from './courseService';
import { findCourse, findAssignment } from './submissionRules';
import { ROLES } from '@/utils/constants';

const RECENT_LIMIT = 5;
const SEARCH_LIMIT = 8;

function professorCourseIds(db, professorId) {
  return db.courses.filter((course) => course.professorId === professorId).map((course) => course.id);
}

function describeAcknowledgement(db, submission) {
  if (submission.groupId) {
    const group = db.groups.find((item) => item.id === submission.groupId);
    return `${submission.acknowledgedByName} submitted for ${group?.name ?? 'a group'}`;
  }
  return `${submission.acknowledgedByName} acknowledged their submission`;
}

export async function getProfessorDashboard(professorId) {
  const [courses, assignments] = await Promise.all([
    listProfessorCourses(professorId),
    listProfessorAssignments(professorId),
  ]);
  const db = readDatabase();
  const ownCourseIds = professorCourseIds(db, professorId);

  const activity = [
    ...db.submissions
      .filter((submission) => {
        const assignment = findAssignment(db, submission.assignmentId);
        return assignment && ownCourseIds.includes(assignment.courseId);
      })
      .map((submission) => {
        const assignment = findAssignment(db, submission.assignmentId);
        return {
          id: `activity-${submission.id}`,
          message: describeAcknowledgement(db, submission),
          detail: `${assignment.title} · ${findCourse(db, assignment.courseId)?.code ?? ''}`,
          at: submission.acknowledgedAt,
          href: `/professor/assignments/${assignment.id}`,
        };
      }),
    ...assignments.map((assignment) => ({
      id: `activity-created-${assignment.id}`,
      message: 'Assignment created',
      detail: `${assignment.title} · ${assignment.courseCode}`,
      at: assignment.createdAt,
      href: `/professor/assignments/${assignment.id}`,
    })),
  ]
    .sort((first, second) => new Date(second.at) - new Date(first.at))
    .slice(0, 8);

  return {
    stats: {
      totalCourses: courses.length,
      totalAssignments: assignments.length,
      totalSubmissions: assignments.reduce((sum, item) => sum + item.tracking.submittedCount, 0),
      pendingSubmissions: assignments.reduce((sum, item) => sum + item.tracking.pendingCount, 0),
    },
    courses,
    recentAssignments: [...assignments]
      .sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt))
      .slice(0, RECENT_LIMIT),
    submissionOverview: [...assignments]
      .sort((first, second) => new Date(first.deadline) - new Date(second.deadline))
      .slice(0, RECENT_LIMIT),
    activity,
  };
}

export async function getStudentDashboard(studentId) {
  const [courses, assignments] = await Promise.all([
    listStudentCourses(studentId),
    listStudentAssignments(studentId),
  ]);
  const submittedCount = assignments.filter((item) => item.isSubmitted).length;
  return {
    stats: {
      enrolledCourses: courses.length,
      totalAssignments: assignments.length,
      submittedAssignments: submittedCount,
      pendingAssignments: assignments.length - submittedCount,
    },
    courses,
    upcoming: assignments.filter((item) => !item.isSubmitted).slice(0, RECENT_LIMIT),
  };
}

export async function getNotifications(user) {
  if (user.role === ROLES.PROFESSOR) {
    const dashboard = await getProfessorDashboard(user.id);
    return dashboard.activity.slice(0, RECENT_LIMIT).map((item) => ({
      id: item.id,
      title: item.message,
      detail: item.detail,
      at: item.at,
      href: item.href,
    }));
  }
  const assignments = await listStudentAssignments(user.id);
  return assignments
    .filter((item) => !item.isSubmitted)
    .slice(0, RECENT_LIMIT)
    .map((item) => ({
      id: `notice-${item.id}`,
      title: item.isOverdue ? `Overdue: ${item.title}` : `Due soon: ${item.title}`,
      detail: `${item.courseCode} · deadline ${item.deadline}`,
      at: item.deadline,
      href: `/student/assignments/${item.id}`,
    }));
}

export async function searchWorkspace(user, query) {
  const term = query.trim().toLowerCase();
  if (term.length < 2) return [];

  const isProfessor = user.role === ROLES.PROFESSOR;
  const [courses, assignments] = await Promise.all([
    isProfessor ? listProfessorCourses(user.id) : listStudentCourses(user.id),
    isProfessor ? listProfessorAssignments(user.id) : listStudentAssignments(user.id),
  ]);

  const courseResults = courses
    .filter((course) => `${course.name} ${course.code}`.toLowerCase().includes(term))
    .map((course) => ({
      id: `course-${course.id}`,
      label: course.name,
      meta: course.code,
      href: isProfessor ? `/professor/courses/${course.id}/assignments` : `/student/courses/${course.id}/assignments`,
    }));

  const assignmentResults = assignments
    .filter((assignment) => `${assignment.title} ${assignment.courseCode}`.toLowerCase().includes(term))
    .map((assignment) => ({
      id: `assignment-${assignment.id}`,
      label: assignment.title,
      meta: assignment.courseCode,
      href: isProfessor ? `/professor/assignments/${assignment.id}` : `/student/assignments/${assignment.id}`,
    }));

  return [...courseResults, ...assignmentResults].slice(0, SEARCH_LIMIT);
}
