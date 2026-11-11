import { SUBMISSION_TYPES } from '@/utils/constants';
import { isDeadlinePassed, toPercent } from '@/utils/formatters';

function toUserSummary(user) {
  return user ? { id: user.id, name: user.name, email: user.email } : null;
}

export function findUser(db, userId) {
  return db.users.find((user) => user.id === userId) ?? null;
}

export function findCourse(db, courseId) {
  return db.courses.find((course) => course.id === courseId) ?? null;
}

export function findAssignment(db, assignmentId) {
  return db.assignments.find((assignment) => assignment.id === assignmentId) ?? null;
}

export function getCourseStudents(db, course) {
  return course.studentIds.map((id) => toUserSummary(findUser(db, id))).filter(Boolean);
}

export function buildGroupView(db, group) {
  const members = group.memberIds
    .map((id) => toUserSummary(findUser(db, id)))
    .filter(Boolean)
    .sort((first, second) => {
      if (first.id === group.leaderId) return -1;
      if (second.id === group.leaderId) return 1;
      return first.name.localeCompare(second.name);
    });
  return {
    id: group.id,
    courseId: group.courseId,
    name: group.name,
    createdAt: group.createdAt,
    leader: toUserSummary(findUser(db, group.leaderId)),
    members,
    memberCount: members.length,
  };
}

export function getCourseGroupViews(db, courseId) {
  return db.groups
    .filter((group) => group.courseId === courseId)
    .map((group) => buildGroupView(db, group))
    .sort((first, second) => first.name.localeCompare(second.name));
}

export function findStudentGroup(db, courseId, studentId) {
  return db.groups.find((group) => group.courseId === courseId && group.memberIds.includes(studentId)) ?? null;
}

export function findIndividualSubmission(db, assignmentId, studentId) {
  return (
    db.submissions.find(
      (submission) =>
        submission.assignmentId === assignmentId &&
        submission.submissionType === SUBMISSION_TYPES.INDIVIDUAL &&
        submission.studentId === studentId
    ) ?? null
  );
}

export function findGroupSubmission(db, assignmentId, groupId) {
  return (
    db.submissions.find(
      (submission) =>
        submission.assignmentId === assignmentId &&
        submission.submissionType === SUBMISSION_TYPES.GROUP &&
        submission.groupId === groupId
    ) ?? null
  );
}

export function getAssignmentTracking(db, assignment) {
  const course = findCourse(db, assignment.courseId);
  if (assignment.submissionType === SUBMISSION_TYPES.INDIVIDUAL) {
    const units = getCourseStudents(db, course).map((student) => ({
      id: student.id,
      name: student.name,
      email: student.email,
      submission: findIndividualSubmission(db, assignment.id, student.id),
    }));
    return buildTracking(SUBMISSION_TYPES.INDIVIDUAL, units);
  }

  const units = getCourseGroupViews(db, course.id).map((group) => ({
    id: group.id,
    name: group.name,
    leader: group.leader,
    members: group.members,
    memberCount: group.memberCount,
    submission: findGroupSubmission(db, assignment.id, group.id),
  }));
  return buildTracking(SUBMISSION_TYPES.GROUP, units);
}

function buildTracking(type, units) {
  const submitted = units.filter((unit) => unit.submission);
  const pending = units.filter((unit) => !unit.submission);
  return {
    type,
    total: units.length,
    submittedCount: submitted.length,
    pendingCount: pending.length,
    percent: toPercent(submitted.length, units.length),
    submitted,
    pending,
  };
}

export function getStudentAssignmentState(db, assignment, studentId) {
  if (assignment.submissionType === SUBMISSION_TYPES.INDIVIDUAL) {
    const submission = findIndividualSubmission(db, assignment.id, studentId);
    return {
      type: SUBMISSION_TYPES.INDIVIDUAL,
      group: null,
      leader: null,
      isLeader: false,
      submission,
      needsGroup: false,
      canAcknowledge: !submission,
    };
  }

  const groupRecord = findStudentGroup(db, assignment.courseId, studentId);
  if (!groupRecord) {
    return {
      type: SUBMISSION_TYPES.GROUP,
      group: null,
      leader: null,
      isLeader: false,
      submission: null,
      needsGroup: true,
      canAcknowledge: false,
    };
  }

  const group = buildGroupView(db, groupRecord);
  const isLeader = group.leader?.id === studentId;
  const submission = findGroupSubmission(db, assignment.id, group.id);
  return {
    type: SUBMISSION_TYPES.GROUP,
    group,
    leader: group.leader,
    isLeader,
    submission,
    needsGroup: false,
    canAcknowledge: isLeader && !submission,
  };
}

export function getStudentCourseProgress(db, courseId, studentId) {
  const assignments = db.assignments.filter((assignment) => assignment.courseId === courseId);
  const submitted = assignments.filter(
    (assignment) => getStudentAssignmentState(db, assignment, studentId).submission
  ).length;
  return { total: assignments.length, submitted, percent: toPercent(submitted, assignments.length) };
}

export function getStudentStatus(state, deadline) {
  if (state.submission) return 'submitted';
  if (state.needsGroup) return 'needs-group';
  return isDeadlinePassed(deadline) ? 'overdue' : 'pending';
}
