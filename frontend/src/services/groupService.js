import { ServiceError, simulateRequest } from './apiClient';
import { createId, readDatabase, updateDatabase } from './database';
import {
  buildGroupView,
  findCourse,
  findStudentGroup,
  getCourseGroupViews,
} from './submissionRules';

function assertEnrolled(db, courseId, studentId) {
  const course = findCourse(db, courseId);
  if (!course) throw new ServiceError('This course could not be found.', 'NOT_FOUND');
  if (!course.studentIds.includes(studentId)) {
    throw new ServiceError('You are not enrolled in this course.', 'FORBIDDEN');
  }
  return course;
}

function hasGroupSubmission(db, groupId) {
  return db.submissions.some((submission) => submission.groupId === groupId);
}

export function getCourseGroupsOverview(courseId, studentId) {
  return simulateRequest(() => {
    const db = readDatabase();
    const course = assertEnrolled(db, courseId, studentId);
    const myGroupRecord = findStudentGroup(db, courseId, studentId);
    const groups = getCourseGroupViews(db, courseId).map((group) => ({
      ...group,
      isMine: group.id === myGroupRecord?.id,
      hasSubmitted: hasGroupSubmission(db, group.id),
    }));
    return {
      course: { id: course.id, name: course.name, code: course.code },
      myGroup: myGroupRecord ? groups.find((group) => group.id === myGroupRecord.id) : null,
      groups,
    };
  });
}

export function listStudentGroupMemberships(studentId) {
  return simulateRequest(() => {
    const db = readDatabase();
    return db.courses
      .filter((course) => course.studentIds.includes(studentId))
      .map((course) => {
        const groupRecord = findStudentGroup(db, course.id, studentId);
        return {
          course: { id: course.id, name: course.name, code: course.code },
          group: groupRecord ? buildGroupView(db, groupRecord) : null,
        };
      })
      .sort((first, second) => first.course.code.localeCompare(second.course.code));
  });
}

export function createGroup(courseId, studentId, name) {
  return simulateRequest(() => {
    const trimmedName = name.trim();
    return updateDatabase((draft) => {
      assertEnrolled(draft, courseId, studentId);
      if (findStudentGroup(draft, courseId, studentId)) {
        throw new ServiceError('You already belong to a group in this course. Leave it before creating a new one.', 'ALREADY_IN_GROUP');
      }
      const nameTaken = draft.groups.some(
        (group) => group.courseId === courseId && group.name.toLowerCase() === trimmedName.toLowerCase()
      );
      if (nameTaken) {
        throw new ServiceError('A group with this name already exists in this course. Choose a different name.', 'NAME_TAKEN');
      }
      const group = {
        id: createId('grp'),
        courseId,
        name: trimmedName,
        leaderId: studentId,
        memberIds: [studentId],
        createdAt: new Date().toISOString(),
      };
      draft.groups.push(group);
      return buildGroupView(draft, group);
    });
  });
}

export function joinGroup(groupId, studentId) {
  return simulateRequest(() =>
    updateDatabase((draft) => {
      const group = draft.groups.find((item) => item.id === groupId);
      if (!group) throw new ServiceError('This group no longer exists.', 'NOT_FOUND');
      assertEnrolled(draft, group.courseId, studentId);
      if (group.memberIds.includes(studentId)) {
        throw new ServiceError('You are already a member of this group.', 'ALREADY_MEMBER');
      }
      if (findStudentGroup(draft, group.courseId, studentId)) {
        throw new ServiceError('You already belong to a group in this course. You cannot join a second group.', 'ALREADY_IN_GROUP');
      }
      group.memberIds.push(studentId);
      return buildGroupView(draft, group);
    })
  );
}

export function leaveGroup(courseId, studentId) {
  return simulateRequest(() =>
    updateDatabase((draft) => {
      const group = findStudentGroup(draft, courseId, studentId);
      if (!group) throw new ServiceError('You are not currently in a group for this course.', 'NOT_IN_GROUP');
      if (hasGroupSubmission(draft, group.id)) {
        throw new ServiceError('Your group has already submitted an assignment, so you can no longer leave it.', 'GROUP_SUBMITTED');
      }
      const remainingMembers = group.memberIds.filter((memberId) => memberId !== studentId);
      if (remainingMembers.length === 0) {
        draft.groups = draft.groups.filter((item) => item.id !== group.id);
        return null;
      }
      group.memberIds = remainingMembers;
      if (group.leaderId === studentId) {
        group.leaderId = remainingMembers[0];
      }
      return buildGroupView(draft, group);
    })
  );
}
