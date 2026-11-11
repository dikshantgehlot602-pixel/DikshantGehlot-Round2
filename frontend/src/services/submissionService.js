import { SUBMISSION_TYPES } from '@/utils/constants';
import { ServiceError, simulateRequest } from './apiClient';
import { createId, updateDatabase } from './database';
import {
  findAssignment,
  findCourse,
  findGroupSubmission,
  findIndividualSubmission,
  findStudentGroup,
  findUser,
} from './submissionRules';

function assertStudentCanAccessAssignment(db, assignmentId, studentId) {
  const assignment = findAssignment(db, assignmentId);
  if (!assignment) throw new ServiceError('This assignment could not be found.', 'NOT_FOUND');
  const course = findCourse(db, assignment.courseId);
  if (!course?.studentIds.includes(studentId)) {
    throw new ServiceError('You are not enrolled in the course for this assignment.', 'FORBIDDEN');
  }
  return assignment;
}

export function acknowledgeIndividualSubmission(assignmentId, studentId) {
  return simulateRequest(() =>
    updateDatabase((draft) => {
      const assignment = assertStudentCanAccessAssignment(draft, assignmentId, studentId);
      if (assignment.submissionType !== SUBMISSION_TYPES.INDIVIDUAL) {
        throw new ServiceError('This is a group assignment. Your group leader must acknowledge it.', 'WRONG_TYPE');
      }
      if (findIndividualSubmission(draft, assignmentId, studentId)) {
        throw new ServiceError('You have already acknowledged this submission.', 'DUPLICATE');
      }
      const student = findUser(draft, studentId);
      const submission = {
        id: createId('sub'),
        assignmentId,
        studentId,
        groupId: null,
        submissionType: SUBMISSION_TYPES.INDIVIDUAL,
        acknowledgedBy: studentId,
        acknowledgedByName: student.name,
        acknowledgedAt: new Date().toISOString(),
      };
      draft.submissions.push(submission);
      return submission;
    })
  );
}

export function acknowledgeGroupSubmission(assignmentId, studentId) {
  return simulateRequest(() =>
    updateDatabase((draft) => {
      const assignment = assertStudentCanAccessAssignment(draft, assignmentId, studentId);
      if (assignment.submissionType !== SUBMISSION_TYPES.GROUP) {
        throw new ServiceError('This is an individual assignment. Acknowledge your own submission instead.', 'WRONG_TYPE');
      }
      const group = findStudentGroup(draft, assignment.courseId, studentId);
      if (!group) {
        throw new ServiceError('You need to create or join a group before you can submit this assignment.', 'NO_GROUP');
      }
      if (group.leaderId !== studentId) {
        throw new ServiceError('Only the group leader can acknowledge a group submission.', 'NOT_LEADER');
      }
      if (findGroupSubmission(draft, assignmentId, group.id)) {
        throw new ServiceError('Your group has already acknowledged this submission.', 'DUPLICATE');
      }
      const leader = findUser(draft, studentId);
      const submission = {
        id: createId('sub'),
        assignmentId,
        studentId: null,
        groupId: group.id,
        submissionType: SUBMISSION_TYPES.GROUP,
        acknowledgedBy: leader.id,
        acknowledgedByName: leader.name,
        acknowledgedAt: new Date().toISOString(),
      };
      draft.submissions.push(submission);
      return submission;
    })
  );
}
