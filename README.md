# Joineazy – Student, Group & Assignment Management

A responsive web application designed to simplify student, professor, course, assignment, and group management.

## 🔗 Project Links

- **Live Demo:** https://dikshant-gehlot-round2.vercel.app/login
- **GitHub Repository:** https://github.com/dikshantgehlot602-pixel/DikshantGehlot-Round2
- **Demo Video:** https://drive.google.com/file/d/1GYSQfsVadUvJdeBHBudnKasN1fqG0KFL/view?usp=sharing

## 📌 Project Overview

Joineazy is a role-based academic management application that provides separate workflows for Students and Professors.

Professors can manage courses and assignments, track submissions, and monitor student progress. Students can view their assignments, acknowledge submissions, and create or join groups for group assignments.

## ✨ Features

### 1. Authentication
- Student and Professor registration.
- Login with form validation.
- Role-based dashboard redirection.
- Session management.
- Protected routes.
- Logout functionality.

### 2. Professor Dashboard
- View assigned courses.
- Access course assignments.
- Create, edit, and manage assignments.
- Set assignment deadlines.
- Add OneDrive submission links.
- Select Individual or Group submission types.
- Track submitted and pending students/groups.
- View submission progress.

### 3. Student Dashboard
- View enrolled courses.
- View assignment details and deadlines.
- Access OneDrive links.
- Acknowledge individual submissions.
- View group submission acknowledgement.
- Track assignment completion status.

### 4. Group Management
- Create a group within a course.
- Join an existing group.
- View group members.
- Identify the group leader.
- Allow only group leaders to acknowledge group submissions.

### 5. UI/UX
- Responsive interface for desktop, tablet, and mobile.
- Assignment progress indicators.
- Overdue assignment highlighting.
- Toast notifications.
- Loading and empty states.
- Interactive hover effects and transitions.

## 🎨 Design Choices

- Separate dashboards for Students and Professors to provide role-specific experiences.
- Simple and intuitive navigation.
- Reusable components to maintain consistency.
- Clear status indicators for assignment submissions.
- Responsive layouts for different screen sizes.
- Form validation and feedback to improve usability.

## ⚙️ Installation & Setup

### Prerequisites
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/dikshantgehlot602-pixel/DikshantGehlot-Round2.git
```

### 2. Navigate to the frontend folder

```bash
cd DikshantGehlot-Round2/frontend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file if your application requires environment variables.

```env
[ADD YOUR ACTUAL ENVIRONMENT VARIABLES]
```

### 5. Start the development server

```bash
npm run dev
```

Open the local URL displayed in your terminal.

## 🔐 Demo Login Credentials

### Professor Account

- Email: [professor@joineazy.com]
- Password: [Professor123]
- Role: Professor

### Student Account

- Email: [student@joineazy.com]
- Password: [Student123]
- Role: Student

## 🎥 Demo Video

Watch the complete project demonstration:

[https://drive.google.com/file/d/1GYSQfsVadUvJdeBHBudnKasN1fqG0KFL/view?usp=sharing]

## 👨‍💻 Developer

**Dikshant Gehlot**

- GitHub: https://github.com/dikshantgehlot602-pixel

---

Built as part of the Joineazy Frontend Intern – Round 2 Assignment.
