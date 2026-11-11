import { isDeadlinePassed } from '@/utils/formatters';
import { ServiceError, simulateRequest } from './apiClient';
import { createId, readDatabase, updateDatabase } from './database';
import {
  findAssignment,
  findCourse,
  findUser,
  getAssignmentTracking,
  getStudentAssignmentState,
  getStudentStatus,
} from './submissionRules';

function getProfessorAssignmentStatus(tracking, deadline) {
  if (tracking.total > 0 && tracking.pendingCount === 0) return 'complete';
  return isDeadlinePassed(deadline) ? 'overdue' : 'open';
}

function toProfessorAssignmentView(db, assignment) {
  const course = findCourse(db, assignment.courseId);
  const tracking = getAssignmentTracking(db, assignment);
  return {
    id: assignment.id,
    courseId: assignment.courseId,
    courseName: course?.name ?? 'Unknown course',
    courseCode: course?.code ?? '',
    title: assignment.title,
    description: assignment.description,
    deadline: assignment.deadline,
    oneDriveLink: assignment.oneDriveLink,
    submissionType: assignment.submissionType,
    createdAt: assignment.createdAt,
    updatedAt: assignment.updatedAt,
    status: getProfessorAssignmentStatus(tracking, assignment.deadline),
    tracking: {
      type: tracking.type,
      total: tracking.total,
      submittedCount: tracking.submittedCount,
      pendingCount: tracking.pendingCount,
      percent: tracking.percent,
    },
  };
}

function assertProfessorOwnsCourse(db, courseId, professorId) {
  const course = findCourse(db, courseId);
  if (!course) throw new ServiceError('This course could not be found.', 'NOT_FOUND');
  if (course.professorId !== professorId) {
    throw new ServiceError('You do not have access to this course.', 'FORBIDDEN');
  }
  return course;
}

function assertProfessorOwnsAssignment(db, assignmentId, professorId) {
  const assignment = findAssignment(db, assignmentId);
  if (!assignment) throw new ServiceError('This assignment could not be found.', 'NOT_FOUND');
  assertProfessorOwnsCourse(db, assignment.courseId, professorId);
  return assignment;
}

export function listProfessorAssignments(professorId) {
  return simulateRequest(() => {
    const db = readDatabase();
    const ownCourseIds = db.courses.filter((course) => course.professorId === professorId).map((course) => course.id);
    return db.assignments
      .filter((assignment) => ownCourseIds.includes(assignment.courseId))
      .map((assignment) => toProfessorAssignmentView(db, assignment))
      .sort((first, second) => new Date(first.deadline) - new Date(second.deadline));
  });
}

export function listCourseAssignments(courseId, professorId) {
  return simulateRequest(() => {
    const db = readDatabase();
    const course = assertProfessorOwnsCourse(db, courseId, professorId);
    const assignments = db.assignments
      .filter((assignment) => assignment.courseId === courseId)
      .map((assignment) => toProfessorAssignmentView(db, assignment))
      .sort((first, second) => new Date(first.deadline) - new Date(second.deadline));
    return { course: { id: course.id, name: course.name, code: course.code }, assignments };
  });
}

export function getProfessorAssignment(assignmentId, professorId) {
  return simulateRequest(() => {
    const db = readDatabase();
    const assignment = assertProfessorOwnsAssignment(db, assignmentId, professorId);
    const course = findCourse(db, assignment.courseId);
    const tracking = getAssignmentTracking(db, assignment);
    return {
      assignment: toProfessorAssignmentView(db, assignment),
      course: { id: course.id, name: course.name, code: course.code },
      tracking,
    };
  });
}

function buildAssignmentFields(values) {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    deadline: values.deadline,
    oneDriveLink: values.oneDriveLink.trim(),
    submissionType: values.submissionType,
  };
}

export function createAssignment(professorId, courseId, values) {
  return simulateRequest(() => {
    const db = readDatabase();
    assertProfessorOwnsCourse(db, courseId, professorId);
    const now = new Date().toISOString();
    return updateDatabase((draft) => {
      const assignment = {
        id: createId('asg'),
        courseId,
        ...buildAssignmentFields(values),
        createdAt: now,
        updatedAt: now,
      };
      draft.assignments.push(assignment);
      return toProfessorAssignmentView(draft, assignment);
    });
  });
}

export function updateAssignment(assignmentId, professorId, values) {
  return simulateRequest(() =>
    updateDatabase((draft) => {
      const assignment = assertProfessorOwnsAssignment(draft, assignmentId, professorId);
      const hasSubmissions = draft.submissions.some((submission) => submission.assignmentId === assignmentId);
      if (hasSubmissions && values.submissionType !== assignment.submissionType) {
        throw new ServiceError(
          'Submission type cannot be changed after students have submitted. Existing submission records must stay consistent.',
          'TYPE_LOCKED'
        );
      }
      Object.assign(assignment, buildAssignmentFields(values), { updatedAt: new Date().toISOString() });
      return toProfessorAssignmentView(draft, assignment);
    })
  );
}

function toStudentAssignmentView(db, assignment, studentId) {
  const course = findCourse(db, assignment.courseId);
  const state = getStudentAssignmentState(db, assignment, studentId);
  const status = getStudentStatus(state, assignment.deadline);
  return {
    id: assignment.id,
    courseId: assignment.courseId,
    courseName: course?.name ?? 'Unknown course',
    courseCode: course?.code ?? '',
    professorName: findUser(db, course?.professorId)?.name ?? 'Unassigned',
    title: assignment.title,
    description: assignment.description,
    deadline: assignment.deadline,
    oneDriveLink: assignment.oneDriveLink,
    submissionType: assignment.submissionType,
    status,
    isSubmitted: Boolean(state.submission),
    isOverdue: !state.submission && isDeadlinePassed(assignment.deadline),
    acknowledgedAt: state.submission?.acknowledgedAt ?? null,
    acknowledgedByName: state.submission?.acknowledgedByName ?? null,
    needsGroup: state.needsGroup,
    isLeader: state.isLeader,
    leaderName: state.leader?.name ?? null,
    groupName: state.group?.name ?? null,
    canAcknowledge: state.canAcknowledge,
  };
}

export function listStudentAssignments(studentId) {
  return simulateRequest(() => {
    const db = readDatabase();
    const enrolledCourseIds = db.courses
      .filter((course) => course.studentIds.includes(studentId))
      .map((course) => course.id);
    return db.assignments
      .filter((assignment) => enrolledCourseIds.includes(assignment.courseId))
      .map((assignment) => toStudentAssignmentView(db, assignment, studentId))
      .sort((first, second) => new Date(first.deadline) - new Date(second.deadline));
  });
}

export function getStudentAssignment(assignmentId, studentId) {
  return simulateRequest(() => {
    const db = readDatabase();
    const assignment = findAssignment(db, assignmentId);
    if (!assignment) throw new ServiceError('This assignment could not be found.', 'NOT_FOUND');
    const course = findCourse(db, assignment.courseId);
    if (!course?.studentIds.includes(studentId)) {
      throw new ServiceError('You are not enrolled in the course for this assignment.', 'FORBIDDEN');
    }
    return {
      assignment: toStudentAssignmentView(db, assignment, studentId),
      course: { id: course.id, name: course.name, code: course.code },
    };
  });
}
