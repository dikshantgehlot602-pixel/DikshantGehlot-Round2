import { ROLES, SUBMISSION_TYPES } from '@/utils/constants';

export const SEED_DATABASE_VERSION = 1;

export function createSeedDatabase(now = new Date()) {
  const at = (dayOffset, hour, minute = 0) => {
    const date = new Date(now);
    date.setDate(date.getDate() + dayOffset);
    date.setHours(hour, minute, 0, 0);
    return date.toISOString();
  };

  const users = [
    { id: 'usr-ananya', name: 'Prof. Ananya Rao', email: 'professor@joineazy.com', password: 'Professor123', role: ROLES.PROFESSOR, createdAt: at(-90, 9) },
    { id: 'usr-daniel', name: 'Prof. Daniel Brooks', email: 'daniel.brooks@joineazy.com', password: 'Professor123', role: ROLES.PROFESSOR, createdAt: at(-75, 9) },
    { id: 'usr-aarav', name: 'Aarav Sharma', email: 'student@joineazy.com', password: 'Student123', role: ROLES.STUDENT, createdAt: at(-60, 10) },
    { id: 'usr-maya', name: 'Maya Patel', email: 'maya.patel@joineazy.com', password: 'Student123', role: ROLES.STUDENT, createdAt: at(-60, 11) },
    { id: 'usr-liam', name: 'Liam Johnson', email: 'liam.johnson@joineazy.com', password: 'Student123', role: ROLES.STUDENT, createdAt: at(-59, 10) },
    { id: 'usr-sofia', name: 'Sofia Martinez', email: 'sofia.martinez@joineazy.com', password: 'Student123', role: ROLES.STUDENT, createdAt: at(-58, 14) },
    { id: 'usr-noah', name: 'Noah Kim', email: 'noah.kim@joineazy.com', password: 'Student123', role: ROLES.STUDENT, createdAt: at(-57, 9) },
    { id: 'usr-emma', name: 'Emma Wilson', email: 'emma.wilson@joineazy.com', password: 'Student123', role: ROLES.STUDENT, createdAt: at(-56, 16) },
    { id: 'usr-ethan', name: 'Ethan Brown', email: 'ethan.brown@joineazy.com', password: 'Student123', role: ROLES.STUDENT, createdAt: at(-55, 12) },
    { id: 'usr-olivia', name: 'Olivia Davis', email: 'olivia.davis@joineazy.com', password: 'Student123', role: ROLES.STUDENT, createdAt: at(-54, 13) },
    { id: 'usr-lucas', name: 'Lucas Garcia', email: 'lucas.garcia@joineazy.com', password: 'Student123', role: ROLES.STUDENT, createdAt: at(-53, 11) },
    { id: 'usr-priya', name: 'Priya Nair', email: 'priya.nair@joineazy.com', password: 'Student123', role: ROLES.STUDENT, createdAt: at(-52, 15) },
  ];

  const courses = [
    {
      id: 'crs-cs301',
      name: 'Web Application Development',
      code: 'CS301',
      description: 'Build production-grade interfaces with modern component architecture, routing and API integration.',
      professorId: 'usr-ananya',
      studentIds: ['usr-aarav', 'usr-maya', 'usr-liam', 'usr-sofia', 'usr-noah', 'usr-emma', 'usr-ethan', 'usr-olivia'],
      theme: 'blue',
      icon: 'code',
      createdAt: at(-80, 9),
    },
    {
      id: 'crs-cs210',
      name: 'Data Structures & Algorithms',
      code: 'CS210',
      description: 'Master arrays, trees, graphs and the complexity analysis needed to reason about efficient code.',
      professorId: 'usr-ananya',
      studentIds: ['usr-aarav', 'usr-maya', 'usr-liam', 'usr-noah', 'usr-lucas', 'usr-priya'],
      theme: 'emerald',
      icon: 'layers',
      createdAt: at(-80, 10),
    },
    {
      id: 'crs-ds405',
      name: 'Introduction to Machine Learning',
      code: 'DS405',
      description: 'Explore supervised learning, model evaluation and practical data preparation workflows.',
      professorId: 'usr-daniel',
      studentIds: ['usr-aarav', 'usr-sofia', 'usr-emma', 'usr-ethan', 'usr-lucas'],
      theme: 'amber',
      icon: 'brain',
      createdAt: at(-70, 9),
    },
    {
      id: 'crs-ba220',
      name: 'Product Management Fundamentals',
      code: 'BA220',
      description: 'Learn discovery, prioritisation and stakeholder communication through real product scenarios.',
      professorId: 'usr-daniel',
      studentIds: ['usr-maya', 'usr-sofia', 'usr-noah', 'usr-olivia', 'usr-priya'],
      theme: 'slate',
      icon: 'briefcase',
      createdAt: at(-70, 11),
    },
  ];

  const assignments = [
    {
      id: 'asg-portfolio',
      courseId: 'crs-cs301',
      title: 'Responsive Portfolio Landing Page',
      description: 'Design and build a responsive single-page portfolio using semantic HTML, modern CSS layout and accessible navigation.',
      deadline: at(-6, 23, 59),
      oneDriveLink: 'https://1drv.ms/f/s!portfolio-cs301',
      submissionType: SUBMISSION_TYPES.INDIVIDUAL,
      createdAt: at(-20, 9),
      updatedAt: at(-20, 9),
    },
    {
      id: 'asg-dashboard',
      courseId: 'crs-cs301',
      title: 'Team React Dashboard Project',
      description: 'Collaborate in your group to ship a dashboard with routing, state management and at least two data views.',
      deadline: at(5, 18, 0),
      oneDriveLink: 'https://onedrive.live.com/?cid=CS301-team-dashboard',
      submissionType: SUBMISSION_TYPES.GROUP,
      createdAt: at(-10, 9),
      updatedAt: at(-3, 15),
    },
    {
      id: 'asg-api-lab',
      courseId: 'crs-cs301',
      title: 'REST API Integration Lab',
      description: 'Connect the portfolio front end to a public REST API, handle loading and error states, and document the results.',
      deadline: at(12, 23, 59),
      oneDriveLink: 'https://1drv.ms/f/s!api-lab-cs301',
      submissionType: SUBMISSION_TYPES.INDIVIDUAL,
      createdAt: at(-4, 10),
      updatedAt: at(-4, 10),
    },
    {
      id: 'asg-trees',
      courseId: 'crs-cs210',
      title: 'Binary Trees Problem Set',
      description: 'Solve the eight traversal and balancing problems and submit a short write-up of the time complexity of each.',
      deadline: at(-2, 23, 59),
      oneDriveLink: 'https://1drv.ms/f/s!trees-cs210',
      submissionType: SUBMISSION_TYPES.INDIVIDUAL,
      createdAt: at(-14, 9),
      updatedAt: at(-14, 9),
    },
    {
      id: 'asg-graphs',
      courseId: 'crs-cs210',
      title: 'Graph Traversal Group Project',
      description: 'Implement breadth-first and depth-first search for a city map dataset and present the findings as a group.',
      deadline: at(3, 12, 0),
      oneDriveLink: 'https://onedrive.live.com/?cid=CS210-graph-project',
      submissionType: SUBMISSION_TYPES.GROUP,
      createdAt: at(-8, 9),
      updatedAt: at(-8, 9),
    },
    {
      id: 'asg-regression',
      courseId: 'crs-ds405',
      title: 'Regression Analysis Report',
      description: 'Fit linear and polynomial regression models to the housing dataset and write a short analytical report.',
      deadline: at(8, 17, 0),
      oneDriveLink: 'https://1drv.ms/f/s!regression-ds405',
      submissionType: SUBMISSION_TYPES.GROUP,
      createdAt: at(-9, 9),
      updatedAt: at(-9, 9),
    },
    {
      id: 'asg-cleaning',
      courseId: 'crs-ds405',
      title: 'Data Cleaning Exercise',
      description: 'Clean and normalise a messy customer dataset, documenting every transformation applied to each column.',
      deadline: at(1, 23, 59),
      oneDriveLink: 'https://1drv.ms/f/s!cleaning-ds405',
      submissionType: SUBMISSION_TYPES.INDIVIDUAL,
      createdAt: at(-12, 9),
      updatedAt: at(-12, 9),
    },
    {
      id: 'asg-persona',
      courseId: 'crs-ba220',
      title: 'Customer Persona Canvas',
      description: 'Interview two potential users and synthesise your findings into a persona canvas with clear pain points.',
      deadline: at(4, 23, 59),
      oneDriveLink: 'https://1drv.ms/f/s!persona-ba220',
      submissionType: SUBMISSION_TYPES.INDIVIDUAL,
      createdAt: at(-6, 9),
      updatedAt: at(-6, 9),
    },
  ];

  const groups = [
    {
      id: 'grp-pixel',
      courseId: 'crs-cs301',
      name: 'Team Pixel',
      leaderId: 'usr-aarav',
      memberIds: ['usr-aarav', 'usr-maya', 'usr-liam'],
      createdAt: at(-9, 12),
    },
    {
      id: 'grp-byte',
      courseId: 'crs-cs301',
      name: 'Byte Builders',
      leaderId: 'usr-sofia',
      memberIds: ['usr-sofia', 'usr-noah'],
      createdAt: at(-8, 12),
    },
    {
      id: 'grp-stack',
      courseId: 'crs-cs301',
      name: 'Stack Overflowers',
      leaderId: 'usr-emma',
      memberIds: ['usr-emma', 'usr-ethan'],
      createdAt: at(-8, 15),
    },
    {
      id: 'grp-algo',
      courseId: 'crs-cs210',
      name: 'Big O Crew',
      leaderId: 'usr-aarav',
      memberIds: ['usr-aarav', 'usr-lucas'],
      createdAt: at(-7, 10),
    },
    {
      id: 'grp-owls',
      courseId: 'crs-cs210',
      name: 'Night Owls',
      leaderId: 'usr-maya',
      memberIds: ['usr-maya', 'usr-priya', 'usr-noah'],
      createdAt: at(-7, 11),
    },
    {
      id: 'grp-gradient',
      courseId: 'crs-ds405',
      name: 'Gradient Descent',
      leaderId: 'usr-sofia',
      memberIds: ['usr-sofia', 'usr-emma'],
      createdAt: at(-6, 9),
    },
    {
      id: 'grp-tensor',
      courseId: 'crs-ds405',
      name: 'Tensor Titans',
      leaderId: 'usr-ethan',
      memberIds: ['usr-ethan', 'usr-lucas'],
      createdAt: at(-6, 10),
    },
  ];

  const individualAck = (assignmentId, studentId, acknowledgedAt) => {
    const student = users.find((user) => user.id === studentId);
    return {
      id: `sub-${assignmentId}-${studentId}`,
      assignmentId,
      studentId,
      groupId: null,
      submissionType: SUBMISSION_TYPES.INDIVIDUAL,
      acknowledgedBy: studentId,
      acknowledgedByName: student.name,
      acknowledgedAt,
    };
  };

  const groupAck = (assignmentId, groupId, acknowledgedAt) => {
    const group = groups.find((item) => item.id === groupId);
    const leader = users.find((user) => user.id === group.leaderId);
    return {
      id: `sub-${assignmentId}-${groupId}`,
      assignmentId,
      studentId: null,
      groupId,
      submissionType: SUBMISSION_TYPES.GROUP,
      acknowledgedBy: leader.id,
      acknowledgedByName: leader.name,
      acknowledgedAt,
    };
  };

  const submissions = [
    individualAck('asg-portfolio', 'usr-aarav', at(-7, 20, 15)),
    individualAck('asg-portfolio', 'usr-maya', at(-7, 21, 40)),
    individualAck('asg-portfolio', 'usr-liam', at(-6, 22, 5)),
    individualAck('asg-portfolio', 'usr-sofia', at(-6, 18, 30)),
    individualAck('asg-portfolio', 'usr-noah', at(-6, 23, 10)),
    individualAck('asg-api-lab', 'usr-aarav', at(-1, 10, 0)),
    individualAck('asg-api-lab', 'usr-maya', at(-1, 11, 25)),
    groupAck('asg-dashboard', 'grp-pixel', at(-1, 14, 20)),
    individualAck('asg-trees', 'usr-aarav', at(-3, 9, 45)),
    individualAck('asg-trees', 'usr-liam', at(-3, 16, 10)),
    individualAck('asg-trees', 'usr-lucas', at(-2, 20, 0)),
    groupAck('asg-regression', 'grp-gradient', at(-2, 10, 15)),
    individualAck('asg-cleaning', 'usr-sofia', at(-1, 8, 30)),
    individualAck('asg-cleaning', 'usr-emma', at(-1, 9, 10)),
    individualAck('asg-persona', 'usr-maya', at(-1, 17, 45)),
  ];

  return {
    version: SEED_DATABASE_VERSION,
    seededAt: now.toISOString(),
    users,
    courses,
    assignments,
    groups,
    submissions,
  };
}
