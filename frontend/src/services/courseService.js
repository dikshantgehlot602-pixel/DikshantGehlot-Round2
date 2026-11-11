import { ServiceError, simulateRequest } from './apiClient';
import { readDatabase } from './database';
import { findCourse, findUser, getStudentCourseProgress } from './submissionRules';

function decorateCourse(db, course) {
  return {
    id: course.id,
    name: course.name,
    code: course.code,
    description: course.description,
    theme: course.theme,
    icon: course.icon,
    createdAt: course.createdAt,
    professorId: course.professorId,
    professorName: findUser(db, course.professorId)?.name ?? 'Unassigned',
    studentCount: course.studentIds.length,
    assignmentCount: db.assignments.filter((assignment) => assignment.courseId === course.id).length,
  };
}

export function listProfessorCourses(professorId) {
  return simulateRequest(() => {
    const db = readDatabase();
    return db.courses
      .filter((course) => course.professorId === professorId)
      .map((course) => decorateCourse(db, course))
      .sort((first, second) => first.code.localeCompare(second.code));
  });
}

export function listStudentCourses(studentId) {
  return simulateRequest(() => {
    const db = readDatabase();
    return db.courses
      .filter((course) => course.studentIds.includes(studentId))
      .map((course) => ({
        ...decorateCourse(db, course),
        progress: getStudentCourseProgress(db, course.id, studentId),
      }))
      .sort((first, second) => first.code.localeCompare(second.code));
  });
}

export function getProfessorCourse(courseId, professorId) {
  return simulateRequest(() => {
    const db = readDatabase();
    const course = findCourse(db, courseId);
    if (!course) throw new ServiceError('This course could not be found.', 'NOT_FOUND');
    if (course.professorId !== professorId) {
      throw new ServiceError('You do not have access to this course.', 'FORBIDDEN');
    }
    return decorateCourse(db, course);
  });
}

export function getStudentCourse(courseId, studentId) {
  return simulateRequest(() => {
    const db = readDatabase();
    const course = findCourse(db, courseId);
    if (!course) throw new ServiceError('This course could not be found.', 'NOT_FOUND');
    if (!course.studentIds.includes(studentId)) {
      throw new ServiceError('You are not enrolled in this course.', 'FORBIDDEN');
    }
    return {
      ...decorateCourse(db, course),
      progress: getStudentCourseProgress(db, course.id, studentId),
    };
  });
}
